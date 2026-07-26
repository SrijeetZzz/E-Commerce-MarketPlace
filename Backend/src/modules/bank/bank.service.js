const User = require("../auth/auth.model");
const BankDetails = require("./bank.model");
const paginate = require("../../shared/utils/pagination");
const getSort = require("../../shared/utils/sorting");
const buildBankSearch = require("../../shared/utils/search/buildBankSearch");

// ---------------- SELLER ----------------

const submitBankDetails = async (sellerId, data) => {
  const existing = await BankDetails.findOne({ sellerId });

  if (existing) {
    throw new Error("Bank details already submitted");
  }

  return await BankDetails.create({
    sellerId,
    ...data,
  });
};

const getMyBankDetails = async (sellerId) => {
  return await BankDetails.findOne({ sellerId });
};

// ---------------- ADMIN ----------------

const getAllBankDetails = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sort = "latest",
    search = "",
    status,
  } = queryParams;

  const query = buildBankSearch(search);

  if (status) {
    query.status = status;
  }

  const {
    skip,
    limit: pageSize,
    pagination,
  } = await paginate(BankDetails, query, page, limit);

  const bankDetails = await BankDetails.find(query)
    .populate("sellerId", "name email")
    .sort(getSort(sort))
    .skip(skip)
    .limit(pageSize);

  return {
    data: bankDetails,
    pagination,
  };
};

// const verifyBank = async (id) => {
//   const bank = await BankDetails.findById(id);

//   if (!bank) throw new Error("Bank details not found");

//   if (bank.status !== "PENDING") {
//     throw new Error("Already processed");
//   }

//   bank.status = "VERIFIED";
//   bank.verifiedAt = new Date();

//   await bank.save();

//   return bank;
// };


const verifyBank = async (id) => {
  const bank = await BankDetails.findById(id);

  if (!bank) {
    throw new Error("Bank details not found");
  }

  if (bank.status !== "PENDING") {
    throw new Error("Already processed");
  }

  // Verify bank details
  bank.status = "VERIFIED";
  bank.verifiedAt = new Date();
  await bank.save();

  // Mark seller as KYC verified
  await User.findByIdAndUpdate(
    bank.sellerId,
    {
      isVerified: true,
    },
    {
      new: true,
    }
  );

  return bank;
};

const rejectBank = async (id, reason) => {
  if (!reason) {
    throw new Error("Rejection reason is required");
  }

  const bank = await BankDetails.findById(id);

  if (!bank) throw new Error("Bank details not found");

  if (bank.status !== "PENDING") {
    throw new Error("Already processed");
  }

  bank.status = "REJECTED";
  bank.rejectionReason = reason;

  await bank.save();

  return bank;
};

module.exports = {
  submitBankDetails,
  getMyBankDetails,

  // admin
  getAllBankDetails,
  verifyBank,
  rejectBank,
};