const downloadPDF = require('./downloadPDF');
const extractEvents = require('./analyzePDF');
const generateICS = require('./generateCalendar');

async function main() {
    try {
        console.log("=== STEP 1: DOWNLOADING PDF ===");
        await downloadPDF();

        console.log("\n=== STEP 2: ANALYZING WITH GEMINI ===");
        await extractEvents();

        console.log("\n=== STEP 3: GENERATING CALENDAR ===");
        await generateICS();

        console.log("\nAll steps completed successfully!");
    } catch (error) {
        console.error("\n❌ Workflow failed:", error.message);
        process.exit(1);
    }
}

main();