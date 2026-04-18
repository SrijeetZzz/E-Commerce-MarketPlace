"use client";

const SubCategoryTabs = ({ subcategories, active, setActive }: any) => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

        {/* ALL */}
        <button
          onClick={() => setActive("all")}
          className={`px-6 py-3 rounded-full text-sm ${
            active === "all"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        {subcategories.map((sub: any) => (
          <button
            key={sub._id}
            onClick={() => setActive(sub._id)}
            className={`px-6 py-3 rounded-full text-sm ${
              active === sub._id
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryTabs;