const User = require("../auth/auth.model");

const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role,
  isActive,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (role?.trim()) {
    query.role = role;
  }

  if (search?.trim()) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined && isActive !== "") {
    query.isActive = isActive === "true";
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  };
};

const getUserById = async (id) => {
  return await User.findById(id).select("-password -refreshToken");
};

const updateUserStatus = async (id, isActive) => {
  return await User.findByIdAndUpdate(
    id,
    { isActive },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password -refreshToken");
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
};
