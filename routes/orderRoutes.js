const express = require('express');
const orderController = require('../controllers/orderController');
const authenticateUser = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Import the upload middleware
const isAdmin = require('../middlewares/adminMiddleware'); // Optional for admin access

const router = express.Router();

// Order Routes
router.post("/", authenticateUser, orderController.placeOrder);
router.post('/upload-proof', upload.single('proofOfPayment'), orderController.uploadProof); // Using upload middleware
router.get("/", authenticateUser, orderController.getOrders);
router.put("/:orderId/status",  orderController.updateOrderStatus);
router.get("/orders", orderController.allOrdersByAdmin);

module.exports = router;
