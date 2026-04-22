"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import Footer from "@/components/home/Footer";
import BlogPage from "@/components/home/Blog";
import AboutPage from "@/components/home/AboutUs";
import { Contact } from "lucide-react";
import ContactPage from "@/components/home/ContactUs";

const HomePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");

        // 🔥 interceptor returns data directly
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="w-full">

      {/* HERO */}
      <HeroSection />

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-10">

        <h2 className="text-2xl font-semibold mb-6">
          Shop by Category
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : (
          <CategoryGrid categories={categories} />
        )}

      </section>
      <BlogPage/>
      <AboutPage/>
      <ContactPage/>

    </main>
    
  );
};

export default HomePage;