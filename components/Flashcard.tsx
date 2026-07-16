'use client'

import { useState, useEffect } from 'react'
import type { Card } from '@/lib/schema'

type Props = { card: Card; index: number; total: number }

export default function Flashcard({ card, index, total }: Props) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => setFlipped(false), [index])

  return (
    <div className="[perspective:1600px]">
      <button
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Show question' : 'Show answer'}
        className="group relative block h-80 w-full cursor-pointer text-left"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* front — question, styled like a ruled index card */}
          <div className="absolute inset-0 flex flex-col rounded-sm border border-line bg-card p-8 shadow-[6px_6px_0_0_var(--color-line)] [backface-visibility:hidden]">
            <div className="mb-4 flex items-center gap-3 border-b border-primary/30 pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">{card.topic}</span>
            </div>
            <p className="flex-1 font-display text-2xl font-medium leading-snug text-ink">
              {card.question}
            </p>
            <span className="font-mono text-xs text-ink-soft">flip for answer · {index + 1}/{total}</span>
          </div>

          {/* back — answer */}
          <div className="absolute inset-0 flex flex-col rounded-sm border border-ink bg-ink p-8 shadow-[6px_6px_0_0_var(--color-primary)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="mb-4 border-b border-accent/40 pb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Answer
            </span>
            <p className="flex-1 text-lg leading-relaxed text-paper">{card.answer}</p>
            <span className="font-mono text-xs text-paper/50">flip back</span>
          </div>
        </div>
      </button>
    </div>
  )
}
