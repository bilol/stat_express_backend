const axios = require('axios');
const cheerio = require('cheerio');

// Function to make POST request and retrieve HTML content
const fetchCompanyData = async (okpo) => {
  const url = 'https://registr.stat.uz/ru/result/';
  
  const headers = {
    'User-Agent': process.env.USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'https://registr.stat.uz',
    'Connection': 'keep-alive',
    'Referer': 'https://registr.stat.uz/ru/main.php',
    'Cookie': process.env.COOKIE,
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Priority': 'u=0, i'
  };

  const data = new URLSearchParams({ OKPO: okpo, lang: '0', submit: '' });
  const response = await axios.post(url, data.toString(), { headers });

  return response.data;
};

// Function to parse HTML content and extract company data
const parseCompanyData = (html) => {
  const generalInfo = {};
  const shareholderInfo = [];
  const contactInfo = {};
  const managementInfo = {};
  let isShareholderSection = false;

  const $ = cheerio.load(html);
  const rows = $('#demo2 tr');

  rows.each((i, row) => {
    const cells = $(row).find('td');

    // Detect the start of the shareholder section
    if (cells.length === 1 && $(cells[0]).text().trim().includes('Информация об учредителях и их доле в уставном фонде')) {
      isShareholderSection = true;
      return;
    }

    // Stop collecting shareholders when encountering another section
    if (isShareholderSection && cells.length === 1 && $(cells[0]).text().trim().includes('Контактные данные')) {
      isShareholderSection = false;
    }

    // Collect general information before the shareholder section
    if (!isShareholderSection && cells.length >= 2) {
      const key = $(cells[0]).text().trim().replace(':', '');
      const value = $(cells[1]).text().trim();

      switch (key) {
        case 'ИНН':
          generalInfo['INN'] = value;
          break;
        case 'Регистрирующий орган':
          generalInfo['Registering Authority'] = value;
          break;
        case 'Дата регистрации  ':
          generalInfo['Registration Date'] = value;
          break;
        case 'Номер регистрации':
          generalInfo['Registration Number'] = value;
          break;
        case 'Наименование юридического лица':
          generalInfo['Company Name'] = value;
          break;
        case 'Код ОПФ':
          generalInfo['Legal Form Code'] = value;
          break;
        case 'Код ОКЭД':
          generalInfo['Activity Code'] = value;
          break;
        case 'Код СООГУ':
          generalInfo['DBIBT Code'] = value;
          break;
        case 'Принадлежность к cубъектам малого предпринимательства':
          generalInfo['Small Business Status'] = value;
          break;
        case 'Состояние активности':
          generalInfo['Active Status'] = value;
          break;
        case 'Уставный фонд':
          generalInfo['Charter Fund'] = value;
          break;
        case 'Адрес электронной почты':
          contactInfo['Email'] = value;
          break;
        case 'Контактные телефоны':
          contactInfo['Phone Numbers'] = value;
          break;
        case 'Код СОАТО':
          contactInfo['SOATO Code'] = value;
          break;
        case 'Улица, тупик, дом':
          contactInfo['Address'] = value;
          break;
        case 'Имя руководителя':
          managementInfo['Leader'] = value;
          break;
      }
    }

    // If we are in the shareholder section, collect shareholder data
    if (isShareholderSection && cells.length === 2) {
      const shareholderName = $(cells[0]).text().trim().replace('&nbsp;', '');
      const sharePercentage = $(cells[1]).text().trim();

      shareholderInfo.push({
        Shareholder: shareholderName,
        Share: sharePercentage,
      });
    }
  });

  return { generalInfo, shareholderInfo, contactInfo, managementInfo };
};

module.exports = {
  fetchCompanyData,
  parseCompanyData,
};