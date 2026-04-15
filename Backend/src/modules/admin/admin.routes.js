const express = require("express");
const router = express.Router();

const adminController = require("./admin.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");
const bankController = require("../bank/bank.controller");

// all routes protected + admin only
router.use(authMiddleware, authorizeRoles("ADMIN"));

router.get("/seller/applications", adminController.getApplications);

router.patch("/seller/application/:id/approve", adminController.approve);

router.patch("/seller/application/:id/reject", adminController.reject);

// bank verification
router.patch("/bank-details/:id/verify", bankController.verifyBank);
router.patch("/bank-details/:id/reject", bankController.rejectBank);


module.exports = router;