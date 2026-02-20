import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getServerClient } from '@/sanity/lib/serverClient'

/**
 * Calendly → Your backend → Sanity
 * This route runs ONLY on the server. Never expose Calendly PAT or webhook signing key to the frontend.
 *
 * Required env (backend only):
 * - SANITY_API_WRITE_TOKEN — Sanity token with write access
 * - CALENDLY_WEBHOOK_SIGNING_KEY — (optional) Verify X-Calendly-Signature; get from Calendly when creating the webhook subscription
 */

// Calendly webhook payload: official structure uses nested payload.invitee, payload.event, payload.event_type
type CalendlyPayload = {
  email?: string
  name?: string
  uri?: string
  event?: string | { start_time?: string; end_time?: string; uri?: string }
  start_time?: string
  end_time?: string
  status?: string
  event_type?: { name?: string; uri?: string }
  invitee?: { email?: string; name?: string; uri?: string }
  event_type_name?: string
}
type CalendlyWebhookPayload = { event?: string; payload?: CalendlyPayload }

function getPayloadFields(p: CalendlyPayload | undefined) {
  if (!p)
    return {
      name: '',
      email: '',
      uri: '',
      eventUri: '',
      startTime: undefined as string | undefined,
      endTime: undefined as string | undefined,
      eventName: '',
    }
  const invitee = p.invitee ?? p
  const eventObj = p.event
  const isEventObj =
    typeof eventObj === 'object' &&
    eventObj !== null &&
    'start_time' in eventObj
  const startTime = isEventObj
    ? (eventObj as { start_time?: string }).start_time
    : (p.start_time ??
      (p as { event_details?: { start_time?: string } }).event_details
        ?.start_time)
  const endTime = isEventObj
    ? (eventObj as { end_time?: string }).end_time
    : (p.end_time ??
      (p as { event_details?: { end_time?: string } }).event_details?.end_time)
  const eventUri = isEventObj
    ? (eventObj as { uri?: string }).uri
    : typeof p.event === 'string'
      ? p.event
      : ''
  return {
    name: invitee.name ?? p.name ?? '',
    email: invitee.email ?? p.email ?? '',
    uri: invitee.uri ?? p.uri ?? '',
    eventUri: eventUri || (typeof p.event === 'string' ? p.event : '') || '',
    startTime,
    endTime,
    eventName: p.event_type?.name ?? p.event_type_name ?? '',
  }
}

function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string | null,
  signingKey: string
): boolean {
  if (!signatureHeader) return false
  try {
    // Support "t=timestamp,v1=signature" format (Stripe-style) or raw signature
    const parts = signatureHeader
      .split(',')
      .reduce<Record<string, string>>((acc, part) => {
        const [k, v] = part.split('=')
        if (k && v) acc[k.trim()] = v.trim()
        return acc
      }, {})
    const receivedSig = parts.v1 ?? signatureHeader
    const expected = crypto
      .createHmac('sha256', signingKey)
      .update(rawBody)
      .digest('hex')
    if (receivedSig.length !== expected.length) return false
    return crypto.timingSafeEqual(
      Buffer.from(receivedSig, 'hex'),
      Buffer.from(expected, 'hex')
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    if (!rawBody) {
      return NextResponse.json({ error: 'Missing body' }, { status: 400 })
    }

    // Logs appear in the SERVER terminal (where you run npm run dev), not in the browser console.
    // This route runs only when Calendly sends a POST to this URL (after you register the webhook).
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Calendly webhook] rawBody', rawBody.slice(0, 500))
    }

    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
    if (signingKey) {
      const sig = request.headers.get('x-calendly-signature')
      if (!verifyCalendlySignature(rawBody, sig, signingKey)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const body = JSON.parse(rawBody) as CalendlyWebhookPayload
    const event = body?.event
    const payload = body?.payload

    if (!event || !payload) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    const client = getServerClient()

    if (event === 'invitee.created') {
      const f = getPayloadFields(payload)
      const doc = {
        _type: 'calendlyBooking',
        inviteeName: f.name,
        inviteeEmail: f.email,
        eventName: f.eventName,
        startTime: f.startTime
          ? new Date(f.startTime).toISOString()
          : undefined,
        endTime: f.endTime ? new Date(f.endTime).toISOString() : undefined,
        status: 'active',
        calendlyInviteeUri: f.uri,
        calendlyEventUri: f.eventUri,
      }
      await client.create(doc)
      return NextResponse.json({ ok: true, created: true })
    }

    if (event === 'invitee.canceled') {
      const f = getPayloadFields(payload)
      const inviteeUri = f.uri
      if (!inviteeUri) {
        return NextResponse.json({ ok: true })
      }
      const id = await client.fetch<string | null>(
        `*[_type == "calendlyBooking" && calendlyInviteeUri == $uri][0]._id`,
        { uri: inviteeUri }
      )
      if (id) {
        await client.patch(id).set({ status: 'canceled' }).commit()
      }
      return NextResponse.json({ ok: true, updated: true })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Calendly webhook]', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
