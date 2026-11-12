import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { HUBSPOT_FORMS_SUBMIT_URL, HUBSPOT_PORTAL_ID, normalizeVariant } from '@/lib/hubspot'
import { EMAIL_RE, newsletterCopy } from '@/lib/newsletterCopy'

export interface NewsletterBody {
  email: string
  /** footer | section | inline (anything else is treated as inline). */
  variant?: string
  /** Full URL of the page the visitor signed up on. */
  pageUri?: string
  /** document.title of that page. */
  pageName?: string
  language?: string
  /** Honeypot: real visitors never fill this in. */
  website?: string
}

type Signup = {
  email: string
  signupSource: string
  pageUri?: string
  pageName?: string
  language: string
}

type HubSpotResult = 'ok' | 'invalid-email' | 'failed' | 'not-configured'

/** Only accept page URLs on our own host, so the form can't be used to plant arbitrary links in HubSpot. */
function sameHostUrl(raw: unknown, request: NextRequest): URL | null {
  if (typeof raw !== 'string' || raw.length > 2000) return null
  try {
    const url = new URL(raw)
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
    return host && url.host === host ? url : null
  } catch {
    return null
  }
}

function refererPath(request: NextRequest): string {
  try {
    return new URL(request.headers.get('referer') || '').pathname
  } catch {
    return '/unknown'
  }
}

/** First hop of x-forwarded-for is the visitor, so HubSpot geolocates the visitor rather than our server. */
function clientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.ip || undefined
}

/**
 * Primary path: HubSpot Forms Submission API v3 (form "Nyhetsbrevnettsiden").
 * Sends the email, the page URL and title, the hubspotutk cookie for attribution,
 * and consent for the "Marketing Information" subscription type. HubSpot dedupes
 * on email, so a repeat signup updates the existing contact.
 */
async function submitToHubSpot(signup: Signup, request: NextRequest): Promise<HubSpotResult> {
  const formGuid = process.env.HUBSPOT_NEWSLETTER_FORM_GUID
  if (!formGuid) return 'not-configured'

  const subscriptionTypeId = Number(process.env.HUBSPOT_NEWSLETTER_SUBSCRIPTION_TYPE_ID)
  const consentText = newsletterCopy(signup.language).consent
  const hutk = request.cookies.get('hubspotutk')?.value
  const ipAddress = clientIp(request)

  const legalConsentOptions =
    Number.isFinite(subscriptionTypeId) && subscriptionTypeId > 0
      ? {
          consent: {
            consentToProcess: true,
            text: consentText,
            communications: [{ value: true, subscriptionTypeId, text: consentText }],
          },
        }
      : undefined
  if (!legalConsentOptions) {
    console.warn('HUBSPOT_NEWSLETTER_SUBSCRIPTION_TYPE_ID is not set: signups reach HubSpot without subscription consent.')
  }

  const res = await fetch(HUBSPOT_FORMS_SUBMIT_URL(HUBSPOT_PORTAL_ID, formGuid), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submittedAt: Date.now(),
      // The form has no signup_source property; HubSpot records the page via context.pageUri.
      fields: [{ objectTypeId: '0-1', name: 'email', value: signup.email }],
      context: {
        ...(hutk ? { hutk } : {}),
        ...(ipAddress ? { ipAddress } : {}),
        ...(signup.pageUri ? { pageUri: signup.pageUri } : {}),
        ...(signup.pageName ? { pageName: signup.pageName } : {}),
      },
      ...(legalConsentOptions ? { legalConsentOptions } : {}),
    }),
  })

  if (res.ok) return 'ok'

  const detail = await res.text().catch(() => '')
  console.error(`HubSpot form submission failed (${res.status}):`, detail)
  // HubSpot rejects addresses it considers invalid or blocked; tell the visitor instead of hiding it.
  if (res.status === 400 && /INVALID_EMAIL|BLOCKED_EMAIL/.test(detail)) return 'invalid-email'
  return 'failed'
}

/** Fallback path: email the signup to the admin inbox via SMTP, so nothing is lost if HubSpot fails. */
async function notifyByEmail(signup: Signup): Promise<boolean> {
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
  const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: adminEmail,
    replyTo: signup.email,
    subject: `Newsletter signup: ${signup.email}`,
    text: `New newsletter subscriber (not in HubSpot, add manually)\nEmail: ${signup.email}\nSource: ${signup.signupSource}`,
    html: `
      <h2>New newsletter subscriber</h2>
      <p>This signup did not reach HubSpot. Add the contact manually.</p>
      <p><strong>Email:</strong> ${escape(signup.email)}</p>
      <p><strong>Source:</strong> ${escape(signup.signupSource)}</p>
    `.trim(),
  })
  return true
}

export async function POST(request: NextRequest) {
  let body: NewsletterBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const language = typeof body.language === 'string' ? body.language : 'no'
  const copy = newsletterCopy(language)

  // Bots fill every field; answer as if it worked so they don't retry.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ success: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: copy.invalidEmail }, { status: 400 })
  }

  const page = sameHostUrl(body.pageUri, request)
  const signup: Signup = {
    email,
    signupSource: `${normalizeVariant(body.variant)}:${page?.pathname || refererPath(request)}`.slice(0, 250),
    pageUri: page?.href,
    pageName: typeof body.pageName === 'string' ? body.pageName.slice(0, 250) : undefined,
    language,
  }

  try {
    const result = await submitToHubSpot(signup, request).catch((e): HubSpotResult => {
      console.error('HubSpot submission error:', e)
      return 'failed'
    })
    if (result === 'ok') return NextResponse.json({ success: true })
    if (result === 'invalid-email') return NextResponse.json({ error: copy.invalidEmail }, { status: 400 })

    const emailed = await notifyByEmail(signup).catch((e) => {
      console.error('Newsletter email fallback error:', e)
      return false
    })
    if (emailed) return NextResponse.json({ success: true })

    console.error('Newsletter is not configured: set HUBSPOT_NEWSLETTER_FORM_GUID (SMTP_* + CONTACT_ADMIN_EMAIL is only a fallback).')
    return NextResponse.json({ error: copy.genericError }, { status: 503 })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: copy.genericError }, { status: 500 })
  }
}
