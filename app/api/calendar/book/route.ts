import { NextRequest, NextResponse } from "next/server";
import { createBooking, deleteBooking, getBookingStatus } from "../booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, date, time, duration } = body;

    if (!name || !email || !date || !time || !duration) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, date, time, and duration are required" },
        { status: 400 }
      );
    }

    const event = await createBooking({ name, email, date, time, duration });

    return NextResponse.json({
      success: true,
      message: "Meeting has been added to the calendar",
      event,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating booking:", message, error);

    // const isKeyError =
    //   /DECODER|1E08010C|unsupported|PEM|private.?key|BEGIN|END/i.test(message) ||
    //   (error as NodeJS.ErrnoException)?.code === "ERR_OSSL_UNSUPPORTED";

    const isCalendarNotFound = /not found|404/i.test(message);
    const isPermissionError = /writer access|permission|forbidden|403/i.test(message);
    const isDelegationError = /Domain-Wide Delegation|cannot invite attendees/i.test(message);

    let hint: string | undefined;

    if (isDelegationError) {
      hint =
        "Domain-Wide Delegation is required to send email invites. " +
        "See: https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority " +
        "Or switch to OAuth2 authentication instead of service account.";
    } else if (isPermissionError) {
      hint =
        `Share the calendar with the service account: Go to Google Calendar → Settings for the calendar → ` +
        `Share with specific people → Add "${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}" with "Make changes to events" permission.`;
    } else if (isCalendarNotFound) {
      hint =
        "Calendar not found. Make sure:\n" +
        "1. GOOGLE_CALENDAR_ID is correct in .env\n" +
        "2. The calendar is shared with the service account email\n" +
        "3. The service account has 'Make changes to events' permission";
    }

    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: message,
        ...(hint && { hint }),
      },
      { status: 500 }
    );
  }
}
