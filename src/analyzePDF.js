const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// UPDATED: Using the new model from your list
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

async function extractEvents() {
    try {
        console.log("Reading PDF...");
        const pdfPath = "schedule.pdf";
        if (!fs.existsSync(pdfPath)) {
            throw new Error("schedule.pdf not found! Did the download step work?");
        }
        
        const pdfData = fs.readFileSync(pdfPath);
        const pdfBase64 = pdfData.toString("base64");

        const prompt = `
        You are a data extraction assistant. I will provide a PDF calendar for a swimming pool.
        Your task is to extract the schedule for the ENTIRE month into JSON.

        ### CRITICAL INSTRUCTIONS FOR "CLOSED" VS "OPEN":
        1. **CLOSED (All Day):** Only mark a day as "allDay: true" if the cell text explicitly says "休館日" (Closed) or "年末年始" (Year-end).
        2. **PARTIALLY RESTRICTED (Open):** If a day has an "X" or "×" in a specific time column (e.g., 9-13), it means that *specific time* is unavailable. The pool is OPEN the rest of the day. Do NOT mark the whole day as closed.
        3. **EVENT NAMES:** If there is a swim meet (e.g., "競技大会" or "記録会"), capture it. These usually mean the pool is unavailable for the public.
        
        ### OUTPUT FORMAT (JSON ONLY):
        Return a single valid JSON object. No markdown.
        {
            "year": 2025,
            "month": 12,
            "events": [
                {
                    "title": "休館日",
                    "start": [2025, 12, 2],
                    "allDay": true,
                    "desc": "Pool Closed"
                },
                {
                    "title": "福岡県強化練習会 (Partial Closure)",
                    "start": [2025, 12, 6, 9, 0], 
                    "end": [2025, 12, 6, 13, 0],
                    "allDay": false,
                    "desc": "Main pool restricted 9:00-13:00 due to practice."
                }
            ]
        }
        `;

        console.log("Sending to Gemini (2.5 Flash Lite)...");
        const result = await model.generateContent([
            {
                inlineData: {
                    data: pdfBase64,
                    mimeType: "application/pdf",
                },
            },
            prompt,
        ]);

        const responseText = result.response.text();
        
        // Clean up markdown code blocks if present
        const jsonStr = responseText.replace(/```json|```/g, "").trim();
        
        // Parse JSON
        const data = JSON.parse(jsonStr);
        
        // Debugging: Check how many closed days we found
        const closedEvents = data.events.filter(e => e.allDay && (e.title.includes("休") || e.title.includes("Closed")));
        console.log(`Debug: Found ${data.events.length} total events, ${closedEvents.length} are full-day closures.`);

        fs.writeFileSync("events.json", JSON.stringify(data, null, 2));
        console.log("Extraction complete: events.json created.");

    } catch (error) {
        console.error("Error with Gemini API:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    extractEvents();
}

module.exports = extractEvents;