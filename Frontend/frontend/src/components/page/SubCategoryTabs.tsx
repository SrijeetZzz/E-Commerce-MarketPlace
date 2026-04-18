"use client";

const SubCategoryTabs = ({ subcategories, active, setActive }: any) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <button
        onClick={() => setActive("all")}
        className={`h-12 px-4 rounded-full text-sm flex items-center justify-center text-center min-w-0 truncate ${
          active === "all" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        All
      </button>

      {subcategories.map((sub: any) => (
        <button
          key={sub._id}
          onClick={() => setActive(sub._id)}
          className={`h-12 px-4 rounded-full text-sm flex items-center justify-center text-center min-w-0 truncate ${
            active === sub._id ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
};

export default SubCategoryTabs;
