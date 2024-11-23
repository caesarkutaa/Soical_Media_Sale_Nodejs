const Product = require('../models/product.Model');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, duration, quantity } = req.body;

    const newProduct = new Product({ name, category, price, stock, description, duration, quantity });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const updates = req.body; // Updates from the request body

    const product = await Product.findByIdAndUpdate(id, updates, { new: true }); // Return the updated product
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

