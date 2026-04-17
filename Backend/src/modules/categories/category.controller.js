const categoryService = require("./category.service");

exports.getCategories = async (req, res) => {
  try {
    const data = await categoryService.getCategories();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const data = await categoryService.getSubCategories(categoryId);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subcategories",
    });
  }
};
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const data = await categoryService.createCategory(name);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const data = await categoryService.updateCategory(id, name);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryService.deleteCategory(id);

    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};