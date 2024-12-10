const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  quantity: { type: Number }, // For bulk items like socks or Instagram accounts
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
