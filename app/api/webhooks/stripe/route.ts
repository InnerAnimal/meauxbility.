import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/integrations/stripe'
import { createServiceClient } from '@/lib/integrations/supabase-server'
import { sendEmail, emailTemplates } from '@/lib/integrations/resend'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  try {
    const event = await constructWebhookEvent(body, signature)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Save donation to database
        const supabase = await createServiceClient()
        await supabase.from('meauxbility_donations').insert([
          {
            stripe_session_id: session.id,
            amount: (session.amount_total || 0) / 100,
            donor_email: session.customer_email,
            donor_name: session.metadata?.donorName || 'Anonymous',
            status: 'completed',
            currency: 'usd',
          },
        ])

        // Send thank you email
        if (session.customer_email) {
          const template = emailTemplates.donationThankYou({
            name: session.metadata?.donorName || 'Friend',
            amount: (session.amount_total || 0) / 100,
          })

          await sendEmail({
            to: session.customer_email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          })
        }

        break
      }

      case 'payment_intent.succeeded': {
        console.log('Payment succeeded:', event.data.object.id)
        break
      }

      case 'payment_intent.payment_failed': {
        console.error('Payment failed:', event.data.object.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
