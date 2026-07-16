'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Download } from 'lucide-react'
import Flashcard from './Flashcard'
import type { Deck as DeckType } from '@/lib/schema'

type Props = { deck: DeckType; onReset: () => void }

export default function Deck({ deck, onReset }: Props) {
  const { cards } = deck
  const [i, setI] = useState(0)
  const [known, setKnown] = useState<Set<number>>(new Set())

  const go = (delta: number) => setI((prev) => Math.min(Math.max(prev + delta, 0), cards.length - 1))

  const toggleKnown = () =>
    setKnown((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const exportCsv = () => {
    const header = 'question,answer,topic,known'
    const rows = cards.map((c, idx) =>
      [c.question, c.answer, c.topic, known.has(idx) ? 'yes' : 'no']
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(','),
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flashcards.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const pct = Math.round((known.size / cards.length) * 100)

  return (
    <div className="space-y-6">
      {/* progress ticks */}
      <div>
        <div className="mb-2 flex items-center justify-between font-mono text-xs text-ink-soft">
          <span>{known.size} / {cards.length} known</span>
          <span>{pct}%</span>
        </div>
        <div className="flex gap-1">
          {cards.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                known.has(idx) ? 'bg-primary' : idx === i ? 'bg-accent' : 'bg-line'
              }`}
            />
          ))}
        </div>
      </div>

      <Flashcard card={cards[i]} index={i} total={cards.length} />

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm border border-line bg-card text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={toggleKnown}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm px-5 py-3.5 font-display text-[15px] font-semibold transition-colors ${
            known.has(i)
              ? 'bg-primary text-paper'
              : 'border border-line bg-card text-ink hover:border-ink'
          }`}
        >
          <Check size={17} /> {known.has(i) ? 'Marked known' : 'Mark as known'}
        </button>

        <button
          onClick={() => go(1)}
          disabled={i === cards.length - 1}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm border border-line bg-card text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <button
          onClick={exportCsv}
          className="flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-soft transition-colors hover:text-primary"
        >
          <Download size={14} /> export csv
        </button>
        <span className="text-line">·</span>
        <button
          onClick={onReset}
          className="flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-soft transition-colors hover:text-primary"
        >
          <RotateCcw size={14} /> new deck
        </button>
      </div>
    </div>
  )
}
