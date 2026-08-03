import OpenAI from 'openai'
import { DeckSchema } from '@/lib/schema'
import { SYSTEM_PROMPT } from '@/lib/prompt'
import { llm, LLM_MODEL, hasLlmKey } from '@/lib/llm'

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

  if (!hasLlmKey()) {
    return Response.json(
      { error: 'Server is missing an LLM_API_KEY. Add one to .env.local.' },
      { status: 500 },
    )
  }

  try {
    const completion = await llm().chat.completions.create({
      model: LLM_MODEL,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return Response.json({ error: 'Could not generate cards from that text.' }, { status: 502 })
    }
    const parsed = DeckSchema.safeParse(json)
    if (!parsed.success) {
      return Response.json({ error: 'Could not generate cards from that text.' }, { status: 502 })
    }
    return Response.json(parsed.data)
  } catch (error) {
    if (error instanceof OpenAI.AuthenticationError) {
      return Response.json({ error: 'Server is missing a valid LLM_API_KEY.' }, { status: 500 })
    }
    if (error instanceof OpenAI.RateLimitError) {
      return Response.json({ error: 'Rate limited. Try again in a minute.' }, { status: 429 })
    }
    if (error instanceof OpenAI.APIError) {
      return Response.json({ error: `LLM API error (${error.status}).` }, { status: 502 })
    }
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }
}
