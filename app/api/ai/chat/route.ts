import { NextRequest, NextResponse } from 'next/server'
import { createClaudeMessage } from '@/lib/integrations/anthropic'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = chatSchema.parse(body)

    const systemPrompt = `You are a helpful assistant for Meauxbility, a 501(c)(3) nonprofit organization that provides mobility grants to spinal cord injury survivors in Louisiana's Acadiana region.

Your role is to:
- Answer questions about our services and programs
- Guide people through the grant application process
- Provide general information about spinal cord injuries and mobility aids
- Direct people to appropriate resources

Be compassionate, informative, and professional. If you don't know something, direct users to contact us directly at contact@meauxbility.org.`

    const response = await createClaudeMessage({
      messages: [
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nQuestion: ${message}` : message,
        },
      ],
      system: systemPrompt,
      maxTokens: 500,
    })

    return NextResponse.json(
      { success: true, response },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('AI chat error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    )
  }
}
