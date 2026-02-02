import { cn } from '@/lib/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width,
    height: height,
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
      style={style}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-card">
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-8 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
