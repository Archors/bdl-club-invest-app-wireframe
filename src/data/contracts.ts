import { Contract } from '@/domain/types'

export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    userId: 'user-1',
    type: 'assurance-vie',
    label: 'Assurance Vie BDL Premium',
    status: 'active',
    openedAt: '2021-03-15T00:00:00Z',
    initialDeposit: 50000,
    currentValue: 67850.45,
    totalDeposits: 62000,
    totalWithdrawals: 0,
    performancePercent: 9.44,
    performanceAmount: 5850.45,
    lastValuationAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'contract-2',
    userId: 'user-1',
    type: 'per',
    label: 'PER Retraite Plus',
    status: 'active',
    openedAt: '2022-09-01T00:00:00Z',
    initialDeposit: 20000,
    currentValue: 24320.80,
    totalDeposits: 23000,
    totalWithdrawals: 0,
    performancePercent: 5.74,
    performanceAmount: 1320.80,
    lastValuationAt: '2024-12-15T18:00:00Z',
  },
  {
    id: 'contract-3',
    userId: 'user-1',
    type: 'assurance-vie',
    label: 'Contrat Enfant - Lucas',
    status: 'active',
    openedAt: '2023-06-20T00:00:00Z',
    initialDeposit: 10000,
    currentValue: 10890.25,
    totalDeposits: 10500,
    totalWithdrawals: 0,
    performancePercent: 3.72,
    performanceAmount: 390.25,
    lastValuationAt: '2024-12-15T18:00:00Z',
  },
]

export function getContractById(id: string): Contract | undefined {
  return mockContracts.find((c) => c.id === id)
}

export function getContractsByUserId(userId: string): Contract[] {
  return mockContracts.filter((c) => c.userId === userId)
}

export function getTotalValue(contracts: Contract[]): number {
  return contracts.reduce((sum, c) => sum + c.currentValue, 0)
}

export function getTotalPerformance(contracts: Contract[]): { amount: number; percent: number } {
  const totalDeposits = contracts.reduce((sum, c) => sum + c.totalDeposits, 0)
  const totalValue = contracts.reduce((sum, c) => sum + c.currentValue, 0)
  const amount = totalValue - totalDeposits
  const percent = totalDeposits > 0 ? (amount / totalDeposits) * 100 : 0
  return { amount, percent }
}
