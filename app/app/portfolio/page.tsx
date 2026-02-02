'use client'

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { PieChart } from '@/components/charts/PieChart'
import { useAuth } from '@/hooks/useAuth'
import { useContracts } from '@/hooks/useContracts'
import { getAllPositions, calculateAllocations } from '@/data/positions'
import { formatCurrency, formatPercent } from '@/domain/utils/formatters'
import { SkeletonCard } from '@/components/ui/Skeleton'

export default function PortfolioPage() {
  const { user } = useAuth()
  const { contracts, loading } = useContracts()
  const [selectedContract, setSelectedContract] = useState<string>('all')

  const allPositions = getAllPositions()
  const filteredPositions = selectedContract === 'all'
    ? allPositions
    : allPositions.filter((p) => p.contractId === selectedContract)

  const allocations = calculateAllocations(filteredPositions)
  const totalValue = filteredPositions.reduce((sum, p) => sum + p.totalValue, 0)

  const contractOptions = [
    { value: 'all', label: 'Tous les contrats' },
    ...contracts.map((c) => ({ value: c.id, label: c.label })),
  ]

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Filter */}
      <Select
        options={contractOptions}
        value={selectedContract}
        onChange={(e) => setSelectedContract(e.target.value)}
      />

      {/* Total */}
      <Card className="bg-primary text-white">
        <p className="text-white/70 text-sm">Encours total</p>
        <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
        <p className="text-sm text-white/70">{filteredPositions.length} positions</p>
      </Card>

      {/* Allocation Chart */}
      <Card>
        <CardHeader title="Répartition par classe d'actifs" />
        {allocations.length > 0 ? (
          <PieChart
            data={allocations.map((a) => ({
              value: a.value,
              color: a.color,
              label: a.label,
            }))}
            size={220}
          />
        ) : (
          <p className="text-center text-text-muted py-8">Aucune donnée</p>
        )}
      </Card>

      {/* Allocation Table */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-text">Détail par classe</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {allocations.map((alloc) => (
            <div key={alloc.assetClass} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: alloc.color }}
                />
                <span className="font-medium text-text">{alloc.label}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-text">{formatCurrency(alloc.value)}</p>
                <p className="text-sm text-text-muted">{alloc.weight.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Positions List */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-text">Toutes les positions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredPositions.map((position) => (
            <div key={position.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-text">{position.label}</p>
                  <p className="text-xs text-text-muted">{position.isin}</p>
                </div>
                <Badge>{position.assetClass}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-text-muted">Valeur</p>
                  <p className="font-semibold text-text">{formatCurrency(position.totalValue)}</p>
                </div>
                <div>
                  <p className="text-text-muted">Quantité</p>
                  <p className="font-semibold text-text">{position.quantity.toFixed(2)}</p>
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
  )
}
