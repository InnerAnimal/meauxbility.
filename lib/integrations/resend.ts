import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

// Helper function for sending emails
export async function sendEmail(params: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}) {
  return await resend.emails.send({
    from: params.from || process.env.RESEND_FROM_EMAIL!,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    reply_to: params.replyTo,
  })
}

// Email templates
export const emailTemplates = {
  grantApplication: (data: {
    name: string
    email: string
    applicationId: string
  }) => ({
    subject: 'Grant Application Received - Meauxbility',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Grant Application Received</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>Thank you for applying for a Meauxbility mobility grant. We have received your application and our team will review it shortly.</p>
              <p><strong>Application ID:</strong> ${data.applicationId}</p>
              <p>You will receive an update within 7-10 business days regarding the status of your application.</p>
              <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:${process.env.RESEND_TO_EMAIL}">${process.env.RESEND_TO_EMAIL}</a>.</p>
              <p>Best regards,<br>The Meauxbility Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.name},\n\nThank you for applying for a Meauxbility mobility grant. Application ID: ${data.applicationId}\n\nYou will receive an update within 7-10 business days.\n\nBest regards,\nThe Meauxbility Team`,
  }),

  contactForm: (data: {
    name: string
    email: string
    message: string
  }) => ({
    subject: 'New Contact Form Submission - Meauxbility',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </body>
      </html>
    `,
    text: `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
  }),

  donationThankYou: (data: {
    name: string
    amount: number
    receiptUrl?: string
  }) => ({
    subject: 'Thank You for Your Donation - Meauxbility',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You! 💙</h1>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>Thank you for your generous donation of $${data.amount.toFixed(2)} to Meauxbility!</p>
              <p>Your support helps us provide mobility grants and accessibility services to spinal cord injury survivors across Louisiana's Acadiana region.</p>
              ${data.receiptUrl ? `<p><a href="${data.receiptUrl}" style="color: #2563eb;">Download your receipt for tax purposes</a></p>` : ''}
              <p>Meauxbility is a 501(c)(3) nonprofit organization (EIN: 33-4214907). Your donation is tax-deductible to the fullest extent allowed by law.</p>
              <p>With gratitude,<br>The Meauxbility Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${data.name},\n\nThank you for your generous donation of $${data.amount.toFixed(2)} to Meauxbility!\n\nYour support helps us provide mobility grants and accessibility services to SCI survivors.\n\nMeauxbility is a 501(c)(3) nonprofit organization (EIN: 33-4214907).\n\nWith gratitude,\nThe Meauxbility Team`,
  }),
}
