'use client'

import { cn } from '@/lib/cn'

interface SliderProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
  hint?: string
  className?: string
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  hint,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text">{label}</label>
          <span className="text-sm font-semibold text-accent">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
      </div>
      {hint && <p className="text-xs text-text-subtle">{hint}</p>}
    </div>
  )
}
