// @ts-nocheck
const Cart = require("../models/cartModel");
const Product = require("../models/product.Model");

module.exports = {
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id; // Assume user ID is available from middleware

      // Fetch the product price
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ msg: "Product not found" });

      // Find or create the user's cart
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], totalAmount: 0 });
      }

      // Check if the product already exists in the cart
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + item.quantity * product.price;
      }, 0);

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart) return res.status(404).json({ msg: "Cart is empty" });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  async removeFromCart(req, res) {
    const { cartId, productId } = req.params;
  
    // Validate input
    if (!cartId || !productId) {
      return res.status(400).json({ message: "Cart ID and Product ID are required" });
    }
  
    try {
      // Find the cart
      const cart = await Cart.findById(cartId);
  
      if (!cart) {
        console.log("Cart not found for ID:", cartId);
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Find the product in the cart
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
  
      if (productIndex === -1) {
        console.log("Product not found in cart:", productId);
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Remove the product
      cart.items.splice(productIndex, 1);
  
      // Update the total amount
      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.quantity * item.productId.price,
        0
      );
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
