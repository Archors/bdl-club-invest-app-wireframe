'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, KPICard, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { PieChart } from '@/components/charts/PieChart'
import { useContract } from '@/hooks/useContracts'
import { formatCurrency, formatPercent, formatDate } from '@/domain/utils/formatters'
import { calculateAllocations } from '@/data/positions'
import { SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'

type TabId = 'positions' | 'transactions' | 'documents'

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { contract, positions, transactions, loading, error } = useContract(id)
  const [activeTab, setActiveTab] = useState<TabId>('positions')

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable />
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="p-4">
        <ErrorState
          title="Contrat introuvable"
          message="Ce contrat n'existe pas ou vous n'y avez pas accès."
          onRetry={() => router.push('/app/contracts')}
        />
      </div>
    )
  }

  const allocations = calculateAllocations(positions)

  const tabs = [
    { id: 'positions' as const, label: 'Positions', badge: positions.length },
    { id: 'transactions' as const, label: 'Mouvements', badge: transactions.length },
    { id: 'documents' as const, label: 'Documents' },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/app/contracts"
          className="inline-flex items-center gap-1 text-sm text-text-muted"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour aux contrats
        </Link>
      </div>

      {/* Header */}
      <Card className="bg-primary text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{contract.label}</h1>
              <Badge variant={contract.status === 'active' ? 'success' : 'default'}>
                {contract.status === 'active' ? 'Actif' : contract.status}
              </Badge>
            </div>
            <p className="text-white/70 text-sm capitalize">
              {contract.type.replace('-', ' ')} • Ouvert le {formatDate(contract.openedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/70 text-sm">Valeur actuelle</p>
            <p className="text-3xl font-bold">{formatCurrency(contract.currentValue)}</p>
          </div>
          <div className="text-right">
            <p className={`text-xl font-semibold ${contract.performanceAmount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatPercent(contract.performancePercent)}
            </p>
            <p className="text-sm text-white/70">{formatCurrency(contract.performanceAmount)}</p>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <KPICard label="Versement initial" value={formatCurrency(contract.initialDeposit)} />
        <KPICard label="Total versé" value={formatCurrency(contract.totalDeposits)} />
        <KPICard label="Retraits" value={formatCurrency(contract.totalWithdrawals)} />
        <KPICard
          label="Dernière valorisation"
          value={formatDate(contract.lastValuationAt)}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/app/actions/deposit')}
        >
          Verser
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push('/app/actions/rebalance')}
        >
          Arbitrer
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/app/actions/withdraw')}
        >
          Racheter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

      {/* Tab Content */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          {/* Allocation Chart */}
          {allocations.length > 0 && (
            <Card>
              <CardHeader title="Répartition" />
              <PieChart
                data={allocations.map((a) => ({
                  value: a.value,
                  color: a.color,
                  label: a.label,
                }))}
                size={180}
              />
            </Card>
          )}

          {/* Positions List */}
          <Card padding="none">
            <div className="divide-y divide-gray-100">
              {positions.map((position) => (
                <div key={position.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-text">{position.label}</p>
                      <p className="text-xs text-text-muted">{position.isin}</p>
                    </div>
                    <Badge>{position.assetClass}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted">Valeur</p>
                      <p className="font-semibold text-text">{formatCurrency(position.totalValue)}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Poids</p>
                      <p className="font-semibold text-text">{position.weight.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Perf</p>
                      <p className={`font-semibold ${position.performanceAmount >= 0 ? 'text-accent' : 'text-danger'}`}>
                        {formatPercent(position.performancePercent)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'transactions' && (
        <Card padding="none">
          {transactions.length === 0 ? (
            <p className="p-8 text-center text-text-muted">Aucun mouvement</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount >= 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : '↔'}
                    </div>
                    <div>
                      <p className="font-medium text-text">{tx.label}</p>
                      <p className="text-xs text-text-muted">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.amount >= 0 ? 'text-accent' : 'text-text'}`}>
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
          )}
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <div className="text-center py-8">
            <p className="text-text-muted mb-4">Les documents de ce contrat sont disponibles dans l&apos;espace Documents.</p>
            <Button variant="secondary" onClick={() => router.push('/app/documents')}>
              Voir les documents
            </Button>
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center">
        Dernière valorisation : {formatDate(contract.lastValuationAt)}. Les performances passées ne préjugent pas des performances futures.
      </p>
    </div>
  )
}
