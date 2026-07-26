
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FolderTree, Layers, Plus } from "lucide-react";

import DataTable from "@/components/admin/tables/DataTable";
import ActionButtons from "@/components/admin/ui/ActionButtons";

import CategoryModal from "@/components/admin/category/CategoryModal";
import SubCategoryModal from "@/components/admin/category/SubCategoryModal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "@/services/admin";

import {
  Category,
  SubCategory,
} from "@/types/admin";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [showSubCategoryModal, setShowSubCategoryModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);

  /* ---------------- FETCH CATEGORIES ---------------- */

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await getCategories();

      setCategories(response);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  /* ---------------- FETCH SUBCATEGORIES ---------------- */

  const fetchSubCategories = async (
    categoryId: string
  ) => {
    try {
      setLoadingSubCategories(true);

      const response = await getSubCategories(categoryId);

      setSubCategories(response);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subcategories");
    } finally {
      setLoadingSubCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- CATEGORY CRUD ---------------- */

  const handleCategorySubmit = async (name: string) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, {
          name,
        });

        toast.success("Category updated successfully");
      } else {
        await createCategory({
          name,
        });

        toast.success("Category created successfully");
      }

      setShowCategoryModal(false);
      setEditingCategory(null);

      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to save category"
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);

      toast.success("Category deleted");

      if (selectedCategory?._id === id) {
        setSelectedCategory(null);
        setSubCategories([]);
      }

      fetchCategories();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  /* ---------------- SUBCATEGORY CRUD ---------------- */

  const handleSubCategorySubmit = async (
    name: string
  ) => {
    if (!selectedCategory) {
      toast.error("Select a category first");
      return;
    }

    try {
      if (editingSubCategory) {
        await updateSubCategory(editingSubCategory._id, {
          name,
          categoryId: selectedCategory._id,
        });

        toast.success("Subcategory updated successfully");
      } else {
        await createSubCategory({
          name,
          categoryId: selectedCategory._id,
        });

        toast.success("Subcategory created successfully");
      }

      setShowSubCategoryModal(false);
      setEditingSubCategory(null);

      fetchSubCategories(selectedCategory._id);
      fetchCategories();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to save subcategory"
      );
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;

    try {
      await deleteSubCategory(id);

      toast.success("Subcategory deleted");

      if (selectedCategory) {
        fetchSubCategories(selectedCategory._id);
        fetchCategories();
      }
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to delete subcategory"
      );
    }
  };

  /* ---------------- SELECT CATEGORY ---------------- */

  const handleSelectCategory = async (
    category: Category
  ) => {
    setSelectedCategory(category);

    await fetchSubCategories(category._id);
  };

  /* ---------------- CATEGORY TABLE ---------------- */

  const categoryColumns = [
    {
      key: "name",
      label: "Category",
      render: (row: Category) => {
        const isSelected = selectedCategory?._id === row._id;

        return (
          <div className="flex items-center gap-2">
            {isSelected && (
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
            <span
              className={`text-sm font-semibold ${
                isSelected
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-900 dark:text-zinc-100"
              }`}
            >
              {row.name}
            </span>
          </div>
        );
      },
    },
    {
      key: "subcategories",
      label: "Subcategories",
      render: () => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
          5
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row: Category) => (
        <span className="text-xs text-slate-600 dark:text-zinc-400">
          {new Date(row.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Category) => (
        <ActionButtons
          actions={[
            {
              label: "Manage",
              variant: "secondary",
              onClick: () => handleSelectCategory(row),
            },
            {
              label: "Edit",
              variant: "primary",
              onClick: () => {
                setEditingCategory(row);
                setShowCategoryModal(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () =>
                handleDeleteCategory(row._id),
            },
          ]}
        />
      ),
    },
  ];

  /* ---------------- SUBCATEGORY TABLE ---------------- */

  const subCategoryColumns = [
    {
      key: "name",
      label: "Subcategory",
      render: (row: SubCategory) => (
        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
          {row.name}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row: SubCategory) => (
        <span className="text-xs text-slate-600 dark:text-zinc-400">
          {new Date(row.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SubCategory) => (
        <ActionButtons
          actions={[
            {
              label: "Edit",
              variant: "primary",
              onClick: () => {
                setEditingSubCategory(row);
                setShowSubCategoryModal(true);
              },
            },
            {
              label: "Delete",
              variant: "danger",
              onClick: () =>
                handleDeleteSubCategory(row._id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">

        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Taxonomy & Navigation
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
              Category Management
            </h1>

            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Organize product taxonomy and manage hierarchical subcategories.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus size={16} className="stroke-[2.5]" />
            Add Category
          </button>
        </div>

        {/* Categories Section */}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              Parent Categories
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <DataTable
              columns={categoryColumns}
              data={categories}
              isLoading={loadingCategories}
            />
          </div>
        </div>

        {/* Subcategories Section */}

        <div className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                {selectedCategory ? (
                  <span className="flex items-center gap-2">
                    Subcategories
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-500/20">
                      {selectedCategory.name}
                    </span>
                  </span>
                ) : (
                  "Subcategories"
                )}
              </h2>
            </div>

            {selectedCategory && (
              <button
                onClick={() => {
                  setEditingSubCategory(null);
                  setShowSubCategoryModal(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <Plus size={14} className="stroke-[2.5]" />
                Add Subcategory
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <DataTable
              columns={subCategoryColumns}
              data={subCategories}
              isLoading={loadingSubCategories}
              emptyText={
                selectedCategory
                  ? "No subcategories found for this category."
                  : "Select a category above and click 'Manage' to view its subcategories."
              }
            />
          </div>
        </div>
      </div>

      {/* Category Modal */}

      <CategoryModal
        open={showCategoryModal}
        category={editingCategory}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
      />

      {/* SubCategory Modal */}

      <SubCategoryModal
        open={showSubCategoryModal}
        subCategory={editingSubCategory}
        categoryId={selectedCategory?._id ?? ""}
        onClose={() => {
          setShowSubCategoryModal(false);
          setEditingSubCategory(null);
        }}
        onSubmit={handleSubCategorySubmit}
      />
    </>
  );
}