const userService = require("./admin.users.service");

const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await userService.updateUserStatus(
      req.params.id,
      isActive
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Update User Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
};