import { NextRequest, NextResponse } from "next/server";
import { deleteBooking } from "../../booking";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing required parameter: eventId" },
        { status: 400 }
      );
    }

    const result = await deleteBooking(eventId);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting booking:", message, error);

    return NextResponse.json(
      {
        error: "Failed to delete booking",
        details: message,
      },
      { status: 500 }
    );
  }
}
