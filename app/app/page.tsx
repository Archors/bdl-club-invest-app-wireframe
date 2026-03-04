'use client'

import Link from 'next/link'
import { GeoMap } from '@/components/ui/GeoMap'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()
  const sponsorCode = user?.sponsorCode || ''

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BDL Club Invest',
          text: `Rejoignez BDL Club Invest avec mon code parrain : ${sponsorCode}`,
        })
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(sponsorCode)
    }
  }

  return (
    <div className="-mt-10 px-4 pt-6 pb-4 space-y-4" style={{ minHeight: '100svh' }}>
      {/* Bandeau actu chaude */}
      <Link href="/app/resources/ou-investir-son-epargne-en-2026" className="flex items-center gap-3 rounded-2xl bg-white border border-border px-4 py-3 active:scale-[0.98] transition-transform">
        <span className="relative flex h-2 w-2 shrink-0 self-start mt-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text leading-snug line-clamp-1">Où investir son épargne en 2026 ? Nos perspectives sur les marchés</p>
          <span className="text-[11px] text-text-muted line-clamp-1">Découvrez les dernières analyses de nos experts sur les marchés</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted shrink-0">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </Link>

      <GeoMap />
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white border border-border text-sm font-semibold text-text-muted active:scale-95 transition-transform duration-150"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Partager mon code parrain
      </button>
    </div>
  )
}
