'use client'

import { cn } from '@/lib/cn'

interface Tab {
  id: string
  label: string
  badge?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-gray-100 rounded-xl', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-surface text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          )}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex gap-1 p-1 bg-gray-100 rounded-xl', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            value === option.value
              ? 'bg-surface text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
