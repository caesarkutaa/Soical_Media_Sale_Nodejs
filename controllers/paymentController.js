const Payment = require("../models/paymentsModel");
const cloudinary = require('cloudinary').v2
const express = require('express');
const app = express();
const expressfileuploader = require('express-fileupload')



//use express file uploader
app.use(expressfileuploader({
  useTempFiles: true
}))
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Admin - Get all payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.find();
    if (!payment) {
      return res.status(404).json({ msg: "Payment details not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Admin - Add/Update bank payment details
exports.updatePaymentDetails = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder } = req.body;
    const existingPayment = await Payment.findOne();

    if (existingPayment) {
      // Update the existing payment details
      existingPayment.bankName = bankName;
      existingPayment.accountNumber = accountNumber;
      existingPayment.accountHolder = accountHolder;
      await existingPayment.save();
      return res.status(200).json({ msg: "Payment details updated", payment: existingPayment });
    }

    // Add new payment details if not existing
    const newPayment = new Payment({ bankName, accountNumber, accountHolder });
    await newPayment.save();

    res.status(201).json({ msg: "Payment details added", payment: newPayment });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Admin - Delete payment details
exports.deletePaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete();
    if (!payment) {
      return res.status(404).json({ msg: "Payment details not found" });
    }
    res.json({ msg: "Payment details deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// User - View payment details (Bank details)
exports.getBankDetails = async (req, res) => {
  try {
    const payment = await Payment.find();
    if (!payment) {
      return res.status(404).json({ msg: "Payment details not found" });
    }
    res.json(payment); // Send the payment details to the user for bank transfer
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
   
// User - Upload proof of payment  
// User - Upload proof of payment
exports.uploadProve = async (req, res) => {
  try {
    if (!req.files || !req.files.proofOfPayment) {
      // Check if req.files is null or if proofOfPayment is not present in req.files
      return res.status(400).json({ error: "proofOfPayment file is missing" });
    }

    const { proofOfPayment } = req.files;

    const result = await cloudinary.uploader.upload(proofOfPayment.tempFilePath, {
      folder: "Investment-plan"
    });

    console.log(result.secure_url);
    console.log(result.public_id);

    const payment = await Payment.create({
      user: req.params.id,
      amount: req.body.amount,
      proofOfPayment: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });

    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    console.log(err);
    res.status(500).json({ error: "An error occurred while processing the file." });
  }
};