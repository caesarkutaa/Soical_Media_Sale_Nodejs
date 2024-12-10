const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser  = require('../middlewares/authMiddleware');




// Cart Routes
router.post("/", authenticateUser, cartController.addToCart);
router.get("/", authenticateUser, cartController.getCart);
router.delete("/:cartId/product/:productId", authenticateUser, cartController.removeFromCart);

     
module.exports = router;