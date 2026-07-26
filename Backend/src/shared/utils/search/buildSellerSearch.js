const buildSellerSearch = (search) => {
  if (!search?.trim()) return {};

  return {
    $or: [
      { businessName: { $regex: search, $options: "i" } },
      { businessType: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { state: { $regex: search, $options: "i" } },
      { gstNumber: { $regex: search, $options: "i" } },
    ],
  };
};

module.exports = buildSellerSearch;