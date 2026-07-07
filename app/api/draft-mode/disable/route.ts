import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** Exits draft mode and returns to the page the user was on. */
export function GET(request: NextRequest) {
  draftMode().disable();
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  // Only allow same-origin relative redirects
  const safeTarget = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  return NextResponse.redirect(new URL(safeTarget, request.url));
}
