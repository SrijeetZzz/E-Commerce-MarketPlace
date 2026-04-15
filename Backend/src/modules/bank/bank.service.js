const BankDetails = require("./bank.model");

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

const verifyBank = async (id) => {
  const bank = await BankDetails.findById(id);

  if (!bank) throw new Error("Not found");

  bank.status = "VERIFIED";
  bank.verifiedAt = new Date();

  await bank.save();

  return bank;
};

const rejectBank = async (id, reason) => {
  const bank = await BankDetails.findById(id);

  if (!bank) throw new Error("Not found");

  bank.status = "REJECTED";
  bank.rejectionReason = reason;

  await bank.save();

  return bank;
};

module.exports = {
  submitBankDetails,
  getMyBankDetails,
  verifyBank,
  rejectBank,
};