import { cn } from '@/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'elevated'
  onClick?: () => void
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className, padding = 'md', variant = 'glass', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div'

  const variantStyles = {
    default: 'bg-surface-solid backdrop-blur-xl border border-border glass-card',
    glass: 'glass glass-card',
    elevated: 'bg-surface-elevated backdrop-blur-xl border border-border glass-card',
  }

  return (
    <Component
      className={cn(
        'rounded-2xl shadow-card',
        variantStyles[variant],
        paddingStyles[padding],
        onClick && 'cursor-pointer hover:shadow-card-hover transition-all duration-200 text-left w-full',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

interface KPICardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function KPICard({ label, value, change, changeType = 'neutral', icon, className }: KPICardProps) {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-text-muted',
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted mb-1">{label}</p>
          <p className="text-xl font-bold text-text truncate">{value}</p>
          {change && (
            <p className={cn('text-xs mt-1 font-medium', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
