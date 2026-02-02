import { Contract, Position, Transaction, Allocation } from '@/domain/types'

export interface IContractsService {
  getContracts(userId: string): Promise<Contract[]>
  getContractById(id: string): Promise<Contract | null>
  getPositions(contractId: string): Promise<Position[]>
  getAllPositions(userId: string): Promise<Position[]>
  getAllocations(userId: string): Promise<Allocation[]>
  getTransactions(contractId?: string): Promise<Transaction[]>
}
