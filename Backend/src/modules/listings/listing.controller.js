// src/modules/listings/listing.controller.js

const listingService = require("./listing.service");

// ================= SELLER =================

// create listing
const create = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const result = await listingService.createListing(sellerId, req.body);

    res.status(201).json({
      message: "Listing created",
      data: result,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get my listings
const getMy = async (req, res) => {
  try {
    const data = await listingService.getMyListings(req.user.id);

    res.json({ data });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= ADMIN =================

// get all listings
const getAll = async (req, res) => {
  try {
    const data = await listingService.getAllListings();

    res.json({ data });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// approve listing
const approve = async (req, res) => {
  try {
    const data = await listingService.approveListing(req.params.id);

    res.json({
      message: "Listing approved",
      data,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// reject listing
const reject = async (req, res) => {
  try {
    const data = await listingService.rejectListing(
      req.params.id,
      req.body.reason
    );

    res.json({
      message: "Listing rejected",
      data,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const search = async (req, res) => {
  try {
    const data = await listingService.searchListings(req.query);

    res.json({ data });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  // seller
  create,
  getMy,

  // admin
  getAll,
  approve,
  reject,
  search,
};