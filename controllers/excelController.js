const xlsx = require('xlsx');
const path = require('path');
const { fetchCompanyData, parseCompanyData } = require('../models/companyModel');

// Function to handle the Excel upload, iterate over OKPO values, and fetch company data
const uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path); // Read the uploaded Excel file
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName]; // Get the sheet data

    const data = xlsx.utils.sheet_to_json(sheet); // Convert the sheet data to JSON
    const okpoList = data.map((row) => row.OKPO); // Assuming the OKPO column is named 'OKPO'

    // Get User-Agent from request headers
    const userAgent = req.get('User-Agent') || process.env.DEFAULT_USER_AGENT;  // Fallback to default if not provided

    // Use Promise.all() to fetch data for all OKPOs in parallel, with the User-Agent
    const companyDataList = await Promise.all(
      okpoList.map(async (okpo) => {
        try {
          const html = await fetchCompanyData(okpo, userAgent); // Pass User-Agent to the fetch function
          const companyData = parseCompanyData(html); // Parse the company data from HTML

          return { okpo, companyData }; // Return the OKPO and the fetched company data
        } catch (error) {
          console.error(`Error fetching data for OKPO ${okpo}:`, error.message);
          return { okpo, error: `Failed to fetch data for OKPO ${okpo}` }; // Return error if any
        }
      })
    );

    // Return the full list of company data
    res.json({ success: true, data: companyDataList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process the Excel file', error: error.message });
  }
};

module.exports = {
  uploadExcel,
};
