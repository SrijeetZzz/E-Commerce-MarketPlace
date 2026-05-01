const Category = require("./category.model");
const SubCategory = require("./subcategory.model");
const Product = require("../products/product.model");

const getCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

const getSubCategories = async (categoryId) => {
  const filter = {};

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  return await SubCategory.find(filter).sort({ name: 1 });
};

const createCategory = async (name) => {
  const existing = await Category.findOne({ name });

  if (existing) {
    throw new Error("Category already exists");
  }

  return await Category.create({ name });
};

// UPDATE
const updateCategory = async (id, name) => {
  const category = await Category.findById(id);

  if (!category) throw new Error("Category not found");

  category.name = name;
  await category.save();

  return category;
};

// DELETE
const deleteCategory = async (id) => {
  // 🔥 CHECK PRODUCTS
  const productExists = await Product.findOne({ categoryId: id });

  if (productExists) {
    throw new Error("Cannot delete category with products");
  }

  // 🔥 DELETE SUBCATEGORIES FIRST
  await SubCategory.deleteMany({ categoryId: id });

  return await Category.findByIdAndDelete(id);
};


module.exports = {
  getCategories,
  getSubCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};