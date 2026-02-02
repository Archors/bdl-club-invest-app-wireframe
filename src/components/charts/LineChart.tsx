'use client'

import { cn } from '@/lib/cn'

interface DataPoint {
  x: number
  y: number
  label?: string
}

interface LineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
  fillColor?: string
  showGrid?: boolean
  showLabels?: boolean
  formatY?: (value: number) => string
  formatX?: (value: number) => string
  className?: string
}

export function LineChart({
  data,
  width = 400,
  height = 200,
  color = '#3182ce',
  fillColor,
  showGrid = true,
  showLabels = true,
  formatY = (v) => v.toLocaleString('fr-FR'),
  formatX = (v) => v.toString(),
  className,
}: LineChartProps) {
  if (data.length < 2) return null

  const padding = { top: 20, right: 20, bottom: 30, left: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const minY = Math.min(...data.map((d) => d.y)) * 0.95
  const maxY = Math.max(...data.map((d) => d.y)) * 1.05
  const minX = Math.min(...data.map((d) => d.x))
  const maxX = Math.max(...data.map((d) => d.x))

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * chartWidth
  const scaleY = (y: number) => padding.top + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight

  const linePath = data
    .map((point, i) => {
      const x = scaleX(point.x)
      const y = scaleY(point.y)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const areaPath = `
    ${linePath}
    L ${scaleX(data[data.length - 1].x)} ${padding.top + chartHeight}
    L ${scaleX(data[0].x)} ${padding.top + chartHeight}
    Z
  `

  const yTicks = 5
  const yStep = (maxY - minY) / yTicks

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', maxWidth: width, height: 'auto' }}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {showGrid && (
        <g className="text-gray-200">
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const y = padding.top + (i / yTicks) * chartHeight
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeDasharray="4"
              />
            )
          })}
        </g>
      )}

      {fillColor && (
        <path d={areaPath} fill={fillColor} opacity={0.2} />
      )}

      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {data.map((point, i) => (
        <circle
          key={i}
          cx={scaleX(point.x)}
          cy={scaleY(point.y)}
          r={4}
          fill="white"
          stroke={color}
          strokeWidth={2}
        />
      ))}

      {showLabels && (
        <>
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const value = maxY - i * yStep
            const y = padding.top + (i / yTicks) * chartHeight
            return (
              <text
                key={i}
                x={padding.left - 8}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-text-muted"
              >
                {formatY(value)}
              </text>
            )
          })}

          {data
            .filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1)
            .map((point, i) => (
              <text
                key={i}
                x={scaleX(point.x)}
                y={height - 8}
                textAnchor="middle"
                className="text-xs fill-text-muted"
              >
                {formatX(point.x)}
              </text>
            ))}
        </>
      )}
    </svg>
  )
}
