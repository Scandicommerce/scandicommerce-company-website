import { NextRequest, NextResponse } from "next/server";
import { getBookingStatus } from "../../booking";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing required parameter: eventId" },
        { status: 400 }
      );
    }

    const status = await getBookingStatus(eventId);

    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error getting booking status:", message, error);

    return NextResponse.json(
      {
        error: "Failed to get booking status",
        details: message,
      },
      { status: 500 }
    );
  }
}
