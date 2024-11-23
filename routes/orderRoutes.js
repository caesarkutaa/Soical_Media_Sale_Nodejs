const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const protect  = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware'); // Optional for admin access

const router = express.Router();

// Create a new order (user only)
router.post('/', protect, createOrder);

// Get all orders (admin only)
router.get('/', protect, isAdmin, getAllOrders);

// Get a specific order by ID (user/admin)
router.get('/:id', protect, getOrderById);

// Update an order (admin only or optionally user for canceling)
router.put('/:id', protect, isAdmin, updateOrder);

// Delete an order (admin only)
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;
