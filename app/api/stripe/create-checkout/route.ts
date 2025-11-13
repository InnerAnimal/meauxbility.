import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/integrations/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  amount: z.number().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, name, email } = checkoutSchema.parse(body)

    const session = await createCheckoutSession({
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to Meauxbility',
              description: 'Supporting mobility grants for SCI survivors',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/donate?canceled=true`,
      customerEmail: email,
      metadata: {
        donorName: name || 'Anonymous',
        purpose: 'donation',
      },
    })

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
