import {
  SimulationParams,
  SimulationResult,
  SimulationYear,
  RISK_RETURNS,
} from '../types/simulation'
import { Allocation, AssetClass, Position } from '../types/position'

export function calculateSimulation(params: SimulationParams): SimulationResult {
  const { initialAmount, monthlyAmount, horizonYears, riskProfile, scenario } = params
  const annualReturn = RISK_RETURNS[riskProfile][scenario]
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1

  const yearByYear: SimulationYear[] = []
  let totalValue = initialAmount
  let cumulativeDeposits = initialAmount
  let cumulativeGains = 0

  for (let year = 1; year <= horizonYears; year++) {
    const startValue = totalValue
    let yearDeposits = 0

    for (let month = 1; month <= 12; month++) {
      totalValue += monthlyAmount
      yearDeposits += monthlyAmount
      totalValue *= 1 + monthlyReturn
    }

    cumulativeDeposits += yearDeposits
    const yearGains = totalValue - startValue - yearDeposits
    cumulativeGains = totalValue - cumulativeDeposits

    yearByYear.push({
      year,
      deposits: yearDeposits,
      cumulativeDeposits,
      gains: yearGains,
      cumulativeGains,
      totalValue,
    })
  }

  return {
    id: crypto.randomUUID(),
    params,
    finalValue: totalValue,
    totalDeposits: cumulativeDeposits,
    totalGains: cumulativeGains,
    annualizedReturn: annualReturn * 100,
    yearByYear,
    createdAt: new Date().toISOString(),
  }
}

export function calculateAllocations(positions: Position[]): Allocation[] {
  const totalValue = positions.reduce((sum, p) => sum + p.totalValue, 0)

  const byClass = positions.reduce((acc, p) => {
    if (!acc[p.assetClass]) {
      acc[p.assetClass] = 0
    }
    acc[p.assetClass] += p.totalValue
    return acc
  }, {} as Record<AssetClass, number>)

  const colors: Record<AssetClass, string> = {
    actions: '#3182ce',
    obligations: '#38a169',
    immobilier: '#dd6b20',
    monetaire: '#805ad5',
    diversifie: '#718096',
  }

  const labels: Record<AssetClass, string> = {
    actions: 'Actions',
    obligations: 'Obligations',
    immobilier: 'Immobilier',
    monetaire: 'Monétaire',
    diversifie: 'Diversifié',
  }

  return Object.entries(byClass).map(([assetClass, value]) => ({
    assetClass: assetClass as AssetClass,
    label: labels[assetClass as AssetClass],
    value,
    weight: totalValue > 0 ? (value / totalValue) * 100 : 0,
    color: colors[assetClass as AssetClass],
  }))
}

export function calculatePerformance(
  currentValue: number,
  totalDeposits: number
): { amount: number; percent: number } {
  const amount = currentValue - totalDeposits
  const percent = totalDeposits > 0 ? (amount / totalDeposits) * 100 : 0
  return { amount, percent }
}
