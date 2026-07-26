const express = require("express");
const router = express.Router();

const adminController = require("./admin.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");
const bankController = require("../bank/bank.controller");
const listingController = require("../listings/listing.controller");
const userController = require("./admin.users.controller");
const dashboardController = require("./admin.dashboard.controller");

// all routes protected + admin only
router.use(authMiddleware, authorizeRoles("ADMIN"));
router.get("/seller/applications", adminController.getApplications);
router.patch("/seller/application/:id/approve", adminController.approve);
router.patch("/seller/application/:id/reject", adminController.reject);
router.get("/sellers", adminController.getAllSellers);

// bank verification
router.patch("/bank-details/:id/verify", bankController.verifyBank);
router.patch("/bank-details/:id/reject", bankController.rejectBank);
router.get("/bank-details", bankController.getAllBankDetails);

// listings
router.get("/listings", listingController.getAll);
router.get("/listings/:id", listingController.getListingById);
router.patch("/listings/:id/approve", listingController.approve);
router.patch("/listings/:id/reject", listingController.reject);

//users
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.patch("/users/:id/status", userController.updateUserStatus);

//dashboard
router.get("/dashboard/stats", dashboardController.getDashboardStats);
router.get("/dashboard/analytics", dashboardController.getDashboardAnalytics);
router.get("/dashboard/tables", dashboardController.getDashboardTables);

module.exports = router;
