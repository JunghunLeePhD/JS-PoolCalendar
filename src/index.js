const { fetchSchedulePDF } = require('./fetcher');

async function main() {
    try {
        console.log("=== STEP 1: FETCHING BUFFER ===");
        const pdfBuffer = await fetchSchedulePDF();

        console.log("\n🎉 Workflow completed successfully!");
    } catch (error) {
        console.error("\n❌ Workflow failed:", error.message);
        process.exit(1);
    }
}

main();