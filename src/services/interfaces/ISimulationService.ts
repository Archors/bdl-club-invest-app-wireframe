import { SimulationParams, SimulationResult, SavedSimulation } from '@/domain/types'

export interface ISimulationService {
  calculate(params: SimulationParams): SimulationResult
  save(simulation: SimulationResult, userId: string, label: string): Promise<SavedSimulation>
  getSaved(userId: string): Promise<SavedSimulation[]>
  delete(simulationId: string): Promise<void>
}
