"use client";

import { useEffect, useState } from "react";

import { SubCategory } from "@/types/admin";

type Props = {
  open: boolean;
  subCategory: SubCategory | null;
  categoryId: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export default function SubCategoryModal({
  open,
  subCategory,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
    } else {
      setName("");
    }
  }, [subCategory, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-6 text-xl font-bold">
          {subCategory
            ? "Edit Subcategory"
            : "Add Subcategory"}
        </h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Subcategory Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subcategory name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(name)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            {subCategory ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}