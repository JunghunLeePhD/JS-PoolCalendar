const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Sends a PDF buffer to Gemini and extracts schedule data.
 * @param {Buffer} pdfBuffer
 * @returns {Promise<Object>} JSON Event Data
 */
async function analyzeSchedule(pdfBuffer) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('❌ GEMINI_API_KEY is missing.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const base64Data = pdfBuffer.toString('base64');

  const prompt = `
    Analyze this swimming pool schedule PDF and extract the monthly events.

    RULES:
    1. **"Closed" Days:** Mark as "allDay: true" ONLY if the text says "休館日" (Closed) or "年末年始".
    2. **Partial Restrictions:** If you see "X" or "×" in time slots, it is NOT a closed day. It is a partial event.
    3. **Output:** Return valid JSON only.

    JSON Structure:
    {
        "year": 2025,
        "month": 12,
        "events": [
            { "title": "...", "start": [Y,M,D,H,M], "end": [Y,M,D,H,M], "allDay": boolean, "desc": "..." }
        ]
    }
    `;

  console.log('🤖 Sending data to Gemini AI...');
  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Data,
        mimeType: 'application/pdf',
      },
    },
    prompt,
  ]);

  const text = result.response.text();
  const jsonStr = text.replace(/```json|```/g, '').trim();

  return JSON.parse(jsonStr);
}

module.exports = { analyzeSchedule };
