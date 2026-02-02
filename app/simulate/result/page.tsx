'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, KPICard } from '@/components/ui/Card'
import { LineChart } from '@/components/charts/LineChart'
import { formatCurrency, formatPercent } from '@/domain/utils/formatters'
import type { SimulationResult } from '@/domain/types'

export default function SimulationResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<SimulationResult | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('simulation_result')
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      router.push('/simulate')
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const chartData = result.yearByYear.map((y) => ({
    x: y.year,
    y: y.totalValue,
  }))

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/simulate" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="text-text-muted text-sm">Modifier</span>
          </Link>
          <h1 className="text-base font-semibold text-text">Ma simulation</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="text-center">
          <p className="text-text-muted text-sm mb-1">Capital estimé dans {result.params.horizonYears} ans</p>
          <p className="text-4xl font-bold text-text">{formatCurrency(result.finalValue)}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <KPICard
            label="Total versé"
            value={formatCurrency(result.totalDeposits)}
          />
          <KPICard
            label="Gains estimés"
            value={formatCurrency(result.totalGains)}
            change={formatPercent((result.totalGains / result.totalDeposits) * 100)}
            changeType={result.totalGains >= 0 ? 'positive' : 'negative'}
          />
        </div>

        {/* Chart */}
        <Card>
          <h3 className="font-semibold text-text mb-4">Évolution du capital</h3>
          <div className="flex justify-center">
            <LineChart
              data={chartData}
              width={320}
              height={180}
              color="#745BF6"
              fillColor="#745BF6"
              formatY={(v) => formatCurrency(v)}
              formatX={(v) => `${v}a`}
            />
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-text">Détail par année</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface-solid">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-text-muted font-medium">An</th>
                  <th className="px-4 py-2 text-right text-text-muted font-medium">Versé</th>
                  <th className="px-4 py-2 text-right text-text-muted font-medium">Gains</th>
                  <th className="px-4 py-2 text-right text-text-muted font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {result.yearByYear.map((year) => (
                  <tr key={year.year} className="border-b border-border/50">
                    <td className="px-4 py-3 text-text font-medium">{year.year}</td>
                    <td className="px-4 py-3 text-right text-text-muted text-xs">
                      {formatCurrency(year.cumulativeDeposits)}
                    </td>
                    <td className="px-4 py-3 text-right text-success text-xs">
                      +{formatCurrency(year.cumulativeGains)}
                    </td>
                    <td className="px-4 py-3 text-right text-text font-semibold">
                      {formatCurrency(year.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Disclaimer */}
        <p className="text-xs text-text-subtle text-center">
          Simulation indicative. Les performances passées ne préjugent pas des performances futures.
        </p>

        {/* Actions */}
        <Link href="/signup">
          <Button fullWidth variant="gradient" size="lg">
            Créer mon compte
          </Button>
        </Link>
      </main>
    </div>
  )
}
