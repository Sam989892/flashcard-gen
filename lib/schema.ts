import { z } from 'zod'

export const CardSchema = z.object({
  question: z.string().describe('A question that tests understanding of a key concept'),
  answer: z.string().describe('A concise answer, 1-3 sentences'),
  topic: z.string().describe('Short topic label for the card, 1-4 words'),
})

export const DeckSchema = z.object({
  cards: z.array(CardSchema).describe('Between 5 and 15 flashcards depending on text length'),
})

export type Card = z.infer<typeof CardSchema>
export type Deck = z.infer<typeof DeckSchema>
