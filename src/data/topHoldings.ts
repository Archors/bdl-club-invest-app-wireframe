export interface Holding {
  name: string
  country: string   // ISO alpha-2 pour le drapeau emoji
  sector: string
  weight: number    // % du portefeuille total
  perf1y: number    // performance 1 an en %
}

export const topHoldings: Holding[] = [
  { name: 'Vinci',           country: 'FR', sector: 'Infrastructures', weight: 4.8, perf1y: 12.3  },
  { name: 'Saint-Gobain',    country: 'FR', sector: 'Matériaux',       weight: 4.2, perf1y: 18.7  },
  { name: 'ASML',            country: 'NL', sector: 'Technologie',     weight: 3.9, perf1y: -8.4  },
  { name: 'Hermès',          country: 'FR', sector: 'Luxe',            weight: 3.6, perf1y: 5.1   },
  { name: 'Novo Nordisk',    country: 'DK', sector: 'Santé',           weight: 3.2, perf1y: -22.1 },
  { name: 'Wolters Kluwer',  country: 'NL', sector: 'Technologie',     weight: 2.9, perf1y: 14.6  },
  { name: 'Reckitt',         country: 'GB', sector: 'Consommation',    weight: 2.7, perf1y: -3.8  },
  { name: 'Symrise',         country: 'DE', sector: 'Chimie',          weight: 2.5, perf1y: 9.2   },
]

const flagEmoji: Record<string, string> = {
  FR: '🇫🇷', NL: '🇳🇱', DE: '🇩🇪', GB: '🇬🇧',
  CH: '🇨🇭', SE: '🇸🇪', DK: '🇩🇰', BE: '🇧🇪',
}

export function getFlag(country: string): string {
  return flagEmoji[country] ?? '🌍'
}
