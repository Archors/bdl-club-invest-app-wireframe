export type AssetClass = 'actions' | 'obligations' | 'immobilier' | 'monetaire' | 'diversifie'

export interface Position {
  id: string
  contractId: string
  isin: string
  label: string
  assetClass: AssetClass
  quantity: number
  unitValue: number
  totalValue: number
  acquisitionValue: number
  performancePercent: number
  performanceAmount: number
  weight: number
  lastPriceAt: string
}

export interface Allocation {
  assetClass: AssetClass
  label: string
  value: number
  weight: number
  color: string
}
