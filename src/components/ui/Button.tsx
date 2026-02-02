'use client'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light active:bg-primary-dark glow-primary',
  secondary: 'bg-transparent text-text border border-border hover:bg-surface-elevated active:bg-surface-solid',
  ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-white/5 active:bg-white/10',
  danger: 'bg-danger text-white hover:bg-red-500 active:bg-red-600',
  gradient: 'gradient-cta text-white hover:shadow-lg',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2.5 text-base min-h-[44px]',
  lg: 'px-6 py-3.5 text-lg min-h-[52px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
