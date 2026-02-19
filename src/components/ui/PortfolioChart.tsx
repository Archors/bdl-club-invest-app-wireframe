'use client'

import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { portfolioHistory } from '@/data/portfolioHistory'
import { formatCurrency } from '@/domain/utils/formatters'
import { cn } from '@/lib/cn'

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const perf = d.value - d.invested
  const perfPct = d.invested > 0 ? (perf / d.invested) * 100 : 0
  return (
    <div className="bg-white rounded-xl shadow-lg border border-border px-3 py-2">
      <p className="text-[11px] text-text-muted">{new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</p>
      <p className="text-sm font-bold text-text">{formatCurrency(d.value)}</p>
      <p className={cn('text-[11px] font-semibold', perf >= 0 ? 'text-success' : 'text-danger')}>
        {perf >= 0 ? '+' : ''}{formatCurrency(perf)} · {perfPct >= 0 ? '+' : ''}{perfPct.toFixed(1)} %
      </p>
    </div>
  )
}

export function PortfolioChart() {
  const data = portfolioHistory
  const last = data[data.length - 1]
  const first = data[0]
  const gain = last && first ? last.value - first.value : 0
  const gainPct = first?.value > 0 ? (gain / first.value) * 100 : 0
  const isPositive = gain >= 0
  const color = isPositive ? '#0E8B5D' : '#C2002E'
  const minVal = Math.min(...data.map(d => d.value)) * 0.98

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <p className="text-[11px] text-text-muted">Évolution du portefeuille</p>
        <div className="flex items-end gap-3 mt-0.5">
          <p className="text-2xl font-bold text-text">{last ? formatCurrency(last.value) : '—'}</p>
          <span className={cn('text-sm font-semibold mb-0.5', isPositive ? 'text-success' : 'text-danger')}>
            {isPositive ? '+' : ''}{gainPct.toFixed(1)} %
          </span>
        </div>
      </div>

      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={[minVal, 'auto']} hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CFD3E2', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: color, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
