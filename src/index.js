const { fetchSchedulePDF } = require('./fetcher');
const { analyzeSchedule } = require('./analyzer');
const { createICSFile } = require('./generator');

async function main() {
    try {
        console.log("=== STEP 1: FETCHING BUFFER ===");
        const pdfBuffer = await fetchSchedulePDF();

        console.log("\n=== STEP 2: ANALYZING WITH GEMINI ===");
        const eventData = await analyzeSchedule(pdfBuffer);
        
        console.log("\n=== STEP 3: GENERATING CALENDAR ===");
        createICSFile(eventData);

        console.log("\n🎉 Workflow completed successfully!");
    } catch (error) {
        console.error("\n❌ Workflow failed:", error.message);
        process.exit(1);
    }
}

main();