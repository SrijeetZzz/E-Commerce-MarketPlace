const router = require("express").Router();
const ctrl = require("./address.controller");
const auth = require("../../shared/middlewares/auth.middleware");

// 🔥 routes
router.get("/", auth, ctrl.getAddresses);
router.post("/", auth, ctrl.addAddress);
router.patch("/:id", auth, ctrl.updateAddress);
router.patch("/:id/default", auth, ctrl.setDefault);
router.delete("/:id", auth, ctrl.deleteAddress);

module.exports = router;