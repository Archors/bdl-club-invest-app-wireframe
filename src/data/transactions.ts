import { Transaction } from '@/domain/types'

export const mockTransactions: Transaction[] = [
  // 2023 - Versement initial
  {
    id: 'tx-0',
    contractId: 'contract-1',
    type: 'deposit',
    status: 'completed',
    amount: 50000,
    date: '2023-03-15T10:00:00Z',
    executedAt: '2023-03-15T10:00:00Z',
    label: 'Versement initial',
    details: 'Ouverture du contrat',
  },
  // 2025 - Toute l'année
  { id: 'tx-25-01a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-01-01T10:00:00Z', executedAt: '2025-01-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-01b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-01-01T10:00:00Z', executedAt: '2025-01-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-02a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-02-01T10:00:00Z', executedAt: '2025-02-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-02b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-02-01T10:00:00Z', executedAt: '2025-02-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-03a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-03-01T10:00:00Z', executedAt: '2025-03-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-03b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-03-01T10:00:00Z', executedAt: '2025-03-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-03c', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 5000, date: '2025-03-20T10:00:00Z', executedAt: '2025-03-20T10:00:00Z', label: 'Versement libre' },
  { id: 'tx-25-04a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-04-01T10:00:00Z', executedAt: '2025-04-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-04b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-04-01T10:00:00Z', executedAt: '2025-04-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-05a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-05-01T10:00:00Z', executedAt: '2025-05-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-05b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-05-01T10:00:00Z', executedAt: '2025-05-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-06a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-06-01T10:00:00Z', executedAt: '2025-06-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-06b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-06-01T10:00:00Z', executedAt: '2025-06-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-06c', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 10000, date: '2025-06-15T10:00:00Z', executedAt: '2025-06-15T10:00:00Z', label: 'Versement libre' },
  { id: 'tx-25-07a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-07-01T10:00:00Z', executedAt: '2025-07-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-07b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-07-01T10:00:00Z', executedAt: '2025-07-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-08a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-08-01T10:00:00Z', executedAt: '2025-08-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-08b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-08-01T10:00:00Z', executedAt: '2025-08-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-09a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-09-01T10:00:00Z', executedAt: '2025-09-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-09b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-09-01T10:00:00Z', executedAt: '2025-09-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-10a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-10-01T10:00:00Z', executedAt: '2025-10-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-10b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-10-01T10:00:00Z', executedAt: '2025-10-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-11a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-11-01T10:00:00Z', executedAt: '2025-11-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-11b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-11-01T10:00:00Z', executedAt: '2025-11-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-12a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2025-12-01T10:00:00Z', executedAt: '2025-12-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-25-12b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2025-12-01T10:00:00Z', executedAt: '2025-12-01T10:00:00Z', label: 'Versement programmé' },
  // 2026
  { id: 'tx-26-01a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2026-01-01T10:00:00Z', executedAt: '2026-01-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-26-01b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2026-01-01T10:00:00Z', executedAt: '2026-01-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-26-01c', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 3000, date: '2026-01-22T10:00:00Z', executedAt: '2026-01-22T10:00:00Z', label: 'Versement libre' },
  { id: 'tx-26-02a', contractId: 'contract-1', type: 'deposit', status: 'completed', amount: 2000, date: '2026-02-01T10:00:00Z', executedAt: '2026-02-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-26-02b', contractId: 'contract-2', type: 'deposit', status: 'completed', amount: 500, date: '2026-02-01T10:00:00Z', executedAt: '2026-02-01T10:00:00Z', label: 'Versement programmé' },
  { id: 'tx-26-02c', contractId: 'contract-1', type: 'deposit', status: 'pending', amount: 4000, date: '2026-02-08T10:00:00Z', label: 'Versement libre', details: 'En cours de traitement' },
  // Fees & other types
  { id: 'tx-fee-1', contractId: 'contract-1', type: 'fee', status: 'completed', amount: -45.50, date: '2025-12-31T00:00:00Z', executedAt: '2025-12-31T00:00:00Z', label: 'Frais de gestion', details: 'Frais trimestriels Q4 2025' },
  { id: 'tx-arb-1', contractId: 'contract-1', type: 'rebalance', status: 'completed', amount: 0, date: '2025-11-15T14:30:00Z', executedAt: '2025-11-15T16:00:00Z', label: 'Arbitrage', details: 'De Fonds Euro vers BDL Convictions' },
  { id: 'tx-div-1', contractId: 'contract-1', type: 'dividend', status: 'completed', amount: 156.78, date: '2025-10-15T00:00:00Z', executedAt: '2025-10-15T00:00:00Z', label: 'Dividendes', details: 'Distribution SCPI Immo Plus' },
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
