import OpenAI from 'openai'

/**
 * Free, no-credit-card LLM access through any OpenAI-compatible provider.
 *
 * Default: Groq (fast, free, no card). Get a key at https://console.groq.com/keys
 * and set LLM_API_KEY — that's the only variable you need.
 *
 * Prefer Google Gemini (higher free limits)? Also set:
 *   LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
 *   LLM_MODEL=<a model shown in Google AI Studio, e.g. gemini-2.5-flash>
 */
export const LLM_MODEL = process.env.LLM_MODEL ?? 'llama-3.3-70b-versatile'

export function hasLlmKey(): boolean {
  return Boolean(process.env.LLM_API_KEY)
}

export function llm(): OpenAI {
  return new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL ?? 'https://api.groq.com/openai/v1',
  })
}
