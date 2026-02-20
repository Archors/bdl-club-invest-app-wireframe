'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

const PRISMIC_API = 'https://club-invest.cdn.prismic.io/api/v2'
const REF = 'aZc5GhMAACcAotUj'

interface Article {
  title: string
  description: string
  category: string
  slug: string
  date: string
  thumbnail: string | null
  authorName: string | null
  authorAvatar: string | null
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function fetchCurrentRef(): Promise<string> {
  const res = await fetch(PRISMIC_API)
  const json = await res.json()
  return json.refs.find((r: any) => r.isMasterRef)?.ref ?? REF
}

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const currentRef = await fetchCurrentRef()

      // Uniquement les articles de type "Ressource" (pas "Blog")
      const params = new URLSearchParams({
        ref: currentRef,
        q: '[[at(document.type,"blog")][at(my.blog.type,"Ressource")]]',
        lang: 'fr-fr',
        pageSize: '100',
        orderings: '[my.blog.date desc]',
        fetchLinks: 'auteur.name,auteur.photo,auteur.job',
      })
      const res = await fetch(`${PRISMIC_API}/documents/search?${params}`)
      const json = await res.json()

      const mapped: Article[] = (json.results ?? []).map((doc: any) => ({
        title: doc.data.title ?? '',
        description: doc.data.description ?? '',
        category: doc.data.category ?? '',
        slug: doc.uid ?? doc.id,
        date: doc.data.date ?? doc.first_publication_date,
        thumbnail: doc.data.thumbnail?.url ?? null,
        authorName: doc.data.auteur?.data?.name ?? null,
        authorAvatar: doc.data.auteur?.data?.photo?.url ?? null,
      }))

      setArticles(mapped)
      setLoading(false)
    }

    load().catch((err) => {
      console.error('[Prismic] error:', err)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex gap-3 animate-pulse">
            <div className="w-16 h-16 rounded-xl bg-border shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-border rounded w-1/3" />
              <div className="h-4 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {articles.map((article, index) => (
        <Link key={article.slug} href={`/app/resources/${article.slug}`} className="block active:scale-[0.98] transition-transform duration-150">
        <Card padding="none">
          {index === 0 ? (
            /* Featured — premier article pleine largeur */
            <div>
              {article.thumbnail ? (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-44 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-44 bg-surface-solid rounded-t-2xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                {article.category && (
                  <span className="text-[11px] font-semibold text-accent-dark capitalize">
                    {article.category}
                  </span>
                )}
                <p className="text-base font-bold text-text mt-1 line-clamp-2">
                  {article.title}
                </p>
                {article.description && (
                  <p className="text-sm text-text-muted mt-1.5 line-clamp-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-text-subtle">{formatDate(article.date)}</span>
                  {article.authorAvatar ? (
                    <img src={article.authorAvatar} alt={article.authorName ?? ''} className="w-6 h-6 rounded-full object-cover" />
                  ) : article.authorName ? (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-accent">{article.authorName[0]}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            /* Articles standard */
            <div className="flex items-start gap-3.5 p-4">
              {article.thumbnail ? (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-surface-solid shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                {article.category && (
                  <span className="text-[11px] font-semibold text-accent-dark capitalize">
                    {article.category}
                  </span>
                )}
                <p className="text-sm font-semibold text-text mt-0.5 line-clamp-2">
                  {article.title}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-text-subtle">{formatDate(article.date)}</span>
                  {article.authorAvatar ? (
                    <img src={article.authorAvatar} alt={article.authorName ?? ''} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  ) : article.authorName ? (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-accent">{article.authorName[0]}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Card>
        </Link>
      ))}

    </div>
  )
}
