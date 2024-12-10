// @ts-nocheck
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for the uploaded file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  }
});

// Create multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
