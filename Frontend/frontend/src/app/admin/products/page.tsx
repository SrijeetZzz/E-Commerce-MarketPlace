
// "use client";

// import { useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import toast from "react-hot-toast";

// import SearchInput from "@/components/admin/inputs/SearchInput";
// import FilterSelect from "@/components/admin/inputs/FilterSelect";
// import SortSelect from "@/components/admin/inputs/SortSelect";
// import Pagination from "@/components/admin/tables/Pagination";

// import ProductCard from "@/components/admin/products/ProductCard";
// import ProductModal from "@/components/admin/products/ProductModal";

// import { productSortOptions } from "@/lib/sortOptions";

// import {
//   createProduct,
//   deleteProduct,
//   getCategories,
//   getProducts,
//   getSubCategories,
//   updateProduct,
// } from "@/services/admin";

// import { Category, Product, ProductPayload, SubCategory } from "@/types/admin";

// const ProductsPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);

//   const [mode, setMode] = useState<"create" | "edit">("create");

//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   // -------------------------
//   // Search
//   // -------------------------

//   const [search, setSearch] = useState("");

//   // -------------------------
//   // Filters
//   // -------------------------

//   const [categoryId, setCategoryId] = useState("");

//   const [subCategoryId, setSubCategoryId] = useState("");

//   const [minPrice, setMinPrice] = useState("");

//   const [maxPrice, setMaxPrice] = useState("");

//   // -------------------------
//   // Sorting
//   // -------------------------

//   const [sort, setSort] = useState("latest");

//   // -------------------------
//   // Pagination
//   // -------------------------

//   const [page, setPage] = useState(1);

//   const [totalPages, setTotalPages] = useState(1);

//   // -------------------------
//   // Fetch Products
//   // -------------------------

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const response = await getProducts({
//         page,
//         limit: 12,
//         search,
//         sort,
//         categoryId,
//         subCategoryId,
//         minPrice,
//         maxPrice,
//       });

//       setProducts(response.data);

//       setTotalPages(response.pagination.pages);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------
//   // Load Filters
//   // -------------------------

//   const loadFilters = async () => {
//     try {
//       const [categoryRes, subCategoryRes] = await Promise.all([
//         getCategories(),
//         getSubCategories(),
//       ]);

//       setCategories(categoryRes);

//       setSubCategories(subCategoryRes);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to load filters");
//     }
//   };

//   // -------------------------
//   // Effects
//   // -------------------------

//   useEffect(() => {
//     loadFilters();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [page, search, sort, categoryId, subCategoryId, minPrice, maxPrice]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, sort, categoryId, subCategoryId, minPrice, maxPrice]);

//   // -------------------------
//   // Create Product
//   // -------------------------

//   const handleCreate = () => {
//     setSelectedProduct(null);
//     setMode("create");
//     setModalOpen(true);
//   };

//   // -------------------------
//   // Edit Product
//   // -------------------------

//   const handleEdit = (product: Product) => {
//     setSelectedProduct(product);
//     setMode("edit");
//     setModalOpen(true);
//   };

//   // -------------------------
//   // Delete Product
//   // -------------------------

//   const handleDelete = async (id: string) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this product?",
//     );

//     if (!confirmed) return;

//     try {
//       await deleteProduct(id);

//       toast.success("Product deleted successfully");

//       fetchProducts();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Unable to delete product");
//     }
//   };

//   // -------------------------
//   // Create / Update
//   // -------------------------

//   const handleSubmit = async (data: FormData | ProductPayload) => {
//     try {
//       if (mode === "create") {
//         await createProduct(data as FormData);

//         toast.success("Product created successfully");
//       } else if (selectedProduct) {
//         await updateProduct(selectedProduct._id, data as ProductPayload);

//         toast.success("Product updated successfully");
//       }

//       setModalOpen(false);

//       fetchProducts();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Operation failed");
//     }
//   };

//   // -------------------------
//   // Loading
//   // -------------------------

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-gray-500">Loading products...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-6">
//       {/* ---------------- Header ---------------- */}

//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Products</h1>

//           <p className="text-gray-500">Manage marketplace products</p>
//         </div>

//         <button
//           onClick={handleCreate}
//           className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
//         >
//           <Plus size={18} />
//           Add Product
//         </button>
//       </div>

//       {/* ---------------- Filters ---------------- */}

//       <div className="rounded-lg border bg-white p-4">
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
//           <SearchInput
//             value={search}
//             onChange={setSearch}
//             placeholder="Search products..."
//           />

//           <FilterSelect
//             value={categoryId}
//             onChange={setCategoryId}
//             placeholder="All Categories"
//             options={categories.map((category) => ({
//               label: category.name,
//               value: category._id,
//             }))}
//           />
//           <FilterSelect
//             value={subCategoryId}
//             onChange={setSubCategoryId}
//             placeholder="All Subcategories"
//             options={subCategories
//               .filter((subCategory) =>
//                 categoryId ? subCategory.categoryId === categoryId : true,
//               )
//               .map((subCategory) => ({
//                 label: subCategory.name,
//                 value: subCategory._id,
//               }))}
//           />
//           <input
//             type="number"
//             placeholder="Min Price"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//             className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//           />

//           <input
//             type="number"
//             placeholder="Max Price"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//             className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//           />

//           <SortSelect
//             value={sort}
//             onChange={setSort}
//             options={productSortOptions}
//           />

//           <button
//             onClick={() => {
//               setSearch("");
//               setCategoryId("");
//               setSubCategoryId("");
//               setMinPrice("");
//               setMaxPrice("");
//               setSort("latest");
//             }}
//             className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* ---------------- Products ---------------- */}

//       {!products.length ? (
//         <div className="rounded-lg border bg-white py-20 text-center text-gray-500">
//           No products found.
//         </div>
//       ) : (
//         <>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {products.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>

//           {/* ---------------- Pagination ---------------- */}

//           <Pagination
//             page={page}
//             totalPages={totalPages}
//             onPageChange={setPage}
//           />
//         </>
//       )}

//       {/* ---------------- Product Modal ---------------- */}

//       <ProductModal
//         isOpen={modalOpen}
//         mode={mode}
//         product={selectedProduct}
//         categories={categories}
//         subCategories={subCategories}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// };

// export default ProductsPage;


"use client";

import { useEffect, useState } from "react";
import { Plus, PackageX, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import SearchInput from "@/components/admin/inputs/SearchInput";
import FilterSelect from "@/components/admin/inputs/FilterSelect";
import SortSelect from "@/components/admin/inputs/SortSelect";
import Pagination from "@/components/admin/tables/Pagination";

import ProductCard from "@/components/admin/products/ProductCard";
import ProductModal from "@/components/admin/products/ProductModal";

import { productSortOptions } from "@/lib/sortOptions";

import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  getSubCategories,
  updateProduct,
} from "@/services/admin";

import { Category, Product, ProductPayload, SubCategory } from "@/types/admin";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // -------------------------
  // Search
  // -------------------------

  const [search, setSearch] = useState("");

  // -------------------------
  // Filters
  // -------------------------

  const [categoryId, setCategoryId] = useState("");

  const [subCategoryId, setSubCategoryId] = useState("");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  // -------------------------
  // Sorting
  // -------------------------

  const [sort, setSort] = useState("latest");

  // -------------------------
  // Pagination
  // -------------------------

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  // -------------------------
  // Fetch Products
  // -------------------------

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        page,
        limit: 12,
        search,
        sort,
        categoryId,
        subCategoryId,
        minPrice,
        maxPrice,
      });

      setProducts(response.data);

      setTotalPages(response.pagination.pages);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Load Filters
  // -------------------------

  const loadFilters = async () => {
    try {
      const [categoryRes, subCategoryRes] = await Promise.all([
        getCategories(),
        getSubCategories(),
      ]);

      setCategories(categoryRes);

      setSubCategories(subCategoryRes);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load filters");
    }
  };

  // -------------------------
  // Effects
  // -------------------------

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, sort, categoryId, subCategoryId, minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, categoryId, subCategoryId, minPrice, maxPrice]);

  // -------------------------
  // Create Product
  // -------------------------

  const handleCreate = () => {
    setSelectedProduct(null);
    setMode("create");
    setModalOpen(true);
  };

  // -------------------------
  // Edit Product
  // -------------------------

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setMode("edit");
    setModalOpen(true);
  };

  // -------------------------
  // Delete Product
  // -------------------------

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      toast.success("Product deleted successfully");

      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Unable to delete product");
    }
  };

  // -------------------------
  // Create / Update
  // -------------------------

  const handleSubmit = async (data: FormData | ProductPayload) => {
    try {
      if (mode === "create") {
        await createProduct(data as FormData);

        toast.success("Product created successfully");
      } else if (selectedProduct) {
        await updateProduct(selectedProduct._id, data as ProductPayload);

        toast.success("Product updated successfully");
      }

      setModalOpen(false);

      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // -------------------------
  // Loading
  // -------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* ---------------- Header ---------------- */}

      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Inventory & Catalog
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
            Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Manage marketplace product offerings, pricing, and active listings.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus size={18} className="stroke-[2.5]" />
          Add Product
        </button>
      </div>

      {/* ---------------- Filters ---------------- */}

      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />

          <FilterSelect
            value={categoryId}
            onChange={setCategoryId}
            placeholder="All Categories"
            options={categories.map((category) => ({
              label: category.name,
              value: category._id,
            }))}
          />

          <FilterSelect
            value={subCategoryId}
            onChange={setSubCategoryId}
            placeholder="All Subcategories"
            options={subCategories
              .filter((subCategory) =>
                categoryId ? subCategory.categoryId === categoryId : true,
              )
              .map((subCategory) => ({
                label: subCategory.name,
                value: subCategory._id,
              }))}
          />

          <div className="relative">
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="relative">
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          <SortSelect
            value={sort}
            onChange={setSort}
            options={productSortOptions}
          />

          <button
            onClick={() => {
              setSearch("");
              setCategoryId("");
              setSubCategoryId("");
              setMinPrice("");
              setMaxPrice("");
              setSort("latest");
            }}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 shadow-sm transition-colors hover:bg-rose-50/50 hover:text-rose-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ---------------- Products Grid ---------------- */}

      {!products.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
            <PackageX size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-zinc-100">
            No products found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Try adjusting your search filters or add a new product to the catalog.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* ---------------- Pagination ---------------- */}

          <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-zinc-800">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* ---------------- Product Modal ---------------- */}

      <ProductModal
        isOpen={modalOpen}
        mode={mode}
        product={selectedProduct}
        categories={categories}
        subCategories={subCategories}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductsPage;