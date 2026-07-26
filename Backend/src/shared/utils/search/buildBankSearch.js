const buildBankSearch = (search) => {
  if (!search?.trim()) return {};

  return {
    $or: [
      { accountHolderName: { $regex: search, $options: "i" } },
      { accountNumber: { $regex: search, $options: "i" } },
      { ifscCode: { $regex: search, $options: "i" } },
    ],
  };
};

module.exports = buildBankSearch;