// src/modules/inventory/inventory.service.js

const Listing = require("../listings/listing.model");

// 🔥 RESERVE STOCK
const reserveStock = async (listingId, quantity) => {
  const listing = await Listing.findOneAndUpdate(
    {
      _id: listingId,
      $expr: {
        $gte: [{ $subtract: ["$stock", "$reservedStock"] }, quantity],
      },
    },
    {
      $inc: { reservedStock: quantity },
    },
    { new: true },
  );

  if (!listing) {
    throw new Error("Not enough stock available");
  }

  return listing;
};

// 🔥 RELEASE STOCK (on failure)
const releaseStock = async (listingId, quantity) => {
  return await Listing.findByIdAndUpdate(
    listingId,
    {
      $inc: { reservedStock: -quantity },
    },
    { new: true },
  );
};

// 🔥 CONFIRM STOCK (on payment success)
const confirmStock = async (listingId, quantity) => {
  return await Listing.findByIdAndUpdate(
    listingId,
    {
      $inc: {
        stock: -quantity,
        reservedStock: -quantity,
      },
    },
    { new: true },
  );
};

module.exports = {
  reserveStock,
  releaseStock,
  confirmStock,
};
