const express = require("express");
const { registerAdmin, loginAdmin, getAdminProfile,allUsersByAdmin,sendEmail } = require("../controllers/adminController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
// Route to get all users by admin
router.get("/users",  allUsersByAdmin);
// Protected Routes
router.get("/profile", protect, getAdminProfile);
router.post("/sendmail", sendEmail)


module.exports = router;

