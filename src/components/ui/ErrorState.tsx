import { cn } from '@/lib/cn'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Une erreur est survenue',
  message = 'Impossible de charger les données. Veuillez réessayer.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-danger mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      <p className="text-text-muted max-w-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="mt-4">
          Réessayer
        </Button>
      )}
    </div>
  )
}
