'use client'

import { useState, useEffect } from 'react'
import { Contract, Position, Transaction, Allocation } from '@/domain/types'
import { contractsService } from '@/services'
import { useAuth } from './useAuth'

export function useContracts() {
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setContracts([])
      setLoading(false)
      return
    }

    setLoading(true)
    contractsService
      .getContracts(user.id)
      .then(setContracts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const totalValue = contracts.reduce((sum, c) => sum + c.currentValue, 0)
  const totalDeposits = contracts.reduce((sum, c) => sum + c.totalDeposits, 0)
  const totalPerformance = totalValue - totalDeposits
  const totalPerformancePercent = totalDeposits > 0 ? (totalPerformance / totalDeposits) * 100 : 0

  return {
    contracts,
    loading,
    error,
    totalValue,
    totalDeposits,
    totalPerformance,
    totalPerformancePercent,
  }
}

export function useContract(contractId: string) {
  const [contract, setContract] = useState<Contract | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contractId) return

    setLoading(true)
    Promise.all([
      contractsService.getContractById(contractId),
      contractsService.getPositions(contractId),
      contractsService.getTransactions(contractId),
    ])
      .then(([c, p, t]) => {
        setContract(c)
        setPositions(p)
        setTransactions(t)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [contractId])

  return { contract, positions, transactions, loading, error }
}

export function useAllocations() {
  const { user } = useAuth()
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAllocations([])
      setLoading(false)
      return
    }

    contractsService
      .getAllocations(user.id)
      .then(setAllocations)
      .finally(() => setLoading(false))
  }, [user])

  return { allocations, loading }
}

export function useTransactions(contractId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    contractsService
      .getTransactions(contractId)
      .then(setTransactions)
      .finally(() => setLoading(false))
  }, [contractId])

  return { transactions, loading }
}
