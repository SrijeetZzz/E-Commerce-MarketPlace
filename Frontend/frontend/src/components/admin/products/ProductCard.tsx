// import Image from "next/image";
// import { Pencil, Trash2 } from "lucide-react";

// import { Product } from "@/types/admin";
// import { getImageUrl } from "@/lib/utils";



// interface ProductCardProps {
//   product: Product;
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
// }

// const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
// const image = getImageUrl(product.images?.[0]);
//   return (
//     <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
//       <div className="relative h-52 w-full bg-gray-100">
//         <img
//           src={getImageUrl(product.images?.[0])}
//           alt={product.title}
//           className="h-full w-full object-cover"
//         />
//       </div>

//       <div className="space-y-3 p-4">
//         <div>
//           <h3 className="line-clamp-1 text-lg font-semibold">
//             {product.title}
//           </h3>

//           <p className="text-sm text-gray-500">{product.brand}</p>
//         </div>

//         <div className="space-y-1 text-sm">
//           <p>
//             <span className="font-medium">Category:</span>{" "}
//             {product.categoryId.name}
//           </p>

//           <p>
//             <span className="font-medium">Subcategory:</span>{" "}
//             {product.subCategoryId.name}
//           </p>

//           <p>
//             <span className="font-medium">Price:</span> ₹
//             {product.priceRange.min} - ₹{product.priceRange.max}
//           </p>
//         </div>

//         <div className="flex gap-2 pt-2">
//           <button
//             onClick={() => onEdit(product)}
//             className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
//           >
//             <Pencil size={18} />
//             Edit
//           </button>

//           <button
//             onClick={() => onDelete(product._id)}
//             className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import { Product } from "@/types/admin";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const image = getImageUrl(product.images?.[0]);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
        {image ? (
          <img
            src={image}
            alt={product.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
            No image available
          </div>
        )}

        {/* Category Overlay Tag */}
        {product.categoryId?.name && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md dark:bg-zinc-100/90 dark:text-zinc-900">
              {product.categoryId.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-3">
          <div>
            {product.brand && (
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {product.brand}
              </p>
            )}
            <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-zinc-100">
              {product.title}
            </h3>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
            {product.subCategoryId?.name && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500">Subcategory</span>
                <span className="font-medium text-slate-800 dark:text-zinc-200">
                  {product.subCategoryId.name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 dark:text-zinc-500">Price Range</span>
              <span className="font-mono font-bold text-slate-900 dark:text-zinc-50">
                ₹{product.priceRange.min.toLocaleString("en-IN")} - ₹{product.priceRange.max.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => onEdit(product)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
          >
            <Pencil size={14} className="stroke-[2.2]" />
            Edit
          </button>

          <button
            onClick={() => onDelete(product._id)}
            className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
            title="Delete product"
          >
            <Trash2 size={14} className="stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;