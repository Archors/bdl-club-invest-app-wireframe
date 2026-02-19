'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { geoAllocation } from '@/data/geoAllocation'
import { topHoldings, getFlag } from '@/data/topHoldings'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Correspondance ISO-3166-1 alpha-3 → numeric (utilisé par world-atlas)
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
  // Interpoler de #C5D9F5 (léger) à #0B034D (fort)
  const r = Math.round(197 - intensity * (197 - 11))
  const g = Math.round(217 - intensity * (217 - 3))
  const b = Math.round(245 - intensity * (245 - 77))
  return `rgb(${r},${g},${b})`
}

export function GeoMap() {
  const [tooltip, setTooltip] = useState<{ name: string; weight: number } | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] text-text-muted uppercase tracking-wide font-semibold">Répartition géographique</p>
      </div>

      {/* Carte */}
      <div className="relative h-64 w-full">
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
                    // Garder uniquement l'Europe + pays investis
                    const id = geo.id
                    return numericSet.has(id) || [
                      '616','203','348','703','642','100','300','191','070','705','499',
                      '440','428','233','756','040','528','056','372','208','246','578','752','724','620','380','276','826','250'
                    ].includes(id)
                  })
                  .map(geo => {
                    const isInvested = weightByNumeric[geo.id] !== undefined
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getColor(geo.id)}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover:   { outline: 'none', fill: isInvested ? '#6C5AED' : '#D4CFC9', cursor: isInvested ? 'pointer' : 'default' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => {
                          if (isInvested) {
                            const entry = geoAllocation.find(d => isoToNumeric[d.iso] === geo.id)
                            if (entry) setTooltip({ name: entry.name, weight: entry.weight })
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onTouchStart={() => {
                          if (isInvested) {
                            const entry = geoAllocation.find(d => isoToNumeric[d.iso] === geo.id)
                            if (entry) setTooltip({ name: entry.name, weight: entry.weight })
                          }
                        }}
                      />
                    )
                  })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip flottant */}
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
              <span className="text-lg leading-none">{getFlag(h.country)}</span>
              <p className="text-sm font-semibold text-text">{h.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
