const Order = require('../models/orderModel');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { products, totalPrice, paymentMethod, status } = req.body;

    const newOrder = new Order({
      user: req.user.id, // From authenticated user
      products,
      totalPrice,
      paymentMethod,
      status,
    });

    await newOrder.save();
    res.status(201).json({ msg: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('user', 'name email').populate('products.product', 'name price');
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update an order (e.g., change status)
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const order = await Order.findByIdAndUpdate(id, updates, { new: true }).populate('user', 'name email').populate('products.product', 'name price');
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    res.json({ msg: 'Order updated successfully', order });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete an order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    res.json({ msg: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
