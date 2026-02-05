import { NextRequest, NextResponse } from "next/server";
import { getAvailability } from "../availability";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const slots = await getAvailability(date);
    console.log(`[Availability] Date: ${date}, Slots found: ${slots.length}`);
    return NextResponse.json({ slots });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Availability] Error:", message, error);
    return NextResponse.json(
      {
        error: message,
        slots: [],
      },
      { status: 500 }
    );
  }
}
