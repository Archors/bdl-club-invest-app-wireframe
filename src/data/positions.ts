import { Position, Allocation } from '@/domain/types'

export const mockPositions: Position[] = [
  // Contract 1 - Assurance Vie BDL Premium
  {
    id: 'pos-1',
    contractId: 'contract-1',
    isin: 'FR0010315770',
    label: 'BDL Convictions',
    assetClass: 'actions',
    quantity: 120.5,
    unitValue: 245.32,
    totalValue: 29561.06,
    acquisitionValue: 27000,
    performancePercent: 9.49,
    performanceAmount: 2561.06,
    weight: 43.6,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'pos-2',
    contractId: 'contract-1',
    isin: 'FR0010135103',
    label: 'BDL Rempart Europe',
    assetClass: 'actions',
    quantity: 85.2,
    unitValue: 156.78,
    totalValue: 13357.66,
    acquisitionValue: 12000,
    performancePercent: 11.31,
    performanceAmount: 1357.66,
    weight: 19.7,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'pos-3',
    contractId: 'contract-1',
    isin: 'FR0013285004',
    label: 'Fonds Euro Sécurité',
    assetClass: 'monetaire',
    quantity: 1,
    unitValue: 15000,
    totalValue: 15000,
    acquisitionValue: 14500,
    performancePercent: 3.45,
    performanceAmount: 500,
    weight: 22.1,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'pos-4',
    contractId: 'contract-1',
    isin: 'FR0010149120',
    label: 'SCPI Immo Plus',
    assetClass: 'immobilier',
    quantity: 45,
    unitValue: 220.50,
    totalValue: 9922.50,
    acquisitionValue: 9000,
    performancePercent: 10.25,
    performanceAmount: 922.50,
    weight: 14.6,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  // Contract 2 - PER
  {
    id: 'pos-5',
    contractId: 'contract-2',
    isin: 'FR0010315770',
    label: 'BDL Convictions',
    assetClass: 'actions',
    quantity: 35.8,
    unitValue: 245.32,
    totalValue: 8782.46,
    acquisitionValue: 8000,
    performancePercent: 9.78,
    performanceAmount: 782.46,
    weight: 36.1,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'pos-6',
    contractId: 'contract-2',
    isin: 'FR0013285004',
    label: 'Fonds Euro Sécurité',
    assetClass: 'monetaire',
    quantity: 1,
    unitValue: 10000,
    totalValue: 10000,
    acquisitionValue: 9800,
    performancePercent: 2.04,
    performanceAmount: 200,
    weight: 41.1,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'pos-7',
    contractId: 'contract-2',
    isin: 'LU0360863863',
    label: 'Obligations Europe',
    assetClass: 'obligations',
    quantity: 50,
    unitValue: 110.77,
    totalValue: 5538.50,
    acquisitionValue: 5200,
    performancePercent: 6.51,
    performanceAmount: 338.50,
    weight: 22.8,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  // Contract 3 - Enfant
  {
    id: 'pos-8',
    contractId: 'contract-3',
    isin: 'FR0010315770',
    label: 'BDL Convictions',
    assetClass: 'actions',
    quantity: 22.5,
    unitValue: 245.32,
    totalValue: 5519.70,
    acquisitionValue: 5000,
    performancePercent: 10.39,
    performanceAmount: 519.70,
    weight: 50.7,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'pos-9',
    contractId: 'contract-3',
    isin: 'FR0013285004',
    label: 'Fonds Euro Sécurité',
    assetClass: 'monetaire',
    quantity: 1,
    unitValue: 5370.55,
    totalValue: 5370.55,
    acquisitionValue: 5500,
    performancePercent: -2.35,
    performanceAmount: -129.45,
    weight: 49.3,
    lastPriceAt: '2024-12-15T18:00:00Z',
  },
]

export function getPositionsByContractId(contractId: string): Position[] {
  return mockPositions.filter((p) => p.contractId === contractId)
}

export function getAllPositions(): Position[] {
  return mockPositions
}

export function calculateAllocations(positions: Position[]): Allocation[] {
  const totalValue = positions.reduce((sum, p) => sum + p.totalValue, 0)

  const byClass = positions.reduce((acc, p) => {
    if (!acc[p.assetClass]) {
      acc[p.assetClass] = 0
    }
    acc[p.assetClass] += p.totalValue
    return acc
  }, {} as Record<string, number>)

  const colors: Record<string, string> = {
    actions: '#3182ce',
    obligations: '#38a169',
    immobilier: '#dd6b20',
    monetaire: '#805ad5',
    diversifie: '#718096',
  }

  const labels: Record<string, string> = {
    actions: 'Actions',
    obligations: 'Obligations',
    immobilier: 'Immobilier',
    monetaire: 'Monétaire',
    diversifie: 'Diversifié',
  }

  return Object.entries(byClass)
    .map(([assetClass, value]) => ({
      assetClass: assetClass as Position['assetClass'],
      label: labels[assetClass] || assetClass,
      value,
      weight: totalValue > 0 ? (value / totalValue) * 100 : 0,
      color: colors[assetClass] || '#718096',
    }))
    .sort((a, b) => b.value - a.value)
}
