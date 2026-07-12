import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { DeckSchema } from '@/lib/schema'
import { SYSTEM_PROMPT } from '@/lib/prompt'

export async function POST(req: Request) {
  let text: unknown
  try {
    ;({ text } = await req.json())
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (typeof text !== 'string' || text.trim().length < 100) {
    return Response.json(
      { error: 'Paste at least a paragraph of study material (100+ characters).' },
      { status: 400 },
    )
  }
  if (text.length > 50_000) {
    return Response.json(
      { error: 'That text is too long. Keep it under 50,000 characters.' },
      { status: 400 },
    )
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'Server is missing an ANTHROPIC_API_KEY. Add one to .env.local.' },
      { status: 500 },
    )
  }

  try {
    const client = new Anthropic() // reads ANTHROPIC_API_KEY from the environment
    const response = await client.messages.parse({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
      output_config: { format: zodOutputFormat(DeckSchema) },
    })

    if (!response.parsed_output) {
      return Response.json({ error: 'Could not generate cards from that text.' }, { status: 502 })
    }
    return Response.json(response.parsed_output)
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: 'Server is missing a valid ANTHROPIC_API_KEY.' },
        { status: 500 },
      )
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'Rate limited. Try again in a minute.' }, { status: 429 })
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: `Claude API error (${error.status}).` }, { status: 502 })
    }
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }
}
