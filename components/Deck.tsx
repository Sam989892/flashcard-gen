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

  return (
    <div className="space-y-6">
      {/* progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{known.size} of {cards.length} marked known</span>
          <span>{Math.round((known.size / cards.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(known.size / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <Flashcard card={cards[i]} index={i} total={cards.length} />

      {/* controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={toggleKnown}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
            known.has(i)
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Check size={17} /> {known.has(i) ? 'Known' : 'Mark as known'}
        </button>

        <button
          onClick={() => go(1)}
          disabled={i === cards.length - 1}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          onClick={exportCsv}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Download size={15} /> Export CSV
        </button>
        <button
          onClick={onReset}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw size={15} /> New deck
        </button>
      </div>
    </div>
  )
}
