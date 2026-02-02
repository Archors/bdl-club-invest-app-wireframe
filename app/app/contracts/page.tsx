'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatPercent, formatDate } from '@/domain/utils/formatters'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { EmptyState, NoDataIcon } from '@/components/ui/EmptyState'

export default function ContractsPage() {
  const { contracts, loading, totalValue, totalPerformance, totalPerformancePercent } = useContracts()

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Summary */}
      <Card className="bg-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Encours total</p>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Performance globale</p>
            <p className="text-xl font-semibold">
              {formatPercent(totalPerformancePercent)}
            </p>
            <p className="text-sm text-white/70">{formatCurrency(totalPerformance)}</p>
          </div>
        </div>
      </Card>

      {/* Contracts List */}
      {contracts.length === 0 ? (
        <EmptyState
          icon={<NoDataIcon />}
          title="Aucun contrat"
          description="Vous n'avez pas encore de contrat. Commencez par ouvrir votre premier contrat."
          action={{
            label: 'Ouvrir un contrat',
            onClick: () => {},
          }}
        />
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Link key={contract.id} href={`/app/contracts/${contract.id}`}>
              <Card className="hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text">{contract.label}</h3>
                      <Badge variant={contract.status === 'active' ? 'success' : 'default'}>
                        {contract.status === 'active' ? 'Actif' : contract.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted capitalize">
                      {contract.type.replace('-', ' ')} • Ouvert le {formatDate(contract.openedAt)}
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Valeur actuelle</p>
                    <p className="text-lg font-bold text-text">{formatCurrency(contract.currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Total versé</p>
                    <p className="text-lg font-semibold text-text">{formatCurrency(contract.totalDeposits)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Performance</p>
                    <p className={`text-lg font-semibold ${contract.performanceAmount >= 0 ? 'text-accent' : 'text-danger'}`}>
                      {formatPercent(contract.performancePercent)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
