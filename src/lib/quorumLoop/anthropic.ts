import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-3-5-haiku-latest'

let client: Anthropic | null = null

export function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export interface CallResult {
  text: string
  inputTokens: number
  outputTokens: number
}

export async function callModel(
  system: string,
  userPrompt: string,
  maxTokens: number,
): Promise<CallResult> {
  const anthropic = getClient()

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}
