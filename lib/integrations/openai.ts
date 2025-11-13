import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORG_ID,
})

// Helper function for chat completions
export async function createChatCompletion(params: {
  messages: OpenAI.Chat.ChatCompletionMessageParam[]
  model?: string
  temperature?: number
  maxTokens?: number
}) {
  const response = await openai.chat.completions.create({
    model: params.model || 'gpt-4-turbo-preview',
    messages: params.messages,
    temperature: params.temperature ?? 0.7,
    max_tokens: params.maxTokens ?? 1000,
  })

  return response.choices[0].message.content
}

// Helper function for embeddings
export async function createEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })

  return response.data[0].embedding
}

// Helper function for moderation
export async function moderateContent(text: string) {
  const response = await openai.moderations.create({
    input: text,
  })

  return response.results[0]
}
