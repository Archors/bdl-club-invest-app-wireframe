'use client'

import { useState } from 'react'
import { SimulationParams, SimulationResult, SavedSimulation } from '@/domain/types'
import { simulationService } from '@/services'

const defaultParams: SimulationParams = {
  initialAmount: 10000,
  monthlyAmount: 200,
  horizonYears: 10,
  riskProfile: 'tempere',
  scenario: 'moyen',
}

export function useSimulation() {
  const [params, setParams] = useState<SimulationParams>(defaultParams)
  const [result, setResult] = useState<SimulationResult | null>(null)

  const calculate = () => {
    const r = simulationService.calculate(params)
    setResult(r)
    return r
  }

  const updateParams = (updates: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...updates }))
  }

  const reset = () => {
    setParams(defaultParams)
    setResult(null)
  }

  return {
    params,
    result,
    updateParams,
    calculate,
    reset,
  }
}

export function useSavedSimulations(userId: string | undefined) {
  const [simulations, setSimulations] = useState<SavedSimulation[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const saved = await simulationService.getSaved(userId)
      setSimulations(saved)
    } finally {
      setLoading(false)
    }
  }

  const save = async (simulation: SimulationResult, label: string) => {
    if (!userId) throw new Error('Non connecté')
    const saved = await simulationService.save(simulation, userId, label)
    setSimulations((prev) => [saved, ...prev])
    return saved
  }

  const remove = async (id: string) => {
    await simulationService.delete(id)
    setSimulations((prev) => prev.filter((s) => s.id !== id))
  }

  return {
    simulations,
    loading,
    load,
    save,
    remove,
  }
}
