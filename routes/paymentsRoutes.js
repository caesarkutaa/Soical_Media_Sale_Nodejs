const express = require("express");
const { getPaymentDetails, updatePaymentDetails, deletePaymentDetails, getBankDetails, uploadProve } = require("../controllers/paymentController");
//const protect  = require("../middlewares/authMiddleware"); // Protecting admin routes

const router = express.Router();

// Public Route: Users can view the payment details (bank details)
router.get("/", getBankDetails);

// Admin Routes (protected by middleware)
//router.use(protect);

// Admin can update or add payment details (bank information)
router.post("/", updatePaymentDetails); // Create or update payment details

// Admin can delete the payment details (bank info)
router.delete("/", deletePaymentDetails);

// Admin can view payment details (in case they want to manage the payment info)
router.get("/details", getPaymentDetails);

/// User can upload proof of payment (after making the bank transfer)
router.post("/upload-proof/:id", uploadProve);


module.exports = router;
