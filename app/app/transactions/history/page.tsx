'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useTransactions, useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatDate } from '@/domain/utils/formatters'
import { cn } from '@/lib/cn'

const MONTH_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

function getMonthKey(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
}

function getMonthLabel(key: string) {
  const [year, month] = key.split('-')
  const currentYear = new Date().getFullYear().toString()
  if (year === currentYear) return MONTH_LABELS[parseInt(month)]
  return `${MONTH_LABELS[parseInt(month)]} ${year}`
}

export default function TransactionHistoryPage() {
  const { contracts } = useContracts()
  const { transactions } = useTransactions()
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pillsRef = useRef<HTMLDivElement>(null)

  const depositTransactions = transactions
    .filter((tx) => tx.type === 'deposit')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group by month
  const grouped: Record<string, typeof depositTransactions> = {}
  depositTransactions.forEach((tx) => {
    const key = getMonthKey(tx.date)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(tx)
  })

  const months = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    if (months.length > 0 && !activeMonth) {
      const lastMonth = months[months.length - 1]
      setActiveMonth(lastMonth)
      // Scroll pills to the right
      if (pillsRef.current) {
        pillsRef.current.scrollLeft = pillsRef.current.scrollWidth
      }
    }
  }, [months, activeMonth])

  const scrollToMonth = (key: string) => {
    setActiveMonth(key)
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getContractLabel = (contractId: string) => {
    return contracts.find((c) => c.id === contractId)?.label || contractId
  }

  return (
    <div className="p-4 space-y-4">
      {/* Month pills */}
      <div ref={pillsRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {months.map((key) => (
          <button
            key={key}
            onClick={() => scrollToMonth(key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
              activeMonth === key
                ? 'bg-accent text-white'
                : 'bg-surface-solid text-text-muted border border-border'
            )}
          >
            {getMonthLabel(key)}
          </button>
        ))}
      </div>

      {/* Grouped transactions */}
      <div className="space-y-5">
        {[...months].reverse().map((key) => (
          <div
            key={key}
            ref={(el) => { sectionRefs.current[key] = el }}
            className="scroll-mt-20"
          >
            <p className="text-xs text-text-muted font-semibold mb-2">{getMonthLabel(key)}</p>
            <Card padding="none">
              <div className="divide-y divide-border/50">
                {grouped[key].map((tx) => (
                  <div key={tx.id} className="px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-accent/10 text-accent-light">
                        {tx.label.includes('programmé') ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{tx.label}</p>
                        <p className="text-[11px] text-text-muted">
                          {getContractLabel(tx.contractId)} &middot; {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success">+{formatCurrency(tx.amount)}</p>
                      <Badge
                        variant={tx.status === 'completed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {tx.status === 'completed' ? 'Exécuté' : 'En cours'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
