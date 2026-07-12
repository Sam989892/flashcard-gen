# Flashcards, instantly

Paste any study text and Claude turns it into flip-able flashcards you can track and export. A full-stack AI app: text in → structured cards out → interactive study UI.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · Claude API (`@anthropic-ai/sdk`) · Zod · Lucide

## What it shows

| Skill | Where |
|-------|-------|
| Server-side AI call | `app/api/generate/route.ts` — App Router Route Handler calling `client.messages.parse()` with a **Zod-validated structured output** so the model can only return `{ cards: [{ question, answer, topic }] }` |
| Model choice | `claude-opus-4-8` for reliable structured JSON generation |
| Input validation & errors | Length checks, typed `@anthropic-ai/sdk` exception handling (auth / rate limit / API error) each mapped to a clean JSON message and HTTP status |
| Interactive UI | 3D CSS flip cards, known/unknown progress tracking, CSV export |
| No data stored | Cards live in React state only; nothing is persisted server-side |

## Run it

```bash
npm install
cp .env.local.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000
npm run build
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

## Deploy (Vercel)

Push to GitHub, import at [vercel.com](https://vercel.com), and add `ANTHROPIC_API_KEY` as an environment variable. Next.js is auto-detected.

## Resume bullets

- Built a full-stack AI study tool in Next.js 16 + TypeScript that turns pasted
  notes into flashcards via the Claude API, using Zod-schema structured outputs
  so the model returns guaranteed-valid JSON
- Handled the Claude SDK's typed error classes (auth, rate limit, API) with
  clean per-case HTTP responses, plus input validation and a keyless-server guard

---

Concept project — designed & built by Saiyed (Sam) Madni.
