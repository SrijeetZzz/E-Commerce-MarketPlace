const adminService = require("./admin.service");

const getApplications = async (req, res) => {
  try {
    const data = await adminService.getAllApplications();

    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
};