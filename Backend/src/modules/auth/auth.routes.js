const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");

// test route
router.get("/", (req, res) => {
  res.send("Auth module working");
});

// public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// protected route
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "User fetched successfully",
    user: req.user,
  });
});

// only admin
router.get(
  "/admin-test",
  authMiddleware,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// only seller
router.get(
  "/seller-test",
  authMiddleware,
  authorizeRoles("SELLER"),
  (req, res) => {
    res.json({ message: "Seller access granted" });
  }
);

module.exports = router;