import { SavedSimulation } from '@/domain/types'

export const mockSimulations: SavedSimulation[] = [
  {
    id: 'sim-1',
    userId: 'user-1',
    label: 'Projet retraite 20 ans',
    params: {
      initialAmount: 50000,
      monthlyAmount: 500,
      horizonYears: 20,
      riskProfile: 'tempere',
      scenario: 'moyen',
    },
    finalValue: 302456.78,
    totalDeposits: 170000,
    totalGains: 132456.78,
    annualizedReturn: 4.5,
    yearByYear: [],
    createdAt: '2024-10-15T14:30:00Z',
    savedAt: '2024-10-15T14:35:00Z',
  },
  {
    id: 'sim-2',
    userId: 'user-1',
    label: 'Épargne prudente 10 ans',
    params: {
      initialAmount: 30000,
      monthlyAmount: 300,
      horizonYears: 10,
      riskProfile: 'tempere',
      scenario: 'moyen',
    },
    finalValue: 78234.56,
    totalDeposits: 66000,
    totalGains: 12234.56,
    annualizedReturn: 2.5,
    yearByYear: [],
    createdAt: '2024-09-20T10:00:00Z',
    savedAt: '2024-09-20T10:05:00Z',
  },
]

export function getSavedSimulations(userId: string): SavedSimulation[] {
  return mockSimulations
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
}
