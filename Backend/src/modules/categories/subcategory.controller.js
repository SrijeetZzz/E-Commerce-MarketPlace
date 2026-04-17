const service = require("./subcategory.service");

const createSubCategory = async (req, res) => {
  try {
    const data = await service.createSubCategory(req.body);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const data = await service.updateSubCategory(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    await service.deleteSubCategory(req.params.id);

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};