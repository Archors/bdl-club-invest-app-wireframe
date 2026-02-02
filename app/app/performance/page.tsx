'use client'

import { useState } from 'react'
import { Card, KPICard, CardHeader } from '@/components/ui/Card'
import { SegmentedControl } from '@/components/ui/Tabs'
import { LineChart } from '@/components/charts/LineChart'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatPercent, formatDate } from '@/domain/utils/formatters'
import { SkeletonCard } from '@/components/ui/Skeleton'

type ViewMode = 'reel' | 'simulation'

const performanceData = [
  { x: 2021, y: 50000 },
  { x: 2022, y: 58500 },
  { x: 2023, y: 72000 },
  { x: 2024, y: 103061 },
]

const simulationData = [
  { x: 2021, y: 50000 },
  { x: 2022, y: 62000 },
  { x: 2023, y: 78000 },
  { x: 2024, y: 95000 },
  { x: 2025, y: 115000 },
  { x: 2026, y: 138000 },
]

export default function PerformancePage() {
  const { contracts, loading, totalValue, totalPerformance, totalPerformancePercent } = useContracts()
  const [viewMode, setViewMode] = useState<ViewMode>('reel')

  const totalDeposits = contracts.reduce((sum, c) => sum + c.totalDeposits, 0)

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Toggle */}
      <SegmentedControl
        options={[
          { value: 'reel', label: 'Réel' },
          { value: 'simulation', label: 'Simulation' },
        ]}
        value={viewMode}
        onChange={setViewMode}
        className="w-full"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <KPICard
          label={viewMode === 'reel' ? 'Valeur actuelle' : 'Valeur projetée'}
          value={formatCurrency(viewMode === 'reel' ? totalValue : 138000)}
        />
        <KPICard
          label={viewMode === 'reel' ? 'Plus-value' : 'Plus-value estimée'}
          value={formatCurrency(viewMode === 'reel' ? totalPerformance : 48000)}
          change={formatPercent(viewMode === 'reel' ? totalPerformancePercent : 53.3)}
          changeType="positive"
        />
        <KPICard label="Total investi" value={formatCurrency(totalDeposits)} />
        <KPICard
          label="Rendement annualisé"
          value={formatPercent(viewMode === 'reel' ? 7.2 : 5.5)}
          changeType="positive"
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader
          title={viewMode === 'reel' ? 'Évolution de votre patrimoine' : 'Projection sur 5 ans'}
        />
        <div className="overflow-x-auto -mx-4 px-4">
          <LineChart
            data={viewMode === 'reel' ? performanceData : simulationData}
            width={600}
            height={280}
            color={viewMode === 'reel' ? '#1a365d' : '#38a169'}
            fillColor={viewMode === 'reel' ? '#1a365d' : '#38a169'}
            formatY={(v) => formatCurrency(v)}
            formatX={(v) => v.toString()}
          />
        </div>
      </Card>

      {/* Performance by Contract */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-text">Performance par contrat</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {contracts.map((contract) => (
            <div key={contract.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-text">{contract.label}</p>
                <p className="text-sm text-text-muted">{formatCurrency(contract.currentValue)}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${contract.performanceAmount >= 0 ? 'text-accent' : 'text-danger'}`}>
                  {formatPercent(contract.performancePercent)}
                </p>
                <p className="text-sm text-text-muted">{formatCurrency(contract.performanceAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-xl text-xs text-text-muted">
        <p className="font-medium mb-1">Avertissement</p>
        <p>
          {viewMode === 'reel'
            ? `Les données affichées reflètent la valorisation au ${formatDate(new Date().toISOString())}. Les performances passées ne préjugent pas des performances futures.`
            : 'Cette simulation est fournie à titre indicatif et ne constitue pas un conseil en investissement. Les performances simulées sont basées sur des hypothèses qui peuvent ne pas se réaliser.'}
        </p>
      </div>
    </div>
  )
}
