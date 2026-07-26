"use client";

import ProductForm from "./ProductForm";

import {
  Category,
  Product,
  ProductPayload,
  SubCategory,
} from "@/types/admin";

interface ProductModalProps {
  isOpen: boolean;
  mode: "create" | "edit";

  product?: Product | null;

  categories: Category[];
  subCategories: SubCategory[];

  onClose: () => void;

  onSubmit: (
    data: FormData | ProductPayload
  ) => Promise<void>;
}

const ProductModal = ({
  isOpen,
  mode,
  product,

  categories,
  subCategories,

  onClose,
  onSubmit,
}: ProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">
            {mode === "create"
              ? "Create Product"
              : "Edit Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <ProductForm
            mode={mode}
            product={product}
            categories={categories}
            subCategories={subCategories}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductModal;