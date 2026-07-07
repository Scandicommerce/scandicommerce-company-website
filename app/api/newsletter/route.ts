import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export interface NewsletterBody {
  email: string
  // Optional context: where the signup happened (e.g. "blog", "footer", "homepage")
  source?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Primary path: HubSpot Forms Submission API.
 * Requires HUBSPOT_NEWSLETTER_FORM_GUID (create a simple "Newsletter" form in
 * HubSpot → Marketing → Forms and paste its GUID into env). The visitor's
 * hubspotutk cookie is forwarded so the contact gets full page/source
 * attribution in HubSpot.
 */
async function submitToHubSpot(
  email: string,
  source: string,
  request: NextRequest
): Promise<boolean> {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
  const formGuid = process.env.HUBSPOT_NEWSLETTER_FORM_GUID
  if (!portalId || !formGuid) return false

  const hutk = request.cookies.get('hubspotutk')?.value
  const pageUri = request.headers.get('referer') || undefined

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [{ objectTypeId: '0-1', name: 'email', value: email }],
        context: {
          ...(hutk ? { hutk } : {}),
          ...(pageUri ? { pageUri } : {}),
          pageName: `Newsletter signup (${source})`,
        },
      }),
    }
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error(`HubSpot form submission failed (${res.status}):`, detail)
    return false
  }
  return true
}

/** Fallback path: notify by email via SMTP (the original behavior). */
async function notifyByEmail(email: string, source: string): Promise<boolean> {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const adminEmail = process.env.NEWSLETTER_ADMIN_EMAIL || process.env.CONTACT_ADMIN_EMAIL
  if (!host || !user || !pass || !adminEmail) return false

  const transporter = nodemailer.createTransport({
    host,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })

  const fromAddress = process.env.CONTACT_FROM_EMAIL || user
  const fromName = process.env.CONTACT_FROM_NAME || 'Scandicommerce Newsletter'

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: adminEmail,
    replyTo: email,
    subject: `Newsletter signup: ${email}`,
    text: `New newsletter subscriber\nEmail: ${email}\nSource: ${source}`,
    html: `
      <h2>New newsletter subscriber</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Source:</strong> ${source}</p>
    `.trim(),
  })
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterBody = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const source = typeof body.source === 'string' ? body.source : 'unknown'

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      )
    }

    // 1) HubSpot (primary) — creates/updates the contact with attribution
    if (await submitToHubSpot(email, source, request).catch((e) => {
      console.error('HubSpot submission error:', e)
      return false
    })) {
      return NextResponse.json({ success: true, message: 'Subscribed successfully' })
    }

    // 2) SMTP notification (fallback)
    if (await notifyByEmail(email, source).catch((e) => {
      console.error('Newsletter email fallback error:', e)
      return false
    })) {
      return NextResponse.json({ success: true, message: 'Subscribed successfully' })
    }

    console.error(
      'Newsletter is not configured: set NEXT_PUBLIC_HUBSPOT_PORTAL_ID + HUBSPOT_NEWSLETTER_FORM_GUID (preferred) or SMTP_* + CONTACT_ADMIN_EMAIL.'
    )
    return NextResponse.json(
      { error: 'Newsletter signup is not configured yet.' },
      { status: 503 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Newsletter signup error:', message, error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}
