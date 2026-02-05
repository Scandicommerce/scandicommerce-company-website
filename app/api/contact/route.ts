import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export interface ContactBody {
  firstName?: string
  lastName?: string
  email: string
  company?: string
  interest?: string
  message: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json()
    const { firstName, lastName, email, company, interest, message } = body

    if (!email || !message || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      )
    }

    const adminEmail = process.env.CONTACT_ADMIN_EMAIL
    if (!adminEmail) {
      console.error('CONTACT_ADMIN_EMAIL is not set')
      return NextResponse.json(
        { error: 'Contact form is not configured. Please set CONTACT_ADMIN_EMAIL.' },
        { status: 503 }
      )
    }

    const transporter = getTransporter()
    if (!transporter) {
      console.error('SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required)')
      return NextResponse.json(
        { error: 'Contact form is not configured. Please set SMTP settings.' },
        { status: 503 }
      )
    }

    const fromAddress = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER
    const fromName = process.env.CONTACT_FROM_NAME || 'Scandicommerce Contact Form'

    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Not provided'
    const interestLabel = interest || 'Not specified'

    const html = `
      <h2>New message from contact form</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Interested in:</strong> ${interestLabel}</p>
      <h3>Message</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `.trim()

    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: adminEmail,
      replyTo: email,
      subject: `Contact form: ${fullName} – ${interestLabel}`,
      text: `Name: ${fullName}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\nInterested in: ${interestLabel}\n\nMessage:\n${message}`,
      html
    })

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Contact form send error:', message, error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
