"use client";

import { useEffect, useState } from "react";
import { getTopProducts } from "@/services/dashboard";
import api from "@/services/api";

import { TopProduct } from "@/types/dashboard";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
}

const COLORS = ["#4f46e5", "#16a34a", "#f59e0b", "#ef4444", "#0ea5e9"];

export default function TopProducts({ range }: { range: string }) {
  const [data, setData] = useState<TopProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [loading, setLoading] = useState(true);

  // fetch filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const catRes = await api.get("/categories");
        const subRes = await api.get("/categories/subcategories");

        setCategories(catRes.data.data || []);
        setSubCategories(subRes.data.data || []);
      } catch (err) {
        console.error("Filter fetch error:", err);
      }
    };

    fetchFilters();
  }, []);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const result = await getTopProducts(
          range,
          categoryId || undefined,
          subCategoryId || undefined,
        );

        setData(result || []);
      } catch (err) {
        console.error("Top products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [range, categoryId, subCategoryId]);

  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === categoryId,
  );

  // 🔥 transform for pie
  const chartData = data.map((p) => ({
    name: p.productName,
    value: p.quantitySold,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 hover:shadow-md transition">
      {/* HEADER */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Top Products</h2>
        <p className="text-xs text-slate-500">
          Best performing products by sales volume
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* CATEGORY */}
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategoryId("");
          }}
         className="w-full md:w-40 lg:w-48 border border-slate-200 px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          className="w-full md:w-40 lg:w-48 border border-slate-200 px-3 py-2 rounded-md text-sm"
          disabled={!categoryId}
        >
          <option value="">All Subcategories</option>
          {filteredSubCategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="h-65 flex items-center justify-center text-sm text-slate-400">
          Loading chart...
        </div>
      ) : data.length === 0 ? (
        <div className="h-65 flex items-center justify-center text-sm text-slate-400">
          No products found
        </div>
      ) : (
        <ResponsiveContainer width="99%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => {
                if (typeof value === "number") {
                  return `${value} sold`;
                }
                return value;
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
