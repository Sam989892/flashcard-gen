'use client'

import { useState } from 'react'
import { Sparkles, Loader2, ArrowRight } from 'lucide-react'
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
    <main className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
      {/* masthead */}
      <header className="border-b-2 border-ink pb-6">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.25em] text-ink-soft">
          <span>Study Desk</span>
          <span>No. 01</span>
        </div>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl">
          Flashcards,
          <br />
          <span className="italic text-primary">instantly.</span>
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
          Paste anything you&apos;re studying. It comes back as a stack of cards you can
          flip, mark, and take with you.
        </p>
      </header>

      {deck ? (
        <div className="mt-10">
          <Deck deck={deck} onReset={() => { setDeck(null); setText('') }} />
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste lecture notes, a textbook passage, a Wikipedia article…"
              rows={11}
              className="w-full resize-y rounded-sm border border-line bg-card p-6 text-[16px] leading-8 text-ink shadow-[4px_4px_0_0_var(--color-line)] outline-none transition-shadow placeholder:text-ink-soft/60 focus:shadow-[4px_4px_0_0_var(--color-accent)]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 31px, var(--color-line) 31px, var(--color-line) 32px)',
                backgroundAttachment: 'local',
                lineHeight: '32px',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => setText(SAMPLE)}
              className="cursor-pointer font-medium text-primary underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-primary-2"
            >
              use a sample
            </button>
            <span className="font-mono text-xs text-ink-soft">{text.length} chars</span>
          </div>

          {error && (
            <p className="rounded-sm border-l-4 border-primary bg-primary/8 px-4 py-3 text-sm text-primary-2" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={generate}
            disabled={loading || text.trim().length < 100}
            className="group flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm bg-ink px-7 py-5 text-left font-display text-lg font-semibold text-paper transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <span>Building your deck…</span>
                <Loader2 size={20} className="animate-spin" />
              </>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" /> Make my flashcards
                </span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-ink-soft">
            Needs at least 100 characters. Nothing is saved anywhere.
          </p>
        </div>
      )}

      <footer className="mt-20 border-t border-line pt-5 text-xs text-ink-soft">
        A concept project by Sam Madni.
      </footer>
    </main>
  )
}
