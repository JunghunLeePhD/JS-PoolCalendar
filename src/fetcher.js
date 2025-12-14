const axios = require('axios');
const cheerio = require('cheerio');

const BASE_DOMAIN = 'https://www.sports-fukuokacity.or.jp';
const TARGET_URL = `${BASE_DOMAIN}/facility/pool_nishi.html`;

/**
 * Scrapes the website and returns the PDF as a binary Buffer.
 * @returns {Promise<Buffer>}
 */
async function fetchSchedulePDF() {
  console.log(`🔍 Visiting ${TARGET_URL}...`);
  const { data: html } = await axios.get(TARGET_URL);
  const $ = cheerio.load(html);

  // 1. Find the Link
  let pdfLink = '';
  $('a[href$=".pdf"]').each((_, el) => {
    const text = $(el).text();
    if (text.includes('月') || text.includes('行事')) {
      pdfLink = $(el).attr('href');
      return false;
    }
  });

  if (!pdfLink) throw new Error('❌ No schedule PDF found on the website.');

  // 2. Normalize URL
  if (!pdfLink.startsWith('http')) {
    pdfLink = pdfLink.startsWith('/')
      ? BASE_DOMAIN + pdfLink
      : `https://www.sports-fukuokacity.or.jp/facility/${pdfLink}`;
  }
  console.log(`🔗 Found PDF URL: ${pdfLink}`);

  // 3. Download to Memory
  console.log('⬇️ Downloading PDF to memory...');
  const response = await axios.get(pdfLink, { responseType: 'arraybuffer' });

  return Buffer.from(response.data);
}

module.exports = { fetchSchedulePDF };
