'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { mockResources } from '@/data/resources'
import type { ResourceType } from '@/data/resources'
import { cn } from '@/lib/cn'

const filters: { label: string; value: ResourceType | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Articles', value: 'article' },
  { label: 'Vidéos', value: 'video' },
  { label: 'Rencontres', value: 'visite' },
  { label: 'Lettres', value: 'lettre' },
]

const typeConfig: Record<ResourceType, { label: string; color: string; icon: React.ReactNode }> = {
  article: {
    label: 'Article',
    color: 'bg-accent/15 text-accent-light border border-accent/20',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  video: {
    label: 'Vidéo',
    color: 'bg-beige/10 text-beige-light border border-beige/20',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  visite: {
    label: 'Rencontre',
    color: 'bg-success/15 text-success-light border border-success/20',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  lettre: {
    label: 'Lettre du Club',
    color: 'bg-warning/15 text-warning border border-warning/20',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<ResourceType | 'all'>('all')

  const filteredResources = (activeFilter === 'all'
    ? mockResources
    : mockResources.filter((r) => r.type === activeFilter)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text">Actualités</h2>
        <p className="text-text-muted text-sm mt-1">Le fil d&apos;actu BDL Club Invest</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
              activeFilter === f.value
                ? 'bg-accent text-white'
                : 'bg-surface-solid text-text-muted border border-border'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filteredResources.map((resource) => {
          const config = typeConfig[resource.type]
          return (
            <Card key={resource.id} className="border border-border">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold', config.color)}>
                      {config.icon}
                      {config.label}
                    </span>
                    <span className="text-[11px] text-text-muted">{formatDate(resource.date)}</span>
                  </div>
                  <p className="text-sm font-medium text-text line-clamp-2">{resource.title}</p>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{resource.description}</p>
                  {resource.duration && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {resource.duration}
                    </div>
                  )}
                  {resource.location && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {resource.location}
                    </div>
                  )}
                </div>
                {resource.type === 'video' && (
                  <div className="w-14 h-14 rounded-xl bg-surface-solid flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                )}
                {resource.type === 'lettre' && (
                  <div className="w-10 h-10 rounded-xl bg-surface-solid flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
