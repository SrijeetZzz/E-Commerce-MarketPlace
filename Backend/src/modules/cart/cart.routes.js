// src/modules/cart/cart.routes.js

const express = require("express");
const router = express.Router();

const cartController = require("./cart.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", cartController.get);
router.post("/add", cartController.add);
router.patch("/update", cartController.update);
router.delete("/remove/:listingId", cartController.remove);

module.exports = router;