export interface Holding {
  name: string
  country: string   // ISO alpha-2 pour le drapeau emoji
  domain: string    // domaine pour le logo via Clearbit
  sector: string
  weight: number    // % du portefeuille total
  perf1y: number    // performance 1 an en %
  date: string      // date d'entrée en portefeuille
}

export const topHoldings: Holding[] = [
  { name: 'Vinci',           country: 'FR', domain: 'vinci.com',            sector: 'Infrastructures', weight: 4.8, perf1y: 12.3,  date: '12 jan. 2024' },
  { name: 'Saint-Gobain',    country: 'FR', domain: 'saint-gobain.com',     sector: 'Matériaux',       weight: 4.2, perf1y: 18.7,  date: '03 mars 2024' },
  { name: 'ASML',            country: 'NL', domain: 'asml.com',             sector: 'Technologie',     weight: 3.9, perf1y: -8.4,  date: '18 juin 2023' },
  { name: 'Hermès',          country: 'FR', domain: 'hermes.com',           sector: 'Luxe',            weight: 3.6, perf1y: 5.1,   date: '07 fév. 2023' },
  { name: 'Novo Nordisk',    country: 'DK', domain: 'novonordisk.com',      sector: 'Santé',           weight: 3.2, perf1y: -22.1, date: '22 sept. 2022' },
  { name: 'Wolters Kluwer',  country: 'NL', domain: 'wolterskluwer.com',    sector: 'Technologie',     weight: 2.9, perf1y: 14.6,  date: '15 nov. 2023' },
  { name: 'Reckitt',         country: 'GB', domain: 'reckitt.com',          sector: 'Consommation',    weight: 2.7, perf1y: -3.8,  date: '04 avr. 2024' },
  { name: 'Symrise',         country: 'DE', domain: 'symrise.com',          sector: 'Chimie',          weight: 2.5, perf1y: 9.2,   date: '30 oct. 2023' },
]

const flagEmoji: Record<string, string> = {
  FR: '🇫🇷', NL: '🇳🇱', DE: '🇩🇪', GB: '🇬🇧',
  CH: '🇨🇭', SE: '🇸🇪', DK: '🇩🇰', BE: '🇧🇪',
}

export function getFlag(country: string): string {
  return flagEmoji[country] ?? '🌍'
}
