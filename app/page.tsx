'use client'

import { useState } from 'react'
import { Sparkles, Loader2, GraduationCap } from 'lucide-react'
import Deck from '@/components/Deck'
import type { Deck as DeckType } from '@/lib/schema'

const SAMPLE = `The mitochondrion is a double-membrane-bound organelle found in most eukaryotic cells. It generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. Mitochondria have their own small genome, inherited maternally, which supports the endosymbiotic theory: the idea that mitochondria were once free-living bacteria engulfed by an ancestral eukaryotic cell. The inner membrane is folded into cristae, which increase the surface area available for the electron transport chain and ATP synthesis.`

export default function Home() {
  const [text, setText] = useState('')
  const [deck, setDeck] = useState<DeckType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
      setDeck(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-12 sm:py-20">
      <header className="mb-10 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <GraduationCap size={24} />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Flashcards, instantly
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Paste your notes. Claude turns them into study cards you can flip, track and export.
        </p>
      </header>

      {deck ? (
        <Deck deck={deck} onReset={() => { setDeck(null); setText('') }} />
      ) : (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste lecture notes, a textbook passage, or a Wikipedia article…"
            rows={12}
            className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-5 text-[15px] leading-relaxed text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setText(SAMPLE)}
              className="cursor-pointer text-sm text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
            >
              Try a sample
            </button>
            <span className="text-sm text-slate-400">{text.length} chars</span>
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={generate}
            disabled={loading || text.trim().length < 100}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Building your deck…
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate flashcards
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400">
            Needs at least 100 characters. Nothing is stored — cards live in your browser.
          </p>
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-slate-400">
        Concept project by Sam Madni · Next.js + Claude API
      </footer>
    </main>
  )
}
