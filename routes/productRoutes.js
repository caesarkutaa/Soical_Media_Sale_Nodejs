// @ts-nocheck
const express = require('express');
const { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productControllers');

const  isAdmin  = require('../middlewares/adminMiddleware'); // Protect routes
const router = express.Router();

// Get all products (public route)
router.get('/', getProducts);

// Add a new product (admin-only route)
router.post('/', addProduct); // Add admin middleware if necessary
     
// Update a product by ID (admin-only route)
router.put('/:id',  updateProduct);

// Delete a product by ID (admin-only route)
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;
