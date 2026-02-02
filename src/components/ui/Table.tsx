'use client'

import { cn } from '@/lib/cn'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  className?: string
  emptyMessage?: string
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
  emptyMessage = 'Aucune donnée',
}: TableProps<T>) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-2xl shadow-card p-8 text-center text-text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('bg-surface rounded-2xl shadow-card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider',
                    alignStyles[column.align || 'left'],
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-4 text-sm text-text',
                      alignStyles[column.align || 'left'],
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key]?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface MobileListProps<T> {
  data: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => React.ReactNode
  onItemClick?: (item: T) => void
  className?: string
  emptyMessage?: string
}

export function MobileList<T>({
  data,
  keyExtractor,
  renderItem,
  onItemClick,
  className,
  emptyMessage = 'Aucune donnée',
}: MobileListProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-2xl shadow-card p-8 text-center text-text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('bg-surface rounded-2xl shadow-card divide-y divide-gray-100', className)}>
      {data.map((item) => (
        <div
          key={keyExtractor(item)}
          onClick={() => onItemClick?.(item)}
          className={cn(
            'p-4',
            onItemClick && 'cursor-pointer active:bg-gray-50'
          )}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
