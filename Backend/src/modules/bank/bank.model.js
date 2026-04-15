const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  accountNumber: {
    type: String,
    required: true,
  },

  ifscCode: {
    type: String,
    required: true,
  },

  accountHolderName: {
    type: String,
    required: true,
  },

  documentUrl: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING",
  },

  rejectionReason: String,
  verifiedAt: Date,

}, { timestamps: true });

module.exports = mongoose.model("BankDetails", bankDetailsSchema);