export type ScenarioType = 'pessimiste' | 'moyen' | 'optimiste'
export type RiskProfileType = 'tempere' | 'audacieux'

export interface SimulationParams {
  initialAmount: number
  monthlyAmount: number
  horizonYears: number
  riskProfile: RiskProfileType
  scenario: ScenarioType
}

export interface SimulationYear {
  year: number
  deposits: number
  cumulativeDeposits: number
  gains: number
  cumulativeGains: number
  totalValue: number
}

export interface SimulationResult {
  id: string
  params: SimulationParams
  finalValue: number
  totalDeposits: number
  totalGains: number
  annualizedReturn: number
  yearByYear: SimulationYear[]
  createdAt: string
  savedAt?: string
  userId?: string
  label?: string
}

export interface SavedSimulation extends SimulationResult {
  userId: string
  savedAt: string
  label: string
}

// Rendements annuels par profil et scénario
// Tempéré: 5% moyen, risque 3/7
// Audacieux: 8% moyen, risque 5/7
export const RISK_RETURNS: Record<RiskProfileType, Record<ScenarioType, number>> = {
  tempere: { pessimiste: 0.02, moyen: 0.05, optimiste: 0.07 },
  audacieux: { pessimiste: 0.04, moyen: 0.08, optimiste: 0.12 },
}
