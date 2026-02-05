import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getCalendarClient } from "../google/client";

dayjs.extend(utc);
dayjs.extend(timezone);

const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 60;

// Generate available time slots for a day
function buildDateSlots(date: dayjs.Dayjs): dayjs.Dayjs[] {
  const slots: dayjs.Dayjs[] = [];
  for (let hour = WORK_START; hour < WORK_END; hour++) {
    const slot = date.hour(hour).minute(0).second(0).millisecond(0);
    slots.push(slot);
  }
  return slots;
}

export async function getAvailability(date: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID environment variable is not set");
  }

  const calendar = getCalendarClient();

  // Parse date in Berlin timezone
  const dayDate = dayjs.tz(`${date}T00:00:00`, "Europe/Berlin");
  const timeMin = dayDate.startOf("day").toISOString();
  const timeMax = dayDate.endOf("day").toISOString();

  console.log(`[getAvailability] Getting events for ${date}, calendar: ${calendarId}`);

  try {
    // Use events.list instead of freebusy.query (more reliable)
    const response = await calendar.events.list({
      calendarId,
      eventTypes: ["default"],
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response?.data?.items || [];
    console.log(`[getAvailability] Found ${events.length} events`);

    // Build all possible slots for the day
    const dateSlots = buildDateSlots(dayDate);

    // Filter out slots that conflict with existing events
    const availableSlots = dateSlots.filter((slot) => {
      const slotEnd = slot.add(SLOT_MINUTES, "minute");

      // Check if this slot conflicts with any existing event
      const hasConflict = events.some((event) => {
        const eventStart = dayjs(event.start?.dateTime || event.start?.date);
        const eventEnd = dayjs(event.end?.dateTime || event.end?.date);

        // Slot overlaps if: slot < eventEnd AND slotEnd > eventStart
        return slot.isBefore(eventEnd) && slotEnd.isAfter(eventStart);
      });

      return !hasConflict;
    });

    // Convert to time strings (HH:mm format)
    const slots = availableSlots.map((slot) => slot.format("HH:mm"));

    console.log(`[getAvailability] Available slots: ${slots.join(", ")}`);
    return slots;
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    console.error("Error fetching calendar events:", error);

    if (err.code === 404 || err.message?.includes("Not Found")) {
      throw new Error(
        `Calendar not found. Please check:\n` +
          `1. GOOGLE_CALENDAR_ID is set correctly in your .env file\n` +
          `2. The calendar ID is valid\n` +
          `3. The service account (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}) has been shared with the calendar\n` +
          `4. The calendar exists and is accessible`
      );
    }

    throw error;
  }
}
