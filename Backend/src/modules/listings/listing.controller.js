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
const createBulk = async (req, res) => {
  try {
    const sellerId = req.user.id; // or hardcode for now
    const listings = req.body.listings;

    const result = await listingService.createBulkListings(sellerId, listings);

    res.json({
      message: "Bulk listings processed",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// get my listings
const getMy = async (req, res) => {
  try {
    const data = await listingService.getMyListings(req.user.id, req.query);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const listing = await listingService.updateListing(
      req.user.id,
      req.params.id,
      req.body,
    );

    res.json({
      success: true,
      message: "Listing updated successfully",
      data: listing,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const remove = async (req, res) => {
  try {
    await listingService.deleteListing(req.user.id, req.params.id);

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= ADMIN =================

// get all listings
const getAll = async (req, res) => {
  try {
    const result = await listingService.getAllListings(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
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
      req.body.reason,
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

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await listingService.getListingById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Get Listing Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch listing",
    });
  }
};

module.exports = {
  // seller
  create,
  getMy,
  createBulk,
  remove,
  update,

  // admin
  getAll,
  approve,
  reject,
  search,
  getListingById
};
