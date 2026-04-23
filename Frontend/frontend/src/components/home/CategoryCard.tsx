// "use client";

// import { useRouter } from "next/navigation";

// const CategoryCard = ({ category }: any) => {
//   const router = useRouter();

//   // 🔥 SAFE ACCESS (handles backend inconsistency)
//   const subs =
//     category?.subcategories ||
//     category?.subCategories ||
//     [];

//   const images = subs.slice(0, 4);

//   return (
//     <div
//       onClick={() => router.push(`/category/${category._id}`)}
//       className="relative cursor-pointer group rounded-xl overflow-hidden"
//     >
//       {/* GRID */}
//       <div className="grid grid-cols-2 grid-rows-2 h-64">

//         {images.length > 0 ? (
//           images.map((sub: any, i: number) => (
//             <img
//               key={i}
//               src={sub?.image || "/placeholder.png"}
//               className="w-full h-full object-cover"
//               alt={sub?.name || "subcategory"}
//             />
//           ))
//         ) : (
//           <div className="col-span-2 row-span-2 flex items-center justify-center bg-gray-200 text-gray-500">
//             No Image
//           </div>
//         )}

//       </div>

//       {/* OVERLAY */}
//       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//         <h2 className="text-white text-xl font-semibold">
//           {category?.name || "Category"}
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default CategoryCard;
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

const CategoryCard = ({ category }: { category: Category }) => {
  const router = useRouter();

  const categoryImage = `/${category?.name
    ?.toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "")}.png`;

  return (
    <div
      onClick={() => router.push(`/category/${category._id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1a1a1a] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* ASPECT RATIO CONTAINER */}
      <div className="relative w-full aspect-[2.2/1] overflow-hidden">
        
        {/* BACKGROUND GLOW (Dynamic backlighting) */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* IMAGE LAYER - Using "Slide & Fade" instead of Zoom */}
        <div className="relative h-full w-full transition-all duration-700 ease-in-out group-hover:translate-x-3 group-hover:rotate-1">
          <img
            src={categoryImage}
            alt={category?.name}
            className="h-full w-full object-contain p-4 drop-shadow-2xl transition-transform duration-700"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
            }}
          />
        </div>

        {/* MASK OVERLAY (Modern frosted glass effect) */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
      </div>

      {/* TEXT CONTENT - "The Floating Label" */}
      <div className="absolute inset-0 flex items-end p-6">
        <div className="flex w-full items-end justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-white transition-transform duration-500 group-hover:-translate-y-1">
              {category?.name || "Category"}
            </h3>
            <div className="h-1 w-0 bg-white transition-all duration-500 group-hover:w-full" />
          </div>

          {/* ICON - Circular arrow that rotates on hover */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-360 group-hover:bg-white group-hover:text-black">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-5 w-5"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>

      {/* OUTER GLOW BORDER */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 transition-colors duration-500 group-hover:border-white/20" />
    </div>
  );
};

export default CategoryCard;