"use client";

import CategoryCard from "./CategoryCard";

const CategoryGrid = ({ categories }: any) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-800">
        <p className="text-gray-500 font-medium">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat: any) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
      
      {/* Decorative subtle background element (optional) */}
      <div className="mt-12 flex justify-center">
        <div className="h-px w-24 bg-linear-to-r from-transparent via-gray-700 to-transparent" />
      </div>
    </section>
  );
};

export default CategoryGrid;