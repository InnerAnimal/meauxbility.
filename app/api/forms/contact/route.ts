import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/integrations/resend'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Send notification email to admin
    const template = emailTemplates.contactForm(validatedData)
    await sendEmail({
      to: process.env.RESEND_TO_EMAIL!,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: validatedData.email,
    })

    // Send confirmation email to user
    await sendEmail({
      to: validatedData.email,
      subject: 'We received your message - Meauxbility',
      html: `
        <p>Dear ${validatedData.name},</p>
        <p>Thank you for contacting Meauxbility. We have received your message and will respond within 24-48 hours.</p>
        <p>Best regards,<br>The Meauxbility Team</p>
      `,
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    )
  }
}
