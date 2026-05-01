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
  listingController.create,
);

router.get(
  "/listings",
  authMiddleware,
  authorizeRoles("SELLER"),
  listingController.getMy,
);

router.post(
  "/listings/bulk",
  authMiddleware,
  authorizeRoles("SELLER"),
  listingController.createBulk,
);
router.patch(
  "/listings/:id",
  authMiddleware,
  authorizeRoles("SELLER"),
  listingController.update,
);

router.delete(
  "/listings/:id",
  authMiddleware,
  authorizeRoles("SELLER"),
  listingController.remove,
);
router.get("/search", listingController.search);

module.exports = router;
