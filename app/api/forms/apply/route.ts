import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/integrations/supabase-server'
import { sendEmail, emailTemplates } from '@/lib/integrations/resend'
import { z } from 'zod'

const applySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  zip: z.string().min(5),
  injuryDate: z.string(),
  injuryLevel: z.string(),
  equipmentNeeded: z.string(),
  estimatedCost: z.string(),
  additionalInfo: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = applySchema.parse(body)

    // Create Supabase client
    const supabase = await createServiceClient()

    // Store application in database
    const { data, error } = await supabase
      .from('grant_applications')
      .insert([
        {
          ...validatedData,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to save application')
    }

    // Send confirmation email to applicant
    const template = emailTemplates.grantApplication({
      name: validatedData.name,
      email: validatedData.email,
      applicationId: data.id,
    })

    await sendEmail({
      to: validatedData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    // Send notification to admin
    await sendEmail({
      to: process.env.RESEND_TO_EMAIL!,
      subject: `New Grant Application - ${validatedData.name}`,
      html: `
        <h2>New Grant Application Received</h2>
        <p><strong>Application ID:</strong> ${data.id}</p>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Equipment Needed:</strong> ${validatedData.equipmentNeeded}</p>
        <p><strong>Estimated Cost:</strong> ${validatedData.estimatedCost}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View in Dashboard</a></p>
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId: data.id,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Grant application error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
