const mongoose = require("mongoose");

const sellerApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },

  businessName: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
  },

  documents: {
    type: [String],
    default: [],
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },

  rejectionReason: String,

  reviewedAt: Date,

}, { timestamps: true });

module.exports = mongoose.model("SellerApplication", sellerApplicationSchema);