const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const sellerRoutes = require("../modules/sellers/seller.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const bankRoutes = require("../modules/bank/bank.routes");
const productRoutes = require("../modules/products/product.routes");
const listingRoutes = require("../modules/listings/listing.routes");
const cartRoutes = require("../modules/cart/cart.routes");
const orderRoutes = require("../modules/orders/order.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const addressRoutes = require("../modules/address/address.routes");


router.use("/auth", authRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes);
router.use("/seller", bankRoutes);
router.use("/admin/products", productRoutes);
router.use("/products", productRoutes);
router.use("/seller", listingRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);
router.use("/user/address", addressRoutes);


module.exports = router;