"use client";

import CategoryCard from "./CategoryCard";

const CategoryGrid = ({ categories }: any) => {
  if (!categories || categories.length === 0) {
    return <p className="text-gray-500">No categories found</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((cat: any) => (
        <CategoryCard key={cat._id} category={cat} />
      ))}
    </div>
  );
};

export default CategoryGrid;