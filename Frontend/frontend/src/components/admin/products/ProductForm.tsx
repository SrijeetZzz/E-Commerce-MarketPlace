// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Category,
//   Product,
//   ProductPayload,
//   SubCategory,
// } from "@/types/admin";

// interface ProductFormProps {
//   mode: "create" | "edit";
//   product?: Product | null;

//   categories: Category[];
//   subCategories: SubCategory[];

//   onSubmit: (data: FormData | ProductPayload) => Promise<void>;
//   onCancel: () => void;
// }

// const ProductForm = ({
//   mode,
//   product,
//   categories,
//   subCategories,
//   onSubmit,
//   onCancel,
// }: ProductFormProps) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [brand, setBrand] = useState("");

//   const [categoryId, setCategoryId] = useState("");
//   const [subCategoryId, setSubCategoryId] = useState("");

//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");

//   const [tags, setTags] = useState("");

//   const [images, setImages] = useState<FileList | null>(null);

//   useEffect(() => {
//     if (!product) return;

//     setTitle(product.title);
//     setDescription(product.description);
//     setBrand(product.brand);

//     setCategoryId(product.categoryId._id);
//     setSubCategoryId(product.subCategoryId._id);

//     setMinPrice(product.priceRange.min.toString());
//     setMaxPrice(product.priceRange.max.toString());

//     setTags(product.tags.join(", "));
//   }, [product]);

//   const filteredSubCategories = useMemo(() => {
//     return subCategories.filter(
//       (sub) => sub.categoryId === categoryId
//     );
//   }, [categoryId, subCategories]);

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     if (mode === "create") {
//       const formData = new FormData();

//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("brand", brand);

//       formData.append("categoryId", categoryId);
//       formData.append("subCategoryId", subCategoryId);

//       formData.append(
//         "priceRange",
//         JSON.stringify({
//           min: Number(minPrice),
//           max: Number(maxPrice),
//         })
//       );

//       formData.append(
//         "tags",
//         JSON.stringify(
//           tags
//             .split(",")
//             .map((t) => t.trim())
//             .filter(Boolean)
//         )
//       );

//       if (images) {
//         Array.from(images).forEach((file) =>
//           formData.append("images", file)
//         );
//       }

//       await onSubmit(formData);

//       return;
//     }

//     const payload: ProductPayload = {
//       title,
//       description,
//       brand,
//       categoryId,
//       subCategoryId,

//       priceRange: {
//         min: Number(minPrice),
//         max: Number(maxPrice),
//       },

//       tags: tags
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean),
//     };

//     await onSubmit(payload);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-5"
//     >
//       <input
//         className="w-full rounded border p-2"
//         placeholder="Product title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <textarea
//         className="w-full rounded border p-2"
//         rows={4}
//         placeholder="Description"
//         value={description}
//         onChange={(e) =>
//           setDescription(e.target.value)
//         }
//       />

//       <input
//         className="w-full rounded border p-2"
//         placeholder="Brand"
//         value={brand}
//         onChange={(e) => setBrand(e.target.value)}
//       />

//       <select
//         className="w-full rounded border p-2"
//         value={categoryId}
//         onChange={(e) => {
//           setCategoryId(e.target.value);
//           setSubCategoryId("");
//         }}
//       >
//         <option value="">Select Category</option>

//         {categories.map((cat) => (
//           <option
//             key={cat._id}
//             value={cat._id}
//           >
//             {cat.name}
//           </option>
//         ))}
//       </select>

//       <select
//         className="w-full rounded border p-2"
//         value={subCategoryId}
//         onChange={(e) =>
//           setSubCategoryId(e.target.value)
//         }
//       >
//         <option value="">
//           Select Subcategory
//         </option>

//         {filteredSubCategories.map((sub) => (
//           <option
//             key={sub._id}
//             value={sub._id}
//           >
//             {sub.name}
//           </option>
//         ))}
//       </select>

//       <div className="grid grid-cols-2 gap-4">
//         <input
//           type="number"
//           className="rounded border p-2"
//           placeholder="Minimum Price"
//           value={minPrice}
//           onChange={(e) =>
//             setMinPrice(e.target.value)
//           }
//         />

//         <input
//           type="number"
//           className="rounded border p-2"
//           placeholder="Maximum Price"
//           value={maxPrice}
//           onChange={(e) =>
//             setMaxPrice(e.target.value)
//           }
//         />
//       </div>

//       <input
//         className="w-full rounded border p-2"
//         placeholder="Tags (comma separated)"
//         value={tags}
//         onChange={(e) => setTags(e.target.value)}
//       />

//       {mode === "create" && (
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={(e) =>
//             setImages(e.target.files)
//           }
//         />
//       )}

//       <div className="flex justify-end gap-3">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="rounded bg-gray-300 px-4 py-2"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           className="rounded bg-blue-600 px-4 py-2 text-white"
//         >
//           {mode === "create"
//             ? "Create Product"
//             : "Update Product"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ProductForm;

"use client";

import { useEffect, useMemo, useState } from "react";
import { Upload, X, Tag as TagIcon, IndianRupee } from "lucide-react";
import {
  Category,
  Product,
  ProductPayload,
  SubCategory,
} from "@/types/admin";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product | null;

  categories: Category[];
  subCategories: SubCategory[];

  onSubmit: (data: FormData | ProductPayload) => Promise<void>;
  onCancel: () => void;
}

const ProductForm = ({
  mode,
  product,
  categories,
  subCategories,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [tags, setTags] = useState("");

  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (!product) return;

    setTitle(product.title);
    setDescription(product.description);
    setBrand(product.brand);

    setCategoryId(product.categoryId._id);
    setSubCategoryId(product.subCategoryId._id);

    setMinPrice(product.priceRange.min.toString());
    setMaxPrice(product.priceRange.max.toString());

    setTags(product.tags.join(", "));
  }, [product]);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(
      (sub) => sub.categoryId === categoryId
    );
  }, [categoryId, subCategories]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (mode === "create") {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("brand", brand);

      formData.append("categoryId", categoryId);
      formData.append("subCategoryId", subCategoryId);

      formData.append(
        "priceRange",
        JSON.stringify({
          min: Number(minPrice),
          max: Number(maxPrice),
        })
      );

      formData.append(
        "tags",
        JSON.stringify(
          tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );

      if (images) {
        Array.from(images).forEach((file) =>
          formData.append("images", file)
        );
      }

      await onSubmit(formData);

      return;
    }

    const payload: ProductPayload = {
      title,
      description,
      brand,
      categoryId,
      subCategoryId,

      priceRange: {
        min: Number(minPrice),
        max: Number(maxPrice),
      },

      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-left"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
            placeholder="e.g. Oversized Heavyweight Cotton Hoodie"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Brand Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
              placeholder="e.g. WEARIX"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Search Tags
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="hoodie, streetwear, winter"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <TagIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
              Comma separated values
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
            rows={4}
            placeholder="Detailed description of materials, fit, care instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Categorization */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubCategoryId("");
            }}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Subcategory <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500 disabled:opacity-50"
            value={subCategoryId}
            disabled={!categoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
          Price Range (INR) <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="number"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              required
            />
            <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400 dark:text-zinc-500">
              ₹
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              required
            />
            <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400 dark:text-zinc-500">
              ₹
            </span>
          </div>
        </div>
      </div>

      {/* Images Upload Area (Creation Mode Only) */}
      {mode === "create" && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Product Images
          </label>
          <div className="relative flex min-h-25 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 transition-colors hover:bg-slate-100/50 dark:border-zinc-700 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <Upload className="mb-2 h-6 w-6 text-slate-400 dark:text-zinc-500" />
            <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">
              {images && images.length > 0
                ? `${images.length} file(s) selected`
                : "Click or drag images here to upload"}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
              PNG, JPG, or WEBP up to 5MB each
            </p>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {mode === "create" ? "Create Product" : "Update Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;