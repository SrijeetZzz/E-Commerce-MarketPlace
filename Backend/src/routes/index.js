const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const sellerRoutes = require("../modules/sellers/seller.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const bankRoutes = require("../modules/bank/bank.routes");


router.use("/auth", authRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes);
router.use("/seller", bankRoutes);


module.exports = router;