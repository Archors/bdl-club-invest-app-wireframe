'use client'

import { cn } from '@/lib/cn'

interface PieSlice {
  value: number
  color: string
  label: string
}

interface PieChartProps {
  data: PieSlice[]
  size?: number
  className?: string
  showLegend?: boolean
}

export function PieChart({ data, size = 200, className, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) return null

  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  let currentAngle = -90

  const slices = data.map((slice) => {
    const percentage = slice.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = `
      M ${centerX} ${centerY}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `

    currentAngle = endAngle

    return {
      ...slice,
      path,
      percentage,
    }
  })

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={slice.color}
            className="transition-opacity hover:opacity-80"
          />
        ))}
        <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="white" />
      </svg>
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3">
          {slices.map((slice, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-text-muted">
                {slice.label} ({(slice.percentage * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
