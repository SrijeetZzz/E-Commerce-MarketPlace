const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");
const upload = require("../../shared/utils/multer");

// test route
router.get("/", (req, res) => {
  res.send("Auth module working");
});

// public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// protected route
router.get("/me", authMiddleware, authController.me);

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

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  authController.uploadAvatar
);

router.patch(
  "/profile",
  authMiddleware,
  authController.updateProfile
);


module.exports = router;