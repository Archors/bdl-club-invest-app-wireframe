'use client'

import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { geoAllocation } from '@/data/geoAllocation'
import { topHoldings } from '@/data/topHoldings'
import { prismicClient } from '@/lib/prismic'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const isoToNumeric: Record<string, string> = {
  FRA: '250', DEU: '276', NLD: '528', CHE: '756', GBR: '826',
  SWE: '752', ESP: '724', ITA: '380', DNK: '208', BEL: '056',
  FIN: '246', NOR: '578', IRL: '372', AUT: '040', PRT: '620',
}

const numericSet = new Set(Object.values(isoToNumeric))
const weightByNumeric: Record<string, number> = {}
geoAllocation.forEach(({ iso, weight }) => {
  const num = isoToNumeric[iso]
  if (num) weightByNumeric[num] = weight
})

const maxWeight = Math.max(...geoAllocation.map(d => d.weight))

function getColor(numericId: string): string {
  const w = weightByNumeric[numericId]
  if (!w) return '#E8E4DF'
  const intensity = w / maxWeight
  const r = Math.round(197 - intensity * (197 - 11))
  const g = Math.round(217 - intensity * (217 - 3))
  const b = Math.round(245 - intensity * (245 - 77))
  return `rgb(${r},${g},${b})`
}

const LOGO_COLORS = ['#0B034D', '#2E17D0', '#6C5AED', '#0E8B5D', '#A77958', '#C2002E']

// Icônes SVG par secteur
const SECTOR_ICONS: Record<string, React.ReactNode> = {
  'Infrastructures': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21h18M3 7v14M21 7v14M6 7V4l6-2 6 2v3M9 21v-4h6v4M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/></svg>
  ),
  'Matériaux': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-5h6v5"/></svg>
  ),
  'Technologie': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
  ),
  'Luxe': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  'Santé': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  'Consommation': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
  ),
  'Chimie': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 3h6M10 3v7.4a4 4 0 01-.68 2.24L4 20h16l-5.32-7.36A4 4 0 0114 10.4V3"/></svg>
  ),
  'Énergie': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  'Finance': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  ),
  'Industrie': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 20V8l5 4V8l5 4V4l10 8v8H2z"/></svg>
  ),
}

const SECTOR_COLORS = ['#0B034D', '#2E17D0', '#6C5AED', '#0E8B5D', '#A77958', '#C2002E', '#D97706', '#0891B2']

interface IndustryData {
  name: string
  weight: number
}

// Calcul fallback depuis les holdings
function computeIndustriesFromHoldings(): IndustryData[] {
  const sectorMap: Record<string, number> = {}
  topHoldings.forEach(h => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.weight
  })
  return Object.entries(sectorMap)
    .map(([name, weight]) => ({ name, weight: Math.round(weight * 10) / 10 }))
    .sort((a, b) => b.weight - a.weight)
}

function LogoImage({ name, domain }: { name: string; domain: string }) {
  const [src, setSrc] = useState(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`)
  const [failed, setFailed] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const bg = LOGO_COLORS[name.charCodeAt(0) % LOGO_COLORS.length]

  if (failed) {
    return (
      <div
        className="w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold"
        style={{ background: bg }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      width={28}
      height={28}
      className="object-contain"
      onError={() => {
        if (src.includes('clearbit')) {
          setSrc(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}

function CompanyLogo({ name, domain }: { name: string; domain: string }) {
  const [src, setSrc] = useState(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`)
  const [failed, setFailed] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const bg = LOGO_COLORS[name.charCodeAt(0) % LOGO_COLORS.length]

  if (failed) {
    return (
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
        style={{ background: bg }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden shrink-0">
      <img
        src={src}
        alt={name}
        width={28}
        height={28}
        className="object-contain p-0.5"
        onError={() => {
          if (src.includes('clearbit')) {
            setSrc(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`)
          } else {
            setFailed(true)
          }
        }}
      />
    </div>
  )
}

function Industries() {
  const [industries, setIndustries] = useState<IndustryData[]>(computeIndustriesFromHoldings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    prismicClient
      .getAllByType('industry')
      .then(docs => {
        if (cancelled || docs.length === 0) return
        const mapped: IndustryData[] = docs
          .map(doc => ({
            name: (doc.data.name as string) || '',
            weight: (doc.data.weight as number) || 0,
          }))
          .filter(d => d.name && d.weight > 0)
          .sort((a, b) => b.weight - a.weight)
        if (mapped.length > 0) setIndustries(mapped)
      })
      .catch(() => { /* fallback to computed data */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const maxWeight = Math.max(...industries.map(i => i.weight))

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-baseline justify-between px-4 pt-4 pb-3">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Industries</p>
        <p className="text-[10px] text-text-subtle">Au 19 fév. 2025</p>
      </div>
      <div className="px-3 pb-3 space-y-1">
        {industries.map((ind, index) => {
          const icon = SECTOR_ICONS[ind.name] ?? SECTOR_ICONS['Industrie']
          const color = SECTOR_COLORS[index % SECTOR_COLORS.length]
          const barWidth = (ind.weight / maxWeight) * 100

          return (
            <div key={ind.name} className="flex items-center gap-2 py-1.5">
              {/* Icône */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}14`, color }}
              >
                {icon}
              </div>

              {/* Nom + barre */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <span
                    className="text-xs font-medium truncate"
                    style={{ fontFamily: 'Trirong, serif', color: '#3B3663' }}
                  >
                    {ind.name}
                  </span>
                  <span className="text-[11px] font-semibold ml-2 shrink-0" style={{ color }}>
                    {ind.weight.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function GeoMap() {
  const [tooltip, setTooltip] = useState<{ name: string; weight: number } | null>(null)

  return (
    <div className="space-y-3">
      {/* Carte géographique */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-baseline justify-between px-4 pt-4 pb-2">
          <p className="text-[11px] text-text-muted uppercase tracking-wide font-semibold">Répartition géographique</p>
          <p className="text-[10px] text-text-subtle">Au 19 fév. 2025</p>
        </div>
        <div className="relative h-64 w-full" style={{ touchAction: 'none', pointerEvents: 'none' }}>
          <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{ rotate: [-10, -50, 0], scale: 520 }}
            width={400}
            height={320}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup zoom={1} center={[10, 52]} minZoom={1} maxZoom={1}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => {
                      const id = geo.id
                      return numericSet.has(id) || [
                        '616','203','348','703','642','100','300','191','070','705','499',
                        '440','428','233','756','040','528','056','372','208','246','578','752','724','620','380','276','826','250'
                      ].includes(id)
                    })
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(geo.id)}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover:   { outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          {tooltip && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap">
              {tooltip.name} · {tooltip.weight.toFixed(1)} %
            </div>
          )}
        </div>
      </div>

      {/* Top positions */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-baseline justify-between px-4 pt-4 pb-3">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Top positions</p>
          <p className="text-[10px] text-text-subtle">Au 19 fév. 2025</p>
        </div>
        <div>
          {topHoldings.slice(0, 5).map((h, index) => (
            <div
              key={h.name}
              className="flex items-center justify-between px-3 py-2 last:border-b-0"
              style={{ borderBottom: '1px solid #CFD3E2' }}
            >
              {/* Gauche : numéro + nom */}
              <div className="flex items-center gap-2">
                <span
                  className="leading-none"
                  style={{ fontFamily: 'Trirong, serif', fontWeight: 500, fontSize: 14, color: '#A77958' }}
                >
                  {index + 1}
                </span>
                <span
                  className="uppercase"
                  style={{ fontFamily: 'Trirong, serif', fontWeight: 500, fontSize: 12, color: '#3B3663' }}
                >
                  {h.name}
                </span>
              </div>

              {/* Droite : logo dans une box secondary-100 */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 64, height: 30, borderRadius: 8, backgroundColor: '#F4EFEB' }}
              >
                <LogoImage name={h.name} domain={h.domain} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industries */}
      <Industries />
    </div>
  )
}
