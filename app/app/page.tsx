'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatPercent } from '@/domain/utils/formatters'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

function ContractDrawer({
  title,
  contracts,
  type,
  open,
  onToggle,
}: {
  title: string
  contracts: { currentValue: number; performanceAmount: number; totalDeposits: number }[]
  type: 'assurance-vie' | 'per'
  open: boolean
  onToggle: () => void
}) {
  const hasContract = contracts.length > 0

  if (!hasContract) {
    const isAV = type === 'assurance-vie'
    return (
      <Card className="border border-border" padding="sm">
        <div className="flex flex-col items-center text-center gap-1.5">
          <p className="text-[11px] font-semibold text-text">{title}</p>
          <p className="text-[10px] text-text-muted">Pas encore ouvert</p>
          <Button variant="secondary" size="sm" fullWidth>
            Ouvrir
          </Button>
        </div>
      </Card>
    )
  }

  const totalValue = contracts.reduce((s, c) => s + c.currentValue, 0)
  const totalPerf = contracts.reduce((s, c) => s + c.performanceAmount, 0)
  const totalDep = contracts.reduce((s, c) => s + c.totalDeposits, 0)
  const perfPercent = totalDep > 0 ? (totalPerf / totalDep) * 100 : 0
  const vlpMonthly = type === 'assurance-vie' ? 2000 : 500

  return (
    <Card className="border border-border" padding="sm">
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-base font-semibold text-text">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-base font-bold text-text">{formatCurrency(totalValue)}</p>
            <p className={cn('text-xs font-semibold', perfPercent >= 0 ? 'text-success' : 'text-danger')}>
              {formatPercent(perfPercent)}
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn('text-text-muted transition-transform', open && 'rotate-180')}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="mt-3 space-y-2 animate-fade-in">
          <div className="p-2.5 rounded-lg bg-surface-solid">
            <p className="text-xs text-text-muted">Plus-value</p>
            <p className={cn('text-sm font-bold', totalPerf >= 0 ? 'text-success' : 'text-danger')}>
              {totalPerf >= 0 ? '+' : ''}{formatCurrency(totalPerf)}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-solid">
            <p className="text-xs text-text-muted">Versements</p>
            <p className="text-sm font-bold text-text">{formatCurrency(totalDep)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-solid">
            <p className="text-xs text-text-muted">VLP mensuel</p>
            <p className="text-sm font-bold text-text">{formatCurrency(vlpMonthly)}</p>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { contracts, loading, totalValue, totalPerformance, totalPerformancePercent } = useContracts()
  const [avOpen, setAvOpen] = useState(false)
  const [perOpen, setPerOpen] = useState(false)

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  const avContracts = contracts.filter((c) => c.type === 'assurance-vie')
  const perContracts = contracts.filter((c) => c.type === 'per')

  return (
    <div className="p-4 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-text">
          Bonjour {user?.firstName},
        </h2>
      </div>

      {/* Bloc 1: Total épargne + perf */}
      <div className="text-center">
        <p className="text-xs text-text-muted mb-1">Total de l&apos;épargne</p>
        <p className="text-3xl font-bold text-text">{formatCurrency(totalValue)}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className={cn(
            'text-sm font-semibold',
            totalPerformance >= 0 ? 'text-success' : 'text-danger'
          )}>
            {totalPerformance >= 0 ? '+' : ''}{formatCurrency(totalPerformance)}
          </span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            totalPerformance >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          )}>
            {formatPercent(totalPerformancePercent)}
          </span>
        </div>
      </div>

      {/* 3 boutons action */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/app/actions/deposit" className="flex flex-col items-center gap-2 p-3">
          <div className="w-12 h-12 rounded-full bg-beige/15 border border-beige/25 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-success">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-text">Investir</span>
        </Link>
        <Link href="/app/actions/rebalance" className="flex flex-col items-center gap-2 p-3">
          <div className="w-12 h-12 rounded-full bg-beige/15 border border-beige/25 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-text">Arbitrer</span>
        </Link>
        <Link href="/app/actions/withdraw" className="flex flex-col items-center gap-2 p-3">
          <div className="w-12 h-12 rounded-full bg-beige/15 border border-beige/25 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-text">Racheter</span>
        </Link>
      </div>

      {/* Assurance Vie + PER côte à côte */}
      <div className="grid grid-cols-2 gap-3 items-start">
        <ContractDrawer
          title="Assurance Vie"
          contracts={avContracts}
          type="assurance-vie"
          open={avOpen}
          onToggle={() => setAvOpen(!avOpen)}
        />
        <ContractDrawer
          title="PER"
          contracts={perContracts}
          type="per"
          open={perOpen}
          onToggle={() => setPerOpen(!perOpen)}
        />
      </div>

      {/* Treemap industries */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-xs text-text-muted">Répartition par industrie</p>
          <p className="text-[10px] text-text-subtle">au 07/02/2026</p>
        </div>
        <div className="flex flex-col gap-[2px] rounded-xl overflow-hidden h-64">
          {/* Row 1 — 51% : Tech 22, Santé 14, Finance 12 */}
          <div className="flex gap-[2px]" style={{ flex: '51' }}>
            <div className="bg-[#2563eb]/70 p-2.5 flex flex-col justify-between" style={{ flex: '22' }}>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                <span className="text-[10px] text-white/70">Technologie</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">22%</p>
                <p className="text-[9px] text-success font-medium">+4.2%</p>
              </div>
            </div>
            <div className="bg-[#7c3aed]/70 p-2 flex flex-col justify-between" style={{ flex: '14' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                <span className="text-[9px] text-white/70">Santé</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">14%</p>
                <p className="text-[9px] text-success font-medium">+2.1%</p>
              </div>
            </div>
            <div className="bg-[#d97706]/70 p-2 flex flex-col justify-between" style={{ flex: '12' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                <span className="text-[9px] text-white/70">Finance</span>
              </div>
              <p className="text-xs font-bold text-white">12%</p>
            </div>
          </div>
          {/* Row 2 — 31% : Industrie 10, Immo 9, Énergie 8, Luxe 7 */}
          <div className="flex gap-[2px]" style={{ flex: '31' }}>
            <div className="bg-[#dc2626]/70 p-2 flex flex-col justify-between" style={{ flex: '10' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M2 20h20" /><path d="M5 20V8l7-5 7 5v12" /><rect x="9" y="12" width="6" height="8" /></svg>
                <span className="text-[9px] text-white/70">Industrie</span>
              </div>
              <p className="text-[10px] font-bold text-white">10%</p>
            </div>
            <div className="bg-[#4f46e5]/70 p-2 flex flex-col justify-between" style={{ flex: '9' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                <span className="text-[9px] text-white/70">Immo.</span>
              </div>
              <p className="text-[10px] font-bold text-white">9%</p>
            </div>
            <div className="bg-[#0891b2]/70 p-2 flex flex-col justify-between" style={{ flex: '8' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>
                <span className="text-[9px] text-white/70">Énergie</span>
              </div>
              <p className="text-[10px] font-bold text-white">8%</p>
            </div>
            <div className="bg-[#059669]/70 p-2 flex flex-col justify-between" style={{ flex: '7' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                <span className="text-[9px] text-white/70">Luxe</span>
              </div>
              <p className="text-[10px] font-bold text-white">7%</p>
            </div>
          </div>
          {/* Row 3 — 18% : Conso 6, Telecom 5, Matér 4, Utilities 3 */}
          <div className="flex gap-[2px]" style={{ flex: '18' }}>
            <div className="bg-[#be185d]/70 p-2 flex flex-col justify-between" style={{ flex: '6' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
                <span className="text-[9px] text-white/70">Conso.</span>
              </div>
              <p className="text-[10px] font-bold text-white">6%</p>
            </div>
            <div className="bg-[#0d9488]/70 p-2 flex flex-col justify-between" style={{ flex: '5' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3" /></svg>
                <span className="text-[9px] text-white/70">Telecom</span>
              </div>
              <p className="text-[10px] font-bold text-white">5%</p>
            </div>
            <div className="bg-[#6d28d9]/70 p-2 flex flex-col justify-between" style={{ flex: '4' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                <span className="text-[9px] text-white/70">Matér.</span>
              </div>
              <p className="text-[10px] font-bold text-white">4%</p>
            </div>
            <div className="bg-[#475569]/70 p-2 flex flex-col justify-between" style={{ flex: '3' }}>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                <span className="text-[9px] text-white/70">Utilities</span>
              </div>
              <p className="text-[10px] font-bold text-white">3%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
