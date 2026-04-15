const SellerApplication = require("../sellers/seller.model");
const User = require("../auth/auth.model");

const getAllApplications = async () => {
  return await SellerApplication.find().populate("userId", "name email");
};

const approveApplication = async (applicationId) => {
  const application = await SellerApplication.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "PENDING") {
    throw new Error("Application already processed");
  }

  // update application
  application.status = "APPROVED";
  application.reviewedAt = new Date();
  await application.save();

  // update user role
  await User.findByIdAndUpdate(application.userId, {
    role: "SELLER",
  });

  return application;
};

const rejectApplication = async (applicationId, reason) => {
  const application = await SellerApplication.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "PENDING") {
    throw new Error("Application already processed");
  }

  application.status = "REJECTED";
  application.rejectionReason = reason;
  application.reviewedAt = new Date();

  await application.save();

  return application;
};

module.exports = {
  getAllApplications,
  approveApplication,
  rejectApplication,
};