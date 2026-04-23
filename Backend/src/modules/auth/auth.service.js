const User = require("./auth.model");
const bcrypt = require("bcryptjs");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../shared/utils/token");

// 🔥 REGISTER
const registerUser = async (data) => {
  const { name, email, password } = data;

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  // 🔥 NEW TOKEN SYSTEM
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// 🔥 LOGIN
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// 🔥 REFRESH TOKEN
const refreshAccessToken = async (token) => {
  const jwt = require("jsonwebtoken");

  if (!token) throw new Error("No refresh token");

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);

  return { accessToken: newAccessToken };
};

// 🔥 LOGOUT
const logoutUser = async (token) => {
  console.log("LOGOUT TOKEN:", token);

  const user = await User.findOne({ refreshToken: token });

  console.log("USER FOUND:", user?._id);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};

// 🔥 GET ME
const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  return user;
};

const updateAvatar = async (userId, file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const avatarPath = `/uploads/${file.filename}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarPath },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const { name, email } = data;

  // basic validation
  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  // check email conflict
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser._id.toString() !== userId) {
    throw new Error("Email already in use");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};



module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  updateAvatar,
  updateProfile
};