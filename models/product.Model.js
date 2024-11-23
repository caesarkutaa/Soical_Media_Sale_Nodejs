const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Facebook', 'Instagram', 'Twitter', 'VPN', 'Socks'], required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  duration: { type: String, enum: ['1 year', '2 years', '3 years', '4 years'], required: false }, // Only for accounts
  quantity: { type: Number }, // For bulk items like socks or Instagram accounts
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
