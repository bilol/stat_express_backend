const companyService = require('../services/companyService');

// Controller for handling the request
const fetchCompanyData = async (req, res, next) => {
  const { okpo } = req.body;
  const userAgent = req.get('User-Agent');  // Get the User-Agent from the request headers
  
  if (!okpo) {
    return res.status(400).json({ success: false, message: 'OKPO is required' });
  }

  try {
    // Call the service to fetch the company data with userAgent
    const companyData = await companyService.getCompanyData(okpo, userAgent);

    const responseData = {
      INN: companyData.generalInfo.INN,
      'Registering Authority': companyData.generalInfo['Registering Authority'],
      'Registration Date': companyData.generalInfo['Registration Date'],
      'Registration Number': companyData.generalInfo['Registration Number'],
      'Company Name': companyData.generalInfo['Company Name'],
      'Legal Form Code': companyData.generalInfo['Legal Form Code'],
      'Activity Code': companyData.generalInfo['Activity Code'],
      'DBIBT Code': companyData.generalInfo['DBIBT Code'],
      'Small Business Status': companyData.generalInfo['Small Business Status'],
      'Active Status': companyData.generalInfo['Active Status'],
      'Charter Fund': companyData.generalInfo['Charter Fund'],
      'Email': companyData.contactInfo.Email || 'Not available',
      'Phone Numbers': companyData.contactInfo['Phone Numbers'],
      'SOATO Code': companyData.contactInfo['SOATO Code'],
      'Address': companyData.contactInfo.Address,
      'Leader': companyData.managementInfo.Leader,
      'Founders': companyData.founders.map(f => `${f.Founder} (${f.Share})`).join(', '),
    };

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error); // Pass error to custom error handler
  }
};

module.exports = {
  fetchCompanyData,
};
