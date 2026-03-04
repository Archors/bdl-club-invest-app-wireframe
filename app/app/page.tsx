'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GeoMap } from '@/components/ui/GeoMap'
import { useAuth } from '@/hooks/useAuth'

const PRISMIC_API = 'https://club-invest.cdn.prismic.io/api/v2'

interface HotArticle {
  title: string
  slug: string
  thumbnail: string | null
  category: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const sponsorCode = user?.sponsorCode || ''
  const [hotArticle, setHotArticle] = useState<HotArticle | null>(null)

  useEffect(() => {
    const load = async () => {
      const apiRes = await fetch(PRISMIC_API)
      const apiJson = await apiRes.json()
      const ref = apiJson.refs.find((r: any) => r.isMasterRef)?.ref
      const params = new URLSearchParams({
        ref,
        q: '[[at(document.type,"blog")][at(my.blog.type,"Ressource")]]',
        lang: 'fr-fr',
        pageSize: '1',
        orderings: '[my.blog.date desc]',
      })
      const res = await fetch(`${PRISMIC_API}/documents/search?${params}`)
      const json = await res.json()
      const doc = json.results?.[0]
      if (doc) {
        setHotArticle({
          title: doc.data.title ?? '',
          slug: doc.uid ?? doc.id,
          thumbnail: doc.data.thumbnail?.url ?? null,
          category: doc.data.category ?? '',
        })
      }
    }
    load().catch(() => {})
  }, [])

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
      {hotArticle && (
        <Link href={`/app/resources/${hotArticle.slug}`} className="block rounded-2xl overflow-hidden bg-white border border-border active:scale-[0.98] transition-transform">
          {hotArticle.thumbnail && (
            <img src={hotArticle.thumbnail} alt={hotArticle.title} className="w-full h-36 object-cover" />
          )}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-accent px-2 py-0.5 rounded-full">À la une</span>
              {hotArticle.category && (
                <span className="text-[10px] text-text-muted capitalize">{hotArticle.category}</span>
              )}
            </div>
            <p className="text-sm font-semibold text-text leading-snug line-clamp-2">{hotArticle.title}</p>
          </div>
        </Link>
      )}

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
