const companyModel = require('../models/companyModel');

// Service to fetch company data
const getCompanyData = async (okpo) => {
  try {
    const html = await companyModel.fetchCompanyData(okpo);
    const parsedData = companyModel.parseCompanyData(html); // Parse the fetched HTML
    return parsedData;
  } catch (error) {
    throw new Error(`Failed to fetch company data: ${error.message}`);
  }
};

module.exports = {
  getCompanyData,
};
