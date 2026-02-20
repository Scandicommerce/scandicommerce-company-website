import { NextRequest, NextResponse } from "next/server";

/**
 * One-time setup: register Calendly webhook so Calendly sends invitee.created / invitee.canceled to our backend.
 * Uses CALENDLY_PERSONAL_ACCESS_TOKEN only on the server. Never expose this route or the PAT to the frontend.
 *
 * Call once after deploy: POST /api/calendly/register-webhook with header "x-setup-secret: <CALENDLY_SETUP_SECRET>"
 * Or run from a server script. Requires in .env:
 * - CALENDLY_PERSONAL_ACCESS_TOKEN (backend only)
 * - CALENDLY_SETUP_SECRET (optional; if set, request must include header x-setup-secret with this value)
 * - NEXT_PUBLIC_SITE_URL (e.g. https://yourdomain.com) so we know the webhook URL
 */

const CALENDLY_API = "https://api.calendly.com";

async function calendlyFetch(pat: string, path: string, options: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${CALENDLY_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendly API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.CALENDLY_SETUP_SECRET;
    if (secret) {
      const headerSecret = request.headers.get("x-setup-secret");
      if (headerSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const pat = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
    if (!pat) {
      return NextResponse.json(
        { error: "CALENDLY_PERSONAL_ACCESS_TOKEN is not set. Add it to .env (backend only)." },
        { status: 503 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const webhookUrl = `${baseUrl.replace(/\/$/, "")}/api/calendly/webhook`;

    const me = await calendlyFetch(pat, "/users/me") as {
      resource?: { uri?: string; current_organization?: string };
      uri?: string;
      current_organization?: string;
    };
    const resource = me.resource ?? me;
    const orgUri = resource.current_organization ?? (me as { current_organization?: string }).current_organization;
    const userUri = resource.uri ?? me.uri;
    const scopeUri = orgUri || userUri;
    if (!scopeUri) {
      return NextResponse.json(
        { error: "Could not get user or organization URI from Calendly" },
        { status: 500 }
      );
    }

    const scopeKey = orgUri ? "organization" : "user";
    const body = {
      url: webhookUrl,
      events: ["invitee.created", "invitee.canceled"],
      [scopeKey]: scopeUri,
    };

    const sub = await calendlyFetch(pat, "/webhook_subscriptions", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json({
      ok: true,
      message: "Webhook registered. New Calendly bookings will sync to Sanity.",
      webhook_url: webhookUrl,
      scope: scopeKey,
      subscription: sub,
    });
  } catch (err) {
    console.error("[Calendly register-webhook]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to register webhook", detail: message },
      { status: 500 }
    );
  }
}
