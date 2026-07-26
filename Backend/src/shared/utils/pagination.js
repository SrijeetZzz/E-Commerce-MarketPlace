const paginate = async (model, query = {}, page = 1, limit = 10) => {
  page = Math.max(parseInt(page) || 1, 1);
  limit = Math.max(parseInt(limit) || 10, 1);

  const skip = (page - 1) * limit;

  const total = await model.countDocuments(query);

  return {
    skip,
    limit,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  };
};

module.exports = paginate;
