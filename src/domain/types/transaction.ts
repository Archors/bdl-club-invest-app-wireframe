export type TransactionType = 'deposit' | 'withdrawal' | 'rebalance' | 'fee' | 'dividend'
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed'

export interface Transaction {
  id: string
  contractId: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  date: string
  executedAt?: string
  label: string
  details?: string
  positionId?: string
}

export interface TransactionFilters {
  type?: TransactionType
  status?: TransactionStatus
  contractId?: string
  dateFrom?: string
  dateTo?: string
}
