const { Router } = require("express");
const router = Router();
const {login, register, getUserProfile } = require("../controllers/authController")
const  protect  = require('../middlewares/authMiddleware');
const passport = require('passport');

router.post("/register", register);
router.post("/login", login);
// Get logged-in user's profile
router.get('/profile', protect, getUserProfile);

// Redirect to Google for authentication
router.get('/google',  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback URL
router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false, // Optional: Disable sessions if you're using JWT
    }),
    (req, res) => {
      // Successful authentication
      const user = req.user;
      res.json({
        msg: "Google OAuth successful",
        user,
      });
    }
  );




module.exports = router;