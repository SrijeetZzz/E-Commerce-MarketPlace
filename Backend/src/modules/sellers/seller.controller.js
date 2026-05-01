const sellerService = require("./seller.service");

const apply = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await sellerService.applySeller(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Seller application submitted",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await sellerService.getMyApplication(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  apply,
  getMyApplication,
};
