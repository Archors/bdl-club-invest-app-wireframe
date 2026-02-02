export type ContractStatus = 'active' | 'pending' | 'closed'
export type ContractType = 'assurance-vie' | 'per' | 'compte-titres'

export interface Contract {
  id: string
  userId: string
  type: ContractType
  label: string
  status: ContractStatus
  openedAt: string
  closedAt?: string
  initialDeposit: number
  currentValue: number
  totalDeposits: number
  totalWithdrawals: number
  performancePercent: number
  performanceAmount: number
  lastValuationAt: string
}

export interface ContractSummary {
  totalContracts: number
  totalValue: number
  totalPerformancePercent: number
  totalPerformanceAmount: number
}
