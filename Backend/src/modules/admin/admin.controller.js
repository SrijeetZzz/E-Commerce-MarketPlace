const adminService = require("./admin.service");

const getAllSellers = async (req, res) => {
  try {
    const sellers = await adminService.getAllSellers();

    res.status(200).json({
      success: true,
      data: sellers,
    });
  } catch (error) {
    console.error("Get Sellers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sellers",
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const result = await adminService.getAllApplications(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const approve = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await adminService.approveApplication(id);

    res.json({
      message: "Application approved",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const reject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await adminService.rejectApplication(id, reason);

    res.json({
      message: "Application rejected",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getApplications,
  approve,
  reject,
  getAllSellers
};