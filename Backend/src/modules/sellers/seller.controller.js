const sellerService = require("./seller.service");

const apply = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await sellerService.applySeller(userId, req.body);

    res.status(201).json({
      message: "Application submitted",
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await sellerService.getMyApplication(userId);

    res.json({
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  apply,
  getMyApplication,
};