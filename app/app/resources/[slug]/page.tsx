'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { prismicClient } from '@/lib/prismic'

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
    prismicClient.getByUID('article', slug, {
      fetchLinks: ['author.name', 'author.image', 'author.role'],
    }).then((doc) => {
      const rawContent = (doc.data.content as any[]) ?? []
      const content = rawContent.map((block: any) => {
        if (block.type === 'image') {
          return { type: 'image', text: block.url ?? block.src ?? '' }
        }
        const text = (block.text ?? block.spans?.map((s: any) => s.text).join('') ?? '')
        return { type: block.type, text }
      })

      setArticle({
        title: (doc.data.title as string) ?? '',
        date: (doc.data.date as string) ?? doc.first_publication_date,
        category: ((doc.data.category as any)?.uid ?? '').replace(/-/g, ' '),
        thumbnail: (doc.data.thumbnail as any)?.url ?? null,
        authorName: (doc.data.author as any)?.data?.name ?? null,
        authorAvatar: (doc.data.author as any)?.data?.image?.url ?? null,
        authorRole: (doc.data.author as any)?.data?.role ?? null,
        content,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
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
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-52 object-cover"
        />
      ) : (
        <div className="w-full h-52 bg-surface-solid flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-subtle">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
      )}

      <div className="p-4">
        {/* Catégorie + date */}
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <span className="text-[11px] font-semibold text-accent-dark capitalize">{article.category}</span>
          )}
          <span className="text-text-subtle text-[11px]">·</span>
          <span className="text-[11px] text-text-subtle">{formatDate(article.date)}</span>
        </div>

        {/* Titre */}
        <h1 className="text-xl font-bold text-text leading-snug">{article.title}</h1>

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
      </div>
    </div>
  )
}
