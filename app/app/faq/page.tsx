'use client'

import { useEffect, useState } from 'react'

const PRISMIC_API = 'https://club-invest.cdn.prismic.io/api/v2'

interface FaqItem {
  category: string
  question: string
  answer: string
}

// Cache en mémoire pour éviter un refetch à chaque navigation
let faqCache: { items: FaqItem[]; categories: string[] } | null = null

async function fetchCurrentRef(): Promise<string> {
  const res = await fetch(PRISMIC_API)
  const json = await res.json()
  return json.refs.find((r: any) => r.isMasterRef)?.ref ?? ''
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted shrink-0 transition-transform duration-200"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function FaqAccordion({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={() => setExpanded(v => !v)}
      className="w-full text-left px-4 py-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-text leading-snug flex-1">{question}</span>
        <ChevronIcon expanded={expanded} />
      </div>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: expanded ? '500px' : '0px',
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? 10 : 0,
        }}
      >
        <p className="text-[13px] text-text-muted leading-relaxed whitespace-pre-line">{answer}</p>
      </div>
    </button>
  )
}

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (faqCache) {
      setItems(faqCache.items)
      setCategories(faqCache.categories)
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const currentRef = await fetchCurrentRef()

        const params = new URLSearchParams({
          ref: currentRef,
          q: '[[at(document.type,"page")][at(my.page.uid,"faq")]]',
          lang: 'fr-fr',
        })

        const res = await fetch(`${PRISMIC_API}/documents/search?${params}`)
        const json = await res.json()
        const doc = json.results?.[0]
        if (!doc) return

        const slices: any[] = doc.data?.slices ?? []
        const faqSlice = slices.find((s: any) => s.slice_type === 'faq_table')
        if (!faqSlice) return

        const section: any[] = faqSlice.primary?.section ?? []

        const mapped: FaqItem[] = section.map((item: any) => {
          const answerBlocks: any[] = Array.isArray(item.answer) ? item.answer : []
          const answer = answerBlocks.map((b: any) => b.text ?? '').filter(Boolean).join('\n\n')
          return {
            category: item.category ?? '',
            question: item.question ?? '',
            answer,
          }
        })

        const cats: string[] = []
        for (const item of mapped) {
          if (item.category && !cats.includes(item.category)) cats.push(item.category)
        }

        faqCache = { items: mapped, categories: cats }
        setItems(mapped)
        setCategories(cats)
      } catch (err) {
        console.error('[Prismic] faq error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="bg-background rounded-t-3xl p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-border rounded w-24 ml-1 animate-pulse" />
            <div className="bg-white rounded-2xl border border-border p-4 space-y-3 animate-pulse">
              <div className="h-4 bg-border rounded w-3/4" />
              <div className="h-4 bg-border rounded w-2/3" />
              <div className="h-4 bg-border rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-background rounded-t-3xl p-4">
        <div className="text-center py-12 text-text-muted text-sm">
          Aucune question fréquente pour le moment.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background rounded-t-3xl p-4 space-y-5">
      {categories.map(cat => {
        const catItems = items.filter(item => item.category === cat)
        return (
          <div key={cat}>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2 px-1">
              {cat}
            </p>
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              {catItems.map((item, index) => (
                <div key={index}>
                  {index > 0 && <div className="h-px bg-border mx-4" />}
                  <FaqAccordion question={item.question} answer={item.answer} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
