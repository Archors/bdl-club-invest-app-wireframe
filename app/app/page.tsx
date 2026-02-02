'use client'

import Link from 'next/link'
import { Card, KPICard, CardHeader } from '@/components/ui/Card'
import { PieChart } from '@/components/charts/PieChart'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useContracts, useAllocations, useTransactions } from '@/hooks/useContracts'
import { formatCurrency, formatPercent, formatDate, formatRelativeTime } from '@/domain/utils/formatters'
import { SkeletonCard } from '@/components/ui/Skeleton'

export default function DashboardPage() {
  const { user } = useAuth()
  const { contracts, loading, totalValue, totalPerformance, totalPerformancePercent } = useContracts()
  const { allocations } = useAllocations()
  const { transactions } = useTransactions()

  const recentTransactions = transactions.slice(0, 5)

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-text">
          Bonjour {user?.firstName} !
        </h2>
        <p className="text-text-muted">
          Voici un aperçu de votre patrimoine.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <KPICard
          label="Encours total"
          value={formatCurrency(totalValue)}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <KPICard
          label="Performance"
          value={formatCurrency(totalPerformance)}
          change={formatPercent(totalPerformancePercent)}
          changeType={totalPerformance >= 0 ? 'positive' : 'negative'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          }
        />
        <KPICard
          label="Contrats actifs"
          value={contracts.filter((c) => c.status === 'active').length.toString()}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          }
        />
        <KPICard
          label="Dernier mouvement"
          value={recentTransactions[0] ? formatRelativeTime(recentTransactions[0].date) : '-'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
      </div>

      <div className="space-y-4">
        {/* Allocation */}
        <Card>
          <CardHeader
            title="Allocation"
            action={
              <Link href="/app/portfolio" className="text-sm text-primary font-medium">
                Voir tout
              </Link>
            }
          />
          {allocations.length > 0 ? (
            <PieChart
              data={allocations.map((a) => ({
                value: a.value,
                color: a.color,
                label: a.label,
              }))}
              size={180}
            />
          ) : (
            <p className="text-center text-text-muted py-8">Aucune donnée</p>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader
            title="Derniers mouvements"
            action={
              <Link href="/app/transactions" className="text-sm text-primary font-medium">
                Voir tout
              </Link>
            }
          />
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.amount >= 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tx.type === 'deposit' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="19" x2="12" y2="5" />
                          <polyline points="5 12 12 5 19 12" />
                        </svg>
                      ) : tx.type === 'withdrawal' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <polyline points="19 12 12 19 5 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{tx.label}</p>
                      <p className="text-xs text-text-muted">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.amount >= 0 ? 'text-accent' : 'text-text'}`}>
                      {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                    <Badge
                      variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {tx.status === 'completed' ? 'Exécuté' : tx.status === 'pending' ? 'En cours' : tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-muted py-8">Aucun mouvement</p>
          )}
        </Card>
      </div>

      {/* Contracts */}
      <Card>
        <CardHeader
          title="Mes contrats"
          action={
            <Link href="/app/contracts" className="text-sm text-primary font-medium">
              Voir tout
            </Link>
          }
        />
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/app/contracts/${contract.id}`}
              className="block p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-text">{contract.label}</p>
                  <p className="text-xs text-text-muted capitalize">{contract.type.replace('-', ' ')}</p>
                </div>
                <Badge variant={contract.status === 'active' ? 'success' : 'default'}>
                  {contract.status === 'active' ? 'Actif' : contract.status}
                </Badge>
              </div>
              <p className="text-xl font-bold text-text">{formatCurrency(contract.currentValue)}</p>
              <p className={`text-sm ${contract.performanceAmount >= 0 ? 'text-accent' : 'text-danger'}`}>
                {formatPercent(contract.performancePercent)} ({formatCurrency(contract.performanceAmount)})
              </p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/app/actions/deposit"
          className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="text-sm font-medium text-text">Verser</span>
        </Link>
        <Link
          href="/app/actions/rebalance"
          className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>
          <span className="text-sm font-medium text-text">Arbitrer</span>
        </Link>
        <Link
          href="/app/actions/withdraw"
          className="flex flex-col items-center gap-2 p-4 bg-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          <span className="text-sm font-medium text-text">Racheter</span>
        </Link>
      </div>
    </div>
  )
}
