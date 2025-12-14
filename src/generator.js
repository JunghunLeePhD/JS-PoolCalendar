const fs = require('fs');

const LOCATION_STRING = 'Comprehensive West Civic Pool (総合西市民プール)';
const OUTPUT_FILE = 'westpool_schedule.ics';

/**
 * Converts the event data object into an ICS file.
 * @param {Object} data - The JSON object returned by the analyzer.
 */
function createICSFile(data) {
  console.log('📅 Starting ICS generation...');

  // 1. Header
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//West Civic Pool//Bot//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:West Pool Schedule',
    'X-WR-TIMEZONE:Asia/Tokyo',
  ].join('\r\n');

  // 2. Helper to format dates
  function formatICSDate(dateArr, isAllDay = false) {
    if (!dateArr || dateArr.length < 3) return null;
    const [y, m, d, h = 0, min = 0] = dateArr;
    const pad = (n) => n.toString().padStart(2, '0');
    const dateStr = `${y}${pad(m)}${pad(d)}`;

    if (isAllDay) {
      return `;VALUE=DATE:${dateStr}`;
    } else {
      return `:${dateStr}T${pad(h)}${pad(min)}00`;
    }
  }

  // 3. Loop through events (from memory)
  data.events.forEach((event, index) => {
    const now =
      new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15) + 'Z';
    const startDate = formatICSDate(event.start, event.allDay);

    if (!startDate) return;

    let endDate = '';
    if (event.allDay) {
      // Strictly correct next-day calculation for All-Day events
      const nextDay = new Date(
        event.start[0],
        event.start[1] - 1,
        event.start[2] + 1
      );
      const nextDayArr = [
        nextDay.getFullYear(),
        nextDay.getMonth() + 1,
        nextDay.getDate(),
      ];
      endDate = formatICSDate(nextDayArr, true).replace(';VALUE=DATE:', '');
    } else {
      endDate = formatICSDate(event.end || event.start, false).replace(':', '');
    }

    const eventBlock = [
      'BEGIN:VEVENT',
      `UID:pool-bot-${index}-${event.start.join('')}@westpool`,
      `DTSTAMP:${now}`,
      `DTSTART${startDate}`,
      event.allDay ? `DTEND;VALUE=DATE:${endDate}` : `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.desc || ''}`,
      `LOCATION:${LOCATION_STRING}`,
      'END:VEVENT',
    ].join('\r\n');

    icsContent += '\r\n' + eventBlock;
  });

  // 4. Footer & Write to Disk
  icsContent += '\r\nEND:VCALENDAR';

  fs.writeFileSync(OUTPUT_FILE, icsContent);
  console.log(`✅ ICS file saved to: ${OUTPUT_FILE}`);
}

module.exports = { createICSFile };
