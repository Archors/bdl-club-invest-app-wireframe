'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks'

const pageTitles: Record<string, string> = {
  '/app': 'Tableau de bord',
  '/app/contracts': 'Mes contrats',
  '/app/portfolio': 'Portefeuille',
  '/app/performance': 'Performance',
  '/app/transactions': 'Mouvements',
  '/app/documents': 'Documents',
  '/app/profile': 'Mon profil',
  '/app/alerts': 'Notifications',
  '/app/actions/deposit': 'Nouveau versement',
  '/app/actions/rebalance': 'Arbitrage',
  '/app/actions/withdraw': 'Rachat',
}

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

  const getTitle = () => {
    if (pathname.startsWith('/app/contracts/') && pathname !== '/app/contracts') {
      return 'Détail du contrat'
    }
    return pageTitles[pathname] || 'Club Invest'
  }

  const showBackButton = pathname !== '/app' && !pathname.startsWith('/app/contracts/')

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Link
              href="/app"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
          ) : (
            <Image
              src="/image.webp"
              alt="Club Invest"
              width={100}
              height={28}
              priority
            />
          )}
          {showBackButton && (
            <h1 className="font-medium text-text truncate">{getTitle()}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/app/alerts"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </Link>
          <Link
            href="/app/profile"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm"
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Link>
        </div>
      </div>
    </header>
  )
}
