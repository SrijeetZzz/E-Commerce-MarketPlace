const SellerApplication = require("./seller.model");
const User = require("../auth/auth.model");

const applySeller = async (userId, data) => {
  const existing = await SellerApplication.findOne({
    userId,
  });

  if (existing) {
    throw new Error("Application already exists");
  }

  const {
    businessName,
    businessType,
    gstNumber,
    phone,
    address,
    city,
    state,
    pincode,
    documents,
  } = data;

  if (
    !businessName ||
    !businessType ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    throw new Error("Missing required fields");
  }

  const application = await SellerApplication.create({
    userId,
    businessName,
    businessType,
    gstNumber,
    phone,
    address,
    city,
    state,
    pincode,

    documents: documents || [],
  });

  return application;
};

const getMyApplication = async (userId) => {
  const application = await SellerApplication.findOne({
    userId,
  });

  if (!application) {
    throw new Error("No application found");
  }

  return application;
};

module.exports = {
  applySeller,
  getMyApplication,
};
