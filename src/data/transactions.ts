import { Transaction } from '@/domain/types'

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    contractId: 'contract-1',
    type: 'deposit',
    status: 'completed',
    amount: 2000,
    date: '2024-12-01T10:00:00Z',
    executedAt: '2024-12-01T10:00:00Z',
    label: 'Versement programmé',
    details: 'Prélèvement automatique',
  },
  {
    id: 'tx-2',
    contractId: 'contract-1',
    type: 'fee',
    status: 'completed',
    amount: -45.50,
    date: '2024-11-30T00:00:00Z',
    executedAt: '2024-11-30T00:00:00Z',
    label: 'Frais de gestion',
    details: 'Frais trimestriels Q4 2024',
  },
  {
    id: 'tx-3',
    contractId: 'contract-2',
    type: 'deposit',
    status: 'completed',
    amount: 500,
    date: '2024-12-01T10:00:00Z',
    executedAt: '2024-12-01T10:00:00Z',
    label: 'Versement programmé',
  },
  {
    id: 'tx-4',
    contractId: 'contract-1',
    type: 'rebalance',
    status: 'completed',
    amount: 0,
    date: '2024-11-15T14:30:00Z',
    executedAt: '2024-11-15T16:00:00Z',
    label: 'Arbitrage',
    details: 'De Fonds Euro vers BDL Convictions',
  },
  {
    id: 'tx-5',
    contractId: 'contract-1',
    type: 'deposit',
    status: 'completed',
    amount: 2000,
    date: '2024-11-01T10:00:00Z',
    executedAt: '2024-11-01T10:00:00Z',
    label: 'Versement programmé',
  },
  {
    id: 'tx-6',
    contractId: 'contract-1',
    type: 'dividend',
    status: 'completed',
    amount: 156.78,
    date: '2024-10-15T00:00:00Z',
    executedAt: '2024-10-15T00:00:00Z',
    label: 'Dividendes',
    details: 'Distribution SCPI Immo Plus',
  },
  {
    id: 'tx-7',
    contractId: 'contract-3',
    type: 'deposit',
    status: 'pending',
    amount: 500,
    date: '2024-12-15T00:00:00Z',
    label: 'Versement en attente',
    details: 'Virement reçu, en cours de traitement',
  },
  {
    id: 'tx-8',
    contractId: 'contract-2',
    type: 'deposit',
    status: 'completed',
    amount: 500,
    date: '2024-11-01T10:00:00Z',
    executedAt: '2024-11-01T10:00:00Z',
    label: 'Versement programmé',
  },
  {
    id: 'tx-9',
    contractId: 'contract-1',
    type: 'deposit',
    status: 'completed',
    amount: 2000,
    date: '2024-10-01T10:00:00Z',
    executedAt: '2024-10-01T10:00:00Z',
    label: 'Versement programmé',
  },
  {
    id: 'tx-10',
    contractId: 'contract-1',
    type: 'deposit',
    status: 'completed',
    amount: 50000,
    date: '2021-03-15T10:00:00Z',
    executedAt: '2021-03-15T10:00:00Z',
    label: 'Versement initial',
    details: 'Ouverture du contrat',
  },
]

export function getTransactionsByContractId(contractId: string): Transaction[] {
  return mockTransactions
    .filter((t) => t.contractId === contractId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTransactions(): Transaction[] {
  return mockTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getRecentTransactions(limit = 5): Transaction[] {
  return getAllTransactions().slice(0, limit)
}
