const SubCategory = require("./subcategory.model");
const Category = require("./category.model");
const Product = require("../products/product.model");

// CREATE
const createSubCategory = async ({ name, categoryId }) => {
  if (!name || !categoryId) {
    throw new Error("Name and categoryId are required");
  }

  // 🔥 check category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Invalid category");
  }

  // 🔥 prevent duplicate inside same category
  const existing = await SubCategory.findOne({ name, categoryId });
  if (existing) {
    throw new Error("Subcategory already exists in this category");
  }

  return await SubCategory.create({ name, categoryId });
};

// UPDATE
const updateSubCategory = async (id, { name, categoryId }) => {
  const sub = await SubCategory.findById(id);
  if (!sub) throw new Error("Subcategory not found");

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Invalid category");

    sub.categoryId = categoryId;
  }

  if (name) sub.name = name;

  await sub.save();
  return sub;
};

// DELETE
const deleteSubCategory = async (id) => {
  // 🔥 prevent delete if used
  const productExists = await Product.findOne({ subCategoryId: id });

  if (productExists) {
    throw new Error("Cannot delete subcategory used in products");
  }

  return await SubCategory.findByIdAndDelete(id);
};

module.exports = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};