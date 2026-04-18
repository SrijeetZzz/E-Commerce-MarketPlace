"use client";

import { useRouter } from "next/navigation";

const CategoryCard = ({ category }: any) => {
  const router = useRouter();

  // 🔥 SAFE ACCESS (handles backend inconsistency)
  const subs =
    category?.subcategories ||
    category?.subCategories ||
    [];

  const images = subs.slice(0, 4);

  return (
    <div
      onClick={() => router.push(`/category/${category._id}`)}
      className="relative cursor-pointer group rounded-xl overflow-hidden"
    >
      {/* GRID */}
      <div className="grid grid-cols-2 grid-rows-2 h-64">

        {images.length > 0 ? (
          images.map((sub: any, i: number) => (
            <img
              key={i}
              src={sub?.image || "/placeholder.png"}
              className="w-full h-full object-cover"
              alt={sub?.name || "subcategory"}
            />
          ))
        ) : (
          <div className="col-span-2 row-span-2 flex items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <h2 className="text-white text-xl font-semibold">
          {category?.name || "Category"}
        </h2>
      </div>
    </div>
  );
};

export default CategoryCard;