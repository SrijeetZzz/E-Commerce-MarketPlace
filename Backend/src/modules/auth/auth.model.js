const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: ["BUYER", "SELLER", "ADMIN", "AGENT"],
    default: "BUYER",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  phone: {
    type: String,
  },

  avatar: {
    type: String,
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);