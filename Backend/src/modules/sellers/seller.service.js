const SellerApplication = require("./seller.model");

const applySeller = async (userId, data) => {
  // check if already applied
  const existing = await SellerApplication.findOne({ userId });

  if (existing) {
    throw new Error("Application already exists");
  }

  const application = await SellerApplication.create({
    userId,
    ...data,
  });

  return application;
};

const getMyApplication = async (userId) => {
  return await SellerApplication.findOne({ userId });
};

module.exports = {
  applySeller,
  getMyApplication,
};