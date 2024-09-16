const express = require('express');
const multer = require('multer');
const { uploadExcel } = require('../controllers/excelController');

const router = express.Router();

// Use memory storage to avoid storing files on disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route to handle file uploads
router.post('/upload', upload.single('file'), uploadExcel);

module.exports = router;
