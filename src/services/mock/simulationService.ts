import { ISimulationService } from '../interfaces/ISimulationService'
import { SimulationParams, SimulationResult, SavedSimulation } from '@/domain/types'
import { calculateSimulation } from '@/domain/utils/calculations'
import { mockSimulations, getSavedSimulations } from '@/data/simulations'

const SIMULATIONS_KEY = 'bdl_simulations'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getStoredSimulations(): SavedSimulation[] {
  if (typeof window === 'undefined') return mockSimulations
  const stored = localStorage.getItem(SIMULATIONS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return mockSimulations
}

function setStoredSimulations(simulations: SavedSimulation[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(simulations))
  }
}

export const simulationService: ISimulationService = {
  calculate(params: SimulationParams): SimulationResult {
    return calculateSimulation(params)
  },

  async save(simulation: SimulationResult, userId: string, label: string): Promise<SavedSimulation> {
    await delay(300)

    const saved: SavedSimulation = {
      ...simulation,
      userId,
      label,
      savedAt: new Date().toISOString(),
    }

    const all = getStoredSimulations()
    all.unshift(saved)
    setStoredSimulations(all)

    return saved
  },

  async getSaved(userId: string): Promise<SavedSimulation[]> {
    await delay(200)
    const all = getStoredSimulations()
    return all.filter((s) => s.userId === userId)
  },

  async delete(simulationId: string): Promise<void> {
    await delay(200)
    const all = getStoredSimulations()
    const filtered = all.filter((s) => s.id !== simulationId)
    setStoredSimulations(filtered)
  },
}
