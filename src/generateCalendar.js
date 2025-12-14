const fs = require('fs');
async function generateICS() { 

const locationString = "Comprehensive West Civic Pool (総合西市民プール)";

try {
    const rawData = fs.readFileSync('events.json');
    const { events } = JSON.parse(rawData);

    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//West Civic Pool//Bot//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:West Pool Schedule",
        "X-WR-TIMEZONE:Asia/Tokyo"
    ].join("\r\n");

    function formatICSDate(dateArr, isAllDay = false) {
        if (!dateArr || dateArr.length < 3) return null; // Safety check
        const [y, m, d, h = 0, min = 0] = dateArr;
        const pad = (n) => n.toString().padStart(2, '0');
        const dateStr = `${y}${pad(m)}${pad(d)}`;
        
        if (isAllDay) {
            return `;VALUE=DATE:${dateStr}`;
        } else {
            return `:${dateStr}T${pad(h)}${pad(min)}00`;
        }
    }

    events.forEach((event, index) => {
        const now = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15) + 'Z';
        const startDate = formatICSDate(event.start, event.allDay);
        
        if (!startDate) return; // Skip invalid dates

        let endDate = "";
        if (event.allDay) {
            // Calculate next day for strictly correct ICS all-day events
            const nextDay = new Date(event.start[0], event.start[1]-1, event.start[2] + 1);
            const nextDayArr = [nextDay.getFullYear(), nextDay.getMonth()+1, nextDay.getDate()];
            endDate = formatICSDate(nextDayArr, true).replace(";VALUE=DATE:", ""); 
        } else {
            endDate = formatICSDate(event.end || event.start, false).replace(":", "");
        }

        const eventBlock = [
            "BEGIN:VEVENT",
            `UID:pool-bot-${index}-${event.start.join('')}@westpool`,
            `DTSTAMP:${now}`,
            `DTSTART${startDate}`,
            (event.allDay ? `DTEND;VALUE=DATE:${endDate}` : `DTEND:${endDate}`),
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.desc || ""}`,
            `LOCATION:${locationString}`,
            "END:VEVENT"
        ].join("\r\n");

        icsContent += "\r\n" + eventBlock;
    });

    icsContent += "\r\nEND:VCALENDAR";

    fs.writeFileSync('pool_schedule.ics', icsContent);
    console.log("Success! 'pool_schedule.ics' generated.");

} catch (e) {
    console.error("Error generating ICS:", e);
    process.exit(1);
}
}

if (require.main === module) {
    generateICS();
}

module.exports = generateICS;