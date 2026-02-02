import { IContractsService } from '../interfaces/IContractsService'
import { Contract, Position, Transaction, Allocation } from '@/domain/types'
import {
  mockContracts,
  getContractById,
  getContractsByUserId,
} from '@/data/contracts'
import {
  mockPositions,
  getPositionsByContractId,
  calculateAllocations,
} from '@/data/positions'
import { getAllTransactions, getTransactionsByContractId } from '@/data/transactions'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const contractsService: IContractsService = {
  async getContracts(userId: string): Promise<Contract[]> {
    await delay(200)
    return getContractsByUserId(userId)
  },

  async getContractById(id: string): Promise<Contract | null> {
    await delay(150)
    return getContractById(id) || null
  },

  async getPositions(contractId: string): Promise<Position[]> {
    await delay(200)
    return getPositionsByContractId(contractId)
  },

  async getAllPositions(userId: string): Promise<Position[]> {
    await delay(200)
    const contracts = getContractsByUserId(userId)
    const contractIds = contracts.map((c) => c.id)
    return mockPositions.filter((p) => contractIds.includes(p.contractId))
  },

  async getAllocations(userId: string): Promise<Allocation[]> {
    await delay(200)
    const positions = await this.getAllPositions(userId)
    return calculateAllocations(positions)
  },

  async getTransactions(contractId?: string): Promise<Transaction[]> {
    await delay(200)
    if (contractId) {
      return getTransactionsByContractId(contractId)
    }
    return getAllTransactions()
  },
}
