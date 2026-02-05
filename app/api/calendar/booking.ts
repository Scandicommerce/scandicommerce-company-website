import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getCalendarClient } from "../google/client";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function createBooking({
  name,
  email,
  date,
  time,
  duration,
}: {
  name: string;
  email: string;
  date: string;
  time: string;
  duration: number;
}) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID environment variable is not set");
  }

  const calendar = getCalendarClient();

  // Parse date and time in Europe/Berlin timezone
  const start = dayjs.tz(`${date}T${time}:00`, "Europe/Berlin");
  const end = start.add(duration, "minute");

  // Validate dates
  if (!start.isValid() || !end.isValid()) {
    throw new Error(`Invalid date or time format: ${date} ${time}`);
  }

  const calendarEvent = {
    summary: `Meeting with ${name}`,
    description: `Booked via website\nContact: ${name} (${email})`,
    start: {
      dateTime: start.toISOString(),
      timeZone: "Europe/Berlin",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "Europe/Berlin",
    },
    attendees: [{ email }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 30 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  try {
    // Create the event with email invite (sendUpdates: "all" is REQUIRED for invites)
    // Note: This requires Domain-Wide Delegation for service accounts
    const res = await calendar.events.insert({
      calendarId,
      requestBody: calendarEvent,
      sendUpdates: "all", // 🔥 REQUIRED - Sends email invite to attendees
    });

    if (res.status === 200 && res.data) {
      // Return event data including the event ID for potential deletion if declined
      return {
        ...res.data,
        eventId: res.data.id,
        htmlLink: res.data.htmlLink,
      };
    } else {
      throw new Error("Failed to insert event");
    }
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    console.error("Error creating meeting:", error);

    if (err.code === 404 || err.message?.includes("Not Found")) {
      throw new Error(
        `Calendar not found. Please check:\n` +
          `1. GOOGLE_CALENDAR_ID is set correctly in your .env file\n` +
          `2. The service account (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}) has been shared with the calendar\n` +
          `3. The calendar exists and is accessible`
      );
    }

    // Check for domain-wide delegation error
    if (
      err.message?.includes("Domain-Wide Delegation") ||
      err.message?.includes("writer access") ||
      err.message?.includes("cannot invite attendees")
    ) {
      throw new Error(
        `Domain-Wide Delegation required: To send email invites, you need to set up Domain-Wide Delegation.\n` +
          `See: https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority\n` +
          `Or use OAuth2 instead of service account for this feature.`
      );
    }

    throw error;
  }
}

// Function to delete an event if user declines
export async function deleteBooking(eventId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID environment variable is not set");
  }

  if (!eventId) {
    throw new Error("Event ID is required");
  }

  const calendar = getCalendarClient();

  try {
    const res = await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: "all", // Notify attendees that event is cancelled
    });

    return { success: true, message: "Event deleted successfully" };
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    console.error("Error deleting meeting:", error);

    if (err.code === 404 || err.message?.includes("Not Found")) {
      throw new Error("Event not found or already deleted");
    }

    throw error;
  }
}

// Function to check attendee response status
export async function getBookingStatus(eventId: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID environment variable is not set");
  }

  if (!eventId) {
    throw new Error("Event ID is required");
  }

  const calendar = getCalendarClient();

  try {
    const res = await calendar.events.get({
      calendarId,
      eventId,
    });

    if (res.data.attendees && res.data.attendees.length > 0) {
      const attendee = res.data.attendees[0];
      return {
        eventId: res.data.id,
        summary: res.data.summary,
        attendeeEmail: attendee.email,
        responseStatus: attendee.responseStatus || "needsAction", // needsAction, accepted, declined, tentative
        htmlLink: res.data.htmlLink,
      };
    }

    return {
      eventId: res.data.id,
      summary: res.data.summary,
      htmlLink: res.data.htmlLink,
    };
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    console.error("Error getting booking status:", error);

    if (err.code === 404 || err.message?.includes("Not Found")) {
      throw new Error("Event not found");
    }

    throw error;
  }
}
