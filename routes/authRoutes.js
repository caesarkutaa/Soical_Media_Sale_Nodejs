const { Router } = require("express");
const router = Router();
const {login, register, getUserProfile } = require("../controllers/authController")
const  protect  = require('../middlewares/authMiddleware');

  
router.post("/register", register);
router.post("/login", login);
// Get logged-in user's profile
router.get('/profile', protect, getUserProfile);
  





module.exports = router;