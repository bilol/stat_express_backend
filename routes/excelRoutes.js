const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadExcel } = require('../controllers/excelController');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store the uploaded file in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});

const upload = multer({ storage: storage });

// Define the route to handle file uploads
router.post('/upload', upload.single('file'), uploadExcel);

module.exports = router;
