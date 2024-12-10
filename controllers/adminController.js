// @ts-nocheck
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

//email handler
const nodemailer = require("nodemailer");

//env stuff
require("dotenv").config();
//nodemalier stuff
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});



// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const newAdmin = new Admin({ name, email, password, role });
    await newAdmin.save();

    res.status(201).json({ msg: "Admin registered successfully", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await admin.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "Admin login successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


exports.allUsersByAdmin = async (req, res) => {
  try {
    // Verify admin
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Fetch all users
    const users = await User.find().select("-password"); // Exclude passwords for security

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users by admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }

};

exports.sendEmail = async (req,res)=>{
  const { email, message } = req.body; // Get user's email and message

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Support mail',
      text: message
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email');
  }

}
