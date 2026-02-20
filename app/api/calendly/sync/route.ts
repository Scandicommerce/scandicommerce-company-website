import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/sanity/lib/serverClient";

/**
 * Backfill: fetch existing Calendly scheduled events and create calendlyBooking documents in Sanity.
 *
 * WHY THIS IS NEEDED: Calendly only sends webhooks when a NEW booking is created (or canceled).
 * Meetings that already existed before you registered the webhook never trigger the webhook,
 * so they never appear in Sanity. Call this endpoint once to import all existing meetings.
 *
 * How to run: POST /api/calendly/sync (optionally with header x-setup-secret: <CALENDLY_SETUP_SECRET>).
 * Requires: CALENDLY_PERSONAL_ACCESS_TOKEN, SANITY_API_WRITE_TOKEN, and that NEXT_PUBLIC_SANITY_PROJECT_ID
 * matches the Sanity project where your token was created (see Manage → API → Tokens).
 */

const CALENDLY_API = "https://api.calendly.com";

async function calendlyFetch(pat: string, path: string): Promise<unknown> {
  const url = path.startsWith("http") ? path : `${CALENDLY_API}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pat}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendly API ${res.status}: ${text}`);
  }
  return res.json();
}

type CalendlyEvent = {
  uri?: string;
  name?: string;
  start_time?: string;
  end_time?: string;
  event_type?: string;
  event_memberships?: Array<{ user?: string }>;
};

type CalendlyInvitee = {
  uri?: string;
  email?: string;
  name?: string;
  status?: string;
};

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
        { error: "CALENDLY_PERSONAL_ACCESS_TOKEN is not set." },
        { status: 503 }
      );
    }

    const me = (await calendlyFetch(pat, "/users/me")) as {
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
        { error: "Could not get user or organization URI from Calendly." },
        { status: 500 }
      );
    }

    const scopeKey = orgUri ? "organization" : "user";
    const eventsUrl = `${CALENDLY_API}/scheduled_events?${scopeKey}=${encodeURIComponent(scopeUri)}`;
    const eventsRes = (await calendlyFetch(pat, eventsUrl)) as {
      collection?: CalendlyEvent[];
      pagination?: { next_page?: string };
    };
    const events: CalendlyEvent[] = eventsRes.collection ?? [];
    let nextPage = eventsRes.pagination?.next_page;
    while (nextPage) {
      const next = (await calendlyFetch(pat, nextPage)) as {
        collection?: CalendlyEvent[];
        pagination?: { next_page?: string };
      };
      events.push(...(next.collection ?? []));
      nextPage = next.pagination?.next_page;
    }

    const sanity = getServerClient();
    let created = 0;
    let updated = 0;

    const docFields = (
      inv: CalendlyInvitee,
      ev: CalendlyEvent
    ) => ({
      inviteeName: inv.name ?? "",
      inviteeEmail: inv.email ?? "",
      eventName: ev.name ?? "",
      startTime: ev.start_time ? new Date(ev.start_time).toISOString() : undefined,
      endTime: ev.end_time ? new Date(ev.end_time).toISOString() : undefined,
      status: inv.status === "canceled" ? "canceled" : "active",
      calendlyInviteeUri: inv.uri ?? "",
      calendlyEventUri: ev.uri ?? "",
    });

    for (const ev of events) {
      if (!ev.uri) continue;
      const inviteesRes = (await calendlyFetch(
        pat,
        ev.uri.replace("https://api.calendly.com", "") + "/invitees"
      )) as { collection?: CalendlyInvitee[] };
      const invitees = inviteesRes.collection ?? [];
      for (const inv of invitees) {
        if (!inv.uri) continue;
        const existingId = await sanity.fetch<string | null>(
          `*[_type == "calendlyBooking" && calendlyInviteeUri == $uri][0]._id`,
          { uri: inv.uri }
        );
        const fields = docFields(inv, ev);
        if (existingId) {
          await sanity.patch(existingId).set(fields).commit();
          updated++;
        } else {
          await sanity.create({
            _type: "calendlyBooking",
            ...fields,
          });
          created++;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Sync complete. No duplicates: existing meetings updated, new ones created.",
      created,
      updated,
      total_events: events.length,
    });
  } catch (err) {
    console.error("[Calendly sync]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Sync failed", detail: message },
      { status: 500 }
    );
  }
}
