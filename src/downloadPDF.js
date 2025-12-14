const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.sports-fukuokacity.or.jp/facility/pool_nishi.html';
const BASE_DOMAIN = 'https://www.sports-fukuokacity.or.jp';

async function downloadPDF() {
    try {
        console.log(`Checking ${TARGET_URL}...`);
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);

        // Find a link that ends in .pdf and likely contains "行事" (Event) or "予定" (Schedule)
        // Adjust logic: Find the first PDF inside the main content area usually works best
        let pdfLink = '';
        
        $('a[href$=".pdf"]').each((i, el) => {
            const text = $(el).text();
            // Look for keywords like "Month" (月) or "Schedule" (行事)
            if (text.includes('月') || text.includes('行事')) {
                pdfLink = $(el).attr('href');
                return false; // Break loop
            }
        });

        if (!pdfLink) {
            throw new Error('No schedule PDF found on the page.');
        }

        // Handle relative URLs
        if (!pdfLink.startsWith('http')) {
            // Check if relative to root or current path. Usually relative to root in this site structure.
            if (pdfLink.startsWith('/')) {
                pdfLink = BASE_DOMAIN + pdfLink;
            } else {
                // Sometimes it's relative to the facility folder
                 pdfLink = 'https://www.sports-fukuokacity.or.jp/facility/' + pdfLink;
            }
        }

        console.log(`Found PDF: ${pdfLink}`);

        const response = await axios({
            method: 'get',
            url: pdfLink,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream('schedule.pdf');
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

    } catch (error) {
        console.error('Error downloading PDF:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    downloadPDF(); // Run automatically if called directly (node src/1_download.js)
}

module.exports = downloadPDF; // Allow index.js to use it
