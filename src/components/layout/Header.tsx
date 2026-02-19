'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatPercent } from '@/domain/utils/formatters'
import { cn } from '@/lib/cn'
import { ContractSheet } from '@/components/ui/ContractSheet'
import type { Contract } from '@/domain/types'

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const lastUpdateDate = yesterday.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const pageTitles: Record<string, string> = {
  '/app': 'Tableau de bord',
  '/app/resources': 'Actualités',
  '/app/contracts': 'Mes contrats',
  '/app/portfolio': 'Portefeuille',
  '/app/performance': 'Performance',
  '/app/transactions': 'Mouvements',
  '/app/documents': 'Documents',
  '/app/profile': 'Mon compte',
  '/app/alerts': 'Notifications',
  '/app/actions/deposit': 'Nouveau versement',
  '/app/actions/scheduled-deposit': 'Versement programmé',
  '/app/actions/rebalance': 'Arbitrage',
  '/app/actions/withdraw': 'Rachat',
  '/app/transactions/history': 'Historique',
}

const CONTRACT_TYPES = [
  { key: 'assurance-vie', label: 'Assurance Vie', short: 'AV' },
  { key: 'per', label: 'PER', short: 'PER' },
] as const

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { contracts, totalValue, totalPerformance, totalPerformancePercent, loading } = useContracts()

  const isHome = pathname === '/app'
  const [collapsed, setCollapsed] = useState(false)
  const [sheetData, setSheetData] = useState<{ label: string; contracts: Contract[] } | null>(null)
  useEffect(() => {
    if (!isHome) return
    setCollapsed(false)

    let localCollapsed = false
    let collapseAt = 0

    const onScroll = () => {
      const y = window.scrollY
      const now = Date.now()
      if (!localCollapsed && y > 60) {
        localCollapsed = true
        collapseAt = now
        setCollapsed(true)
      } else if (localCollapsed && y < 20 && now - collapseAt > 400) {
        localCollapsed = false
        setCollapsed(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const getTitle = () => {
    if (pathname.startsWith('/app/contracts/') && pathname !== '/app/contracts') {
      return 'Détail du contrat'
    }
    return pageTitles[pathname] || 'Le Club'
  }

  const mainTabs = ['/app', '/app/resources', '/app/transactions', '/app/club', '/app/profile']
  const showBackButton = !mainTabs.includes(pathname)
  const useHistoryBack = pathname.startsWith('/app/actions/') || pathname.startsWith('/app/contracts')

  const getBackHref = () => {
    if (pathname.startsWith('/app/transactions/')) return '/app/transactions'
    if (pathname.startsWith('/app/resources/')) return '/app/resources'
    if (pathname.startsWith('/app/club/')) return '/app/club'
    if (pathname === '/app/documents') return '/app/profile'
    return '/app'
  }

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        borderRadius: '0 0 24px 24px',
      }}
    >
      {/* Logo + titre sur la même ligne */}
      <div className={cn('flex items-center justify-between px-5', isHome ? 'h-14' : 'h-20')}>
        {/* Gauche : bouton retour (si sous-page) + logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            useHistoryBack ? (
              <button
                onClick={() => router.back()}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            ) : (
              <Link
                href={getBackHref()}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>
            )
          )}
          <Image src="/image.webp" alt="Club Invest" width={100} height={28} priority />
        </div>

        {/* Droite : titre */}
        {!isHome && (
          <div className="text-right">
            <h1 className="font-semibold text-lg text-white leading-tight">{getTitle()}</h1>
            {pathname === '/app/profile' && user && (
              <p className="text-sm text-white/70 mt-0.5">{user.firstName} {user.lastName}</p>
            )}
          </div>
        )}
      </div>

      {/* Section home : total + contrats scrollables */}
      {isHome && !loading && (
        <div className="pt-2 pb-7">
          {/* Total épargne */}
          <div className={cn('px-4 transition-all duration-300 ease-in-out', collapsed ? 'mb-0' : 'mb-6')}>
            <p className="text-xs text-white/60 mb-1">Total de l&apos;épargne</p>
            <p className="text-4xl font-bold text-white mt-1">{formatCurrency(totalValue)}</p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className={cn('text-sm font-semibold', totalPerformance >= 0 ? 'text-green-300' : 'text-red-300')}>
                {totalPerformance >= 0 ? '+' : ''}{formatCurrency(totalPerformance)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                {formatPercent(totalPerformancePercent)}
              </span>
            </div>
            <p className="text-[11px] text-white/40 mt-2">
              Mis à jour le {lastUpdateDate} à 00h00
            </p>
          </div>

          {/* Scroll horizontal des contrats */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: collapsed ? 0 : 200, opacity: collapsed ? 0 : 1 }}
          >
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-1">
            {CONTRACT_TYPES.map(({ key, label }) => {
              const group = contracts.filter((c) => c.type === key)
              const totalVal = group.reduce((s, c) => s + c.currentValue, 0)
              const totalDep = group.reduce((s, c) => s + c.totalDeposits, 0)
              const totalPerfAmt = group.reduce((s, c) => s + c.performanceAmount, 0)
              const perfPct = totalDep > 0 ? (totalPerfAmt / totalDep) * 100 : 0
              const hasContract = group.length > 0

              return (
                <button
                  key={key}
                  onClick={() => hasContract && setSheetData({ label, contracts: group })}
                  className="shrink-0 w-52 rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm p-4 text-left active:scale-95 transition-transform duration-150"
                >
                  {hasContract ? (
                    <>
                      <p className="text-xs text-white/60 mb-2">{label}</p>
                      <p className="text-2xl font-bold text-white leading-tight">
                        {formatCurrency(totalVal)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                          'text-sm font-semibold',
                          perfPct >= 0 ? 'text-green-300' : 'text-red-300'
                        )}>
                          {formatPercent(perfPct)}
                        </span>
                        <span className="text-xs text-white/50">performance</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-white/60">{label}</p>
                      <p className="text-sm text-white/50">Pas encore ouvert</p>
                      <button className="mt-1 text-xs font-semibold text-white bg-white/20 rounded-xl px-3 py-1.5 hover:bg-white/30 transition-colors self-start">
                        Ouvrir
                      </button>
                    </div>
                  )}
                </button>
              )
            })}

            {/* Card "ouvrir un contrat de plus" */}
            <div className="shrink-0 w-52 rounded-2xl border border-dashed border-white/30 bg-white/10 p-4 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="text-xs text-white/60 text-center leading-snug">
                Ouvrir un<br />nouveau contrat
              </p>
            </div>
          </div>
          </div>
        </div>
      )}

      <ContractSheet
        open={sheetData !== null}
        onClose={() => setSheetData(null)}
        label={sheetData?.label ?? ''}
        contracts={sheetData?.contracts ?? []}
      />
    </header>
  )
}
