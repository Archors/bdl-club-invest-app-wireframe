'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const pathLabels: Record<string, string> = {
  app: 'Accueil',
  contracts: 'Contrats',
  portfolio: 'Portefeuille',
  performance: 'Performance',
  transactions: 'Mouvements',
  documents: 'Documents',
  profile: 'Profil',
  alerts: 'Notifications',
  actions: 'Actions',
  deposit: 'Versement',
  rebalance: 'Arbitrage',
  withdraw: 'Rachat',
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length <= 1) return null

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = pathLabels[segment] || segment
    const isLast = index === segments.length - 1

    return { href, label, isLast }
  })

  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          {index > 0 && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          {crumb.isLast ? (
            <span className="text-text font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-text-muted hover:text-text transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
