import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: 'Meauxbility Contact Form <noreply@meauxbility.org>',
      to: process.env.ADMIN_EMAIL || 'info@meauxbility.org',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // Send confirmation to user
    const confirmationEmail = await resend.emails.send({
      from: 'Meauxbility <noreply@meauxbility.org>',
      to: email,
      subject: 'Thank you for contacting Meauxbility',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will respond within 1-2 business days.</p>
        <h3>Your Message:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>
          <strong>Meauxbility</strong><br>
          501(c)(3) Nonprofit<br>
          EIN: 33-4214907<br>
          Lafayette, Louisiana
        </p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}
