const SellerApplication = require("../sellers/seller.model");
const User = require("../auth/auth.model");
const paginate = require("../../shared/utils/pagination");
const getSort = require("../../shared/utils/sorting");
const buildSellerSearch = require("../../shared/utils/search/buildSellerSearch");


const getAllSellers = async () => {
  const sellers = await User.find(
    { role: "SELLER" },
    "name email"
  ).sort({ name: 1 });

  return sellers;
};

const getAllApplications = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sort = "latest",
    search = "",
    status,
  } = queryParams;

  const query = buildSellerSearch(search);

  if (status) {
    query.status = status;
  }

  const {
    skip,
    limit: pageSize,
    pagination,
  } = await paginate(SellerApplication, query, page, limit);

  const applications = await SellerApplication.find(query)
    .populate("userId", "name email")
    .sort(getSort(sort))
    .skip(skip)
    .limit(pageSize);

  return {
    data: applications,
    pagination,
  };
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
  getAllSellers
};