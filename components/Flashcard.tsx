'use client'

import { useState, useEffect } from 'react'
import type { Card } from '@/lib/schema'

type Props = { card: Card; index: number; total: number }

export default function Flashcard({ card, index, total }: Props) {
  const [flipped, setFlipped] = useState(false)

  // reset to question side whenever the card changes
  useEffect(() => setFlipped(false), [index])

  return (
    <div className="[perspective:1600px]">
      <button
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Show question' : 'Show answer'}
        className="group relative block h-72 w-full cursor-pointer text-left"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* front — question */}
          <div className="absolute inset-0 flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm [backface-visibility:hidden] dark:border-slate-800 dark:bg-slate-900">
            <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              {card.topic}
            </span>
            <p className="mt-5 flex-1 text-xl font-medium leading-relaxed text-slate-900 dark:text-slate-100">
              {card.question}
            </p>
            <span className="text-sm text-slate-400">Tap to reveal answer · {index + 1}/{total}</span>
          </div>

          {/* back — answer */}
          <div className="absolute inset-0 flex flex-col rounded-3xl border border-indigo-200 bg-indigo-50 p-8 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-indigo-500/30 dark:bg-indigo-950/40">
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
              Answer
            </span>
            <p className="mt-4 flex-1 text-lg leading-relaxed text-slate-800 dark:text-slate-100">
              {card.answer}
            </p>
            <span className="text-sm text-indigo-400">Tap to flip back</span>
          </div>
        </div>
      </button>
    </div>
  )
}
