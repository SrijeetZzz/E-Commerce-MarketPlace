// src/modules/bank/bank.routes.js

const express = require("express");
const router = express.Router();

const bankController = require("./bank.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");

// seller only
router.post(
  "/bank-details",
  authMiddleware,
  authorizeRoles("SELLER"),
  bankController.submit
);

router.get(
  "/bank-details/me",
  authMiddleware,
  authorizeRoles("SELLER"),
  bankController.getMy
);

module.exports = router;