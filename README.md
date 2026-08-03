# Flashcards, instantly

Paste any study text and it turns into flip-able flashcards you can track and export. A full-stack AI app: text in → structured cards out → interactive study UI.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · OpenAI-compatible LLM API (`openai` SDK, free Groq / Gemini) · Zod · Lucide

## What it shows

| Skill | Where |
|-------|-------|
| Server-side AI call | `app/api/generate/route.ts` — App Router Route Handler calling the model in JSON mode, then **validating the reply with Zod** so the UI only ever receives `{ cards: [{ question, answer, topic }] }` |
| Provider-agnostic | `lib/llm.ts` — any OpenAI-compatible endpoint via env (`LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL`); defaults to free Groq, one-line switch to Gemini |
| Input validation & errors | Length checks, typed `openai` exception handling (auth / rate limit / API error) each mapped to a clean JSON message and HTTP status |
| Interactive UI | 3D CSS flip cards, known/unknown progress tracking, CSV export |
| No data stored | Cards live in React state only; nothing is persisted server-side |

## Run it

```bash
npm install
cp .env.local.example .env.local   # add your LLM_API_KEY
npm run dev                        # http://localhost:3000
npm run build
```

Get a free key (no credit card) at [console.groq.com/keys](https://console.groq.com/keys).

## Deploy (Vercel)

Push to GitHub, import at [vercel.com](https://vercel.com), and add `LLM_API_KEY` as an environment variable. Next.js is auto-detected.

## Resume bullets

- Built a full-stack AI study tool in Next.js 16 + TypeScript that turns pasted
  notes into flashcards via an LLM API, validating the model's JSON with a Zod
  schema so the UI only ever renders guaranteed-valid data
- Made the model provider-agnostic (any OpenAI-compatible endpoint via env) and
  handled the SDK's typed error classes (auth, rate limit, API) with clean
  per-case HTTP responses, input validation and a keyless-server guard

---

Concept project — designed & built by Saiyed (Sam) Madni.
