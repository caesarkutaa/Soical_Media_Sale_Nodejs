const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

module.exports = {
  async placeOrder(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ msg: "User not authenticated" });
      }

      const userId = req.user.id;
  
      // Fetch the user's cart with populated product details
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ msg: "Your cart is empty" });
      }
  
      // Transform cart items to match the OrderSchema
      const products = cart.items.map(item => ({
        product: item.productId._id, // Extract product ID
        quantity: item.quantity,
      }));
  
      // Create the order
      const order = new Order({
        user: userId, // Match your schema
        products, // Use transformed products array
        totalAmount: cart.totalAmount,
      });
    
      await order.save();

      // Clear the user's cart
      await Cart.deleteOne({ userId });

      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ msg: "Server error" });
    }
  },

  async uploadProof(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const filePath = req.file.path; // This should now have a value
      console.log('Uploaded File Path:', filePath);
  
      res.status(200).json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
      console.error('Error uploading proof:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  async getOrders(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ msg: "User not authenticated" });
      }

      const userId = req.user.id;
  
      // Fetch orders for the user
      const orders = await Order.find({ user: userId }).populate("products.product");
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ msg: "No orders found for this user" });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ msg: "Server error" });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ msg: "Order not found" });

      order.status = status;
      await order.save();

      res.json({ msg: "Order status updated successfully", order });
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: error.message });
    }
  },

  async allOrdersByAdmin(req, res) {
    try {
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: "users", // Collection name for users
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails", // Flatten the userDetails array
        },
        {
          $unwind: "$products", // Flatten the products array
        },
        {
          $lookup: {
            from: "products", // Collection name for products
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails", // Flatten the productDetails array
        },
        {
          $group: {
            _id: "$_id", // Group by order ID
            userDetails: { $first: "$userDetails" },
            totalAmount: { $first: "$totalAmount" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            products: {
              $push: {
                name: "$productDetails.name",
                description: "$productDetails.description", // Get product name
                quantity: "$products.quantity", // Get product quantity
              },
            },
          },
        },
        {
          $project: {
            _id: 1, // Include order ID
            "userDetails.name": 1, // Include user name
            "userDetails.email": 1, // Include user email
            totalAmount: 1, // Include total amount
            status: 1, // Include order status
            createdAt: 1, // Include order creation date
            products: 1, // Include products array with name and quantity
          },
        },
      ]);
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found." });
      }
  
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
  
  
};
