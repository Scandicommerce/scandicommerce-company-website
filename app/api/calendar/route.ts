
import { getAvailability } from "./availability";
import { createBooking } from "./booking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }
  const slots = await getAvailability(date);
  return NextResponse.json({ slots: slots });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = await createBooking(body as { name: string; email: string; date: string; time: string; duration: number });
  return NextResponse.json({ event: event });
}
