const buildProductSearch = (search) => {
  if (!search?.trim()) return {};

  return {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ],
  };
};

module.exports = buildProductSearch;