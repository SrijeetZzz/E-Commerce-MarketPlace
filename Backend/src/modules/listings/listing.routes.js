// src/modules/listings/listing.routes.js

const express = require("express");
const router = express.Router();

const listingController = require("./listing.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");

// seller
router.post(
  "/listings",
  authMiddleware,
  authorizeRoles("SELLER"),
  listingController.create
);

router.get(
  "/listings",
  authMiddleware,
  authorizeRoles("SELLER"),
  listingController.getMy
);

module.exports = router;