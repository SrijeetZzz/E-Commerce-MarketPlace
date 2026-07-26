const getSort = (sort) => {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };

    case "latest":
      return { createdAt: -1 };

    case "priceLow":
      return { "priceRange.min": 1 };

    case "priceHigh":
      return { "priceRange.min": -1 };

    case "amountLow":
      return { totalAmount: 1 };

    case "amountHigh":
      return { totalAmount: -1 };

    default:
      return { createdAt: -1 };
  }
};

module.exports = getSort;