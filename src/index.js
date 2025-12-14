const downloadPDF = require('./downloadPDF');

async function main() {
    try {
        console.log("=== STEP 1: DOWNLOADING PDF ===");
        await downloadPDF();

        console.log("\nAll steps completed successfully!");
    } catch (error) {
        console.error("\n❌ Workflow failed:", error.message);
        process.exit(1);
    }
}

main();