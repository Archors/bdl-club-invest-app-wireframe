'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { geoAllocation } from '@/data/geoAllocation'
import { topHoldings } from '@/data/topHoldings'

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

function CompanyLogo({ name, domain }: { name: string; domain: string }) {
  const [src, setSrc] = useState(
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`
  )
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
          if (src.includes('gstatic')) {
            // Fallback 2 : DuckDuckGo
            setSrc(`https://icons.duckduckgo.com/ip3/${domain}.ico`)
          } else {
            setFailed(true)
          }
        }}
      />
    </div>
  )
}

export function GeoMap() {
  const [tooltip, setTooltip] = useState<{ name: string; weight: number } | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] text-text-muted uppercase tracking-wide font-semibold">Répartition géographique</p>
      </div>

      {/* Carte — pointer-events none pour bloquer tout interaction */}
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

      {/* Top positions */}
      <div className="border-t border-border">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide px-4 pt-3 pb-1">Top positions</p>
        <div className="divide-y divide-border">
          {topHoldings.slice(0, 5).map((h) => (
            <div key={h.name} className="flex items-center gap-3 px-4 py-3">
              <CompanyLogo name={h.name} domain={h.domain} />
              <p className="text-sm font-semibold text-text">{h.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
