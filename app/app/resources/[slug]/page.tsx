'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const PRISMIC_API = 'https://club-invest.cdn.prismic.io/api/v2'

interface ArticleDetail {
  title: string
  date: string
  category: string
  thumbnail: string | null
  authorName: string | null
  authorAvatar: string | null
  authorRole: string | null
  content: { type: string; text: string }[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function renderContent(blocks: { type: string; text: string }[]) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'heading1':
        return <h1 key={i} className="text-xl font-bold text-text mt-6 mb-2">{block.text}</h1>
      case 'heading2':
        return <h2 key={i} className="text-lg font-bold text-text mt-5 mb-2">{block.text}</h2>
      case 'heading3':
        return <h3 key={i} className="text-base font-bold text-text mt-4 mb-1">{block.text}</h3>
      case 'paragraph':
        return block.text
          ? <p key={i} className="text-sm text-text leading-relaxed">{block.text}</p>
          : <div key={i} className="h-3" />
      case 'list-item':
        return <li key={i} className="text-sm text-text leading-relaxed ml-4 list-disc">{block.text}</li>
      case 'o-list-item':
        return <li key={i} className="text-sm text-text leading-relaxed ml-4 list-decimal">{block.text}</li>
      case 'image':
        return (
          <img key={i} src={block.text} alt="" className="w-full rounded-xl my-4 object-cover" />
        )
      case 'video':
        return (
          <div key={i} className="relative w-full my-4 rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={block.text.replace('vimeo.com/', 'player.vimeo.com/video/')}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        )
      default:
        return block.text
          ? <p key={i} className="text-sm text-text leading-relaxed">{block.text}</p>
          : null
    }
  })
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const apiRes = await fetch(PRISMIC_API)
      const apiJson = await apiRes.json()
      const ref = apiJson.refs.find((r: any) => r.isMasterRef)?.ref

      const params = new URLSearchParams({
        ref,
        q: `[[at(my.blog.uid,"${slug}")]]`,
        lang: 'fr-fr',
        fetchLinks: 'auteur.name,auteur.photo,auteur.job',
      })
      const docRes = await fetch(`${PRISMIC_API}/documents/search?${params}`)
      const docJson = await docRes.json()
      const doc = docJson.results[0]
      if (!doc) { setLoading(false); return }

      // Extraire le contenu depuis les slices
      const slices = (doc.data.slices as any[]) ?? []
      const content: { type: string; text: string }[] = []

      for (const slice of slices) {
        if (slice.slice_type === 'paragraph') {
          // Chercher le champ rich text dans primary (tableau de blocs)
          const primary = slice.primary ?? {}
          const richText: any[] = Array.isArray(primary)
            ? primary
            : (Object.values(primary).find((v) => Array.isArray(v) && (v as any[])[0]?.type) as any[] | undefined) ?? []

          for (const block of richText) {
            if (block.type === 'image') {
              content.push({ type: 'image', text: block.url ?? block.src ?? '' })
            } else {
              content.push({ type: block.type, text: block.text ?? '' })
            }
          }
        } else if (slice.slice_type === 'faq') {
          const title = slice.primary?.title?.[0]?.text ?? slice.primary?.title ?? ''
          if (title) content.push({ type: 'heading2', text: title })
          for (const item of slice.items ?? []) {
            const q = item.question?.[0]?.text ?? item.question ?? ''
            const a = item.answer?.[0]?.text ?? item.answer ?? ''
            if (q) content.push({ type: 'heading3', text: q })
            if (a) content.push({ type: 'paragraph', text: a })
          }
        } else if (slice.slice_type === 'blog_video') {
          const url = slice.primary?.vimeo_url?.url ?? slice.primary?.vimeo_url ?? ''
          if (url) content.push({ type: 'video', text: url })
        }
      }

      setArticle({
        title: (doc.data.title as string) ?? '',
        date: (doc.data.date as string) ?? doc.first_publication_date,
        category: (doc.data.category as string) ?? '',
        thumbnail: (doc.data.thumbnail as any)?.url ?? null,
        authorName: (doc.data.auteur as any)?.data?.name ?? null,
        authorAvatar: (doc.data.auteur as any)?.data?.photo?.url ?? null,
        authorRole: (doc.data.auteur as any)?.data?.job ?? null,
        content,
      })
      setLoading(false)
    }
    load().catch((err) => {
      console.error('[Prismic] article error:', err)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-48 bg-white rounded-2xl" />
        <div className="space-y-2">
          <div className="h-3 bg-white rounded w-1/4" />
          <div className="h-6 bg-white rounded w-3/4" />
          <div className="h-6 bg-white rounded w-1/2" />
        </div>
        <div className="space-y-2 mt-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-white rounded" />)}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="p-4 text-center text-text-muted text-sm mt-8">
        Article introuvable
      </div>
    )
  }

  return (
    <div className="pb-8">
      {/* Image hero */}
      {article.thumbnail ? (
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-52 object-cover"
          />
        </div>
      ) : null}

      <div className="p-4">
        {/* Catégorie + date */}
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <span className="text-[11px] font-semibold text-accent-dark capitalize">{article.category}</span>
          )}
          <span className="text-text-subtle text-[11px]">·</span>
          <span className="text-[11px] text-text-subtle">{formatDate(article.date)}</span>
        </div>

        {/* Titre + Partager */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-text leading-snug flex-1">{article.title}</h1>
          <button
            onClick={async (e) => {
              e.stopPropagation()
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: article.title,
                    text: article.title,
                    url: window.location.href,
                  })
                } catch { /* cancelled */ }
              } else {
                await navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="mt-1 w-8 h-8 rounded-full bg-surface-solid flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            aria-label="Partager"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>

        {/* Auteur */}
        {(article.authorName || article.authorAvatar) && (
          <div className="flex items-center gap-2.5 mt-4 mb-5 pb-5 border-b border-border">
            {article.authorAvatar ? (
              <img src={article.authorAvatar} alt={article.authorName ?? ''} className="w-9 h-9 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-accent">{article.authorName?.[0]}</span>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-text">{article.authorName}</p>
              {article.authorRole && <p className="text-[11px] text-text-muted">{article.authorRole}</p>}
            </div>
          </div>
        )}

        {/* Contenu */}
        <div className="space-y-3">
          {renderContent(article.content)}
        </div>

        {/* Bouton partage en fin d'article */}
        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <button
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: article.title,
                    text: article.title,
                    url: window.location.href,
                  })
                } catch { /* cancelled */ }
              } else {
                await navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-solid text-text text-sm font-medium active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Partager cet article
          </button>
        </div>
      </div>
    </div>
  )
}
