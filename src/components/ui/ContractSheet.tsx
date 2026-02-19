'use client'

import { useEffect } from 'react'
import { Contract } from '@/domain/types'
import { Transaction } from '@/domain/types'
import { formatCurrency, formatPercent } from '@/domain/utils/formatters'
import { mockTransactions } from '@/data/transactions'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface ContractSheetProps {
  open: boolean
  onClose: () => void
  label: string
  contracts: Contract[]
}

const txTypeConfig: Record<string, { label: string; color: string; sign: string }> = {
  deposit:   { label: 'Versement',  color: 'text-success', sign: '+' },
  withdrawal:{ label: 'Rachat',     color: 'text-danger',  sign: '-' },
  rebalance: { label: 'Arbitrage',  color: 'text-accent',  sign: '' },
  dividend:  { label: 'Dividende',  color: 'text-success', sign: '+' },
  fee:       { label: 'Frais',      color: 'text-text-muted', sign: '' },
}

export function ContractSheet({ open, onClose, label, contracts }: ContractSheetProps) {
  // Fermer avec Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Bloquer le scroll du body quand ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const contractIds = contracts.map((c) => c.id)
  const transactions = mockTransactions
    .filter((t) => contractIds.includes(t.contractId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  const totalValue    = contracts.reduce((s, c) => s + c.currentValue, 0)
  const totalDeposits = contracts.reduce((s, c) => s + c.totalDeposits, 0)
  const totalPerfAmt  = contracts.reduce((s, c) => s + c.performanceAmount, 0)
  const totalPerfPct  = totalDeposits > 0 ? (totalPerfAmt / totalDeposits) * 100 : 0
  const totalWithdr   = contracts.reduce((s, c) => s + c.totalWithdrawals, 0)
  const vlpMonthly    = contracts[0]?.type === 'assurance-vie' ? 2000 : 500

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          background: 'rgba(7, 2, 49, 0.45)',
          backdropFilter: open ? 'blur(4px)' : 'blur(0px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 380ms cubic-bezier(0.32, 0.72, 0, 1)',
          background: '#F4EFEB',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header du sheet */}
        <div className="px-5 pt-2 pb-4 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-text-muted mb-0.5">{label}</p>
              <p className="text-3xl font-bold text-text">{formatCurrency(totalValue)}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-sm font-semibold', totalPerfAmt >= 0 ? 'text-success' : 'text-danger')}>
                  {totalPerfAmt >= 0 ? '+' : ''}{formatCurrency(totalPerfAmt)}
                </span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-semibold',
                  totalPerfAmt >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                )}>
                  {formatPercent(totalPerfPct)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-border/60 flex items-center justify-center mt-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto flex-1 px-5 pb-8 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Versements', value: formatCurrency(totalDeposits) },
              { label: 'Plus-value', value: formatCurrency(totalPerfAmt), colored: true, positive: totalPerfAmt >= 0 },
              { label: 'VLP mensuel', value: formatCurrency(vlpMonthly) },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-3">
                <p className="text-[10px] text-text-muted mb-1">{stat.label}</p>
                <p className={cn(
                  'text-sm font-bold',
                  stat.colored ? (stat.positive ? 'text-success' : 'text-danger') : 'text-text'
                )}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Actions rapides */}
          <div>
            <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Actions</p>
            <div className="grid grid-cols-3 gap-2">
              <Link href="/app/actions/deposit"
                onClick={onClose}
                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-text">Investir</span>
              </Link>
              <Link href="/app/actions/rebalance"
                onClick={onClose}
                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-text">Arbitrer</span>
              </Link>
              <Link href="/app/actions/withdraw"
                onClick={onClose}
                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-text">Racheter</span>
              </Link>
            </div>
          </div>

          {/* Dernières transactions */}
          {transactions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Dernières opérations</p>
              <div className="bg-white rounded-2xl overflow-hidden divide-y divide-border">
                {transactions.map((tx) => {
                  const cfg = txTypeConfig[tx.type] ?? { label: tx.type, color: 'text-text', sign: '' }
                  const date = new Date(tx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                  const isPending = tx.status === 'pending'
                  return (
                    <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{tx.label}</p>
                        <p className="text-xs text-text-muted">{date}{isPending ? ' · En attente' : ''}</p>
                      </div>
                      {tx.amount !== 0 && (
                        <p className={cn('text-sm font-semibold ml-3 shrink-0', cfg.color)}>
                          {cfg.sign}{formatCurrency(Math.abs(tx.amount))}
                        </p>
                      )}
                      {tx.amount === 0 && (
                        <span className="text-xs text-text-muted ml-3 shrink-0">{cfg.label}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contrats individuels si plusieurs */}
          {contracts.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Contrats</p>
              <div className="space-y-2">
                {contracts.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text">{c.label}</p>
                      <p className="text-xs text-text-muted">
                        Ouvert le {new Date(c.openedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text">{formatCurrency(c.currentValue)}</p>
                      <p className={cn('text-xs font-semibold', c.performanceAmount >= 0 ? 'text-success' : 'text-danger')}>
                        {formatPercent(c.performancePercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
