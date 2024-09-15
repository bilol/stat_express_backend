const express = require('express');
const companyController = require('../controllers/companyController');

const router = express.Router();

// POST route to fetch company data based on OKPO
router.post('/', companyController.fetchCompanyData);

module.exports = router;
