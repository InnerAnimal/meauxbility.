import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Helper function for Claude messages
export async function createClaudeMessage(params: {
  messages: Anthropic.MessageParam[]
  model?: string
  maxTokens?: number
  temperature?: number
  system?: string
}) {
  const response = await anthropic.messages.create({
    model: params.model || 'claude-3-5-sonnet-20241022',
    max_tokens: params.maxTokens ?? 1024,
    temperature: params.temperature ?? 0.7,
    system: params.system,
    messages: params.messages,
  })

  const content = response.content[0]
  return content.type === 'text' ? content.text : null
}

// Helper function for streaming responses
export async function* streamClaudeMessage(params: {
  messages: Anthropic.MessageParam[]
  model?: string
  maxTokens?: number
  temperature?: number
  system?: string
}) {
  const stream = await anthropic.messages.stream({
    model: params.model || 'claude-3-5-sonnet-20241022',
    max_tokens: params.maxTokens ?? 1024,
    temperature: params.temperature ?? 0.7,
    system: params.system,
    messages: params.messages,
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      yield chunk.delta.text
    }
  }
}
