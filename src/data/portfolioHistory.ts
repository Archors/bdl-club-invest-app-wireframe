export interface PortfolioPoint {
  date: string   // ISO date
  value: number  // valeur totale du portefeuille
  invested: number // total investi (sans performance)
}

// Dépôts réels agrégés (tous contrats confondus)
const deposits: { date: string; amount: number }[] = [
  { date: '2021-03-15', amount: 50000 },
  { date: '2022-09-01', amount: 20000 },
  { date: '2023-01-01', amount: 2500 },
  { date: '2023-02-01', amount: 2500 },
  { date: '2023-03-01', amount: 2500 },
  { date: '2023-04-01', amount: 2500 },
  { date: '2023-05-01', amount: 2500 },
  { date: '2023-06-01', amount: 2500 },
  { date: '2023-06-20', amount: 10000 }, // contrat Lucas
  { date: '2023-07-01', amount: 2500 },
  { date: '2023-08-01', amount: 2500 },
  { date: '2023-09-01', amount: 2500 },
  { date: '2023-10-01', amount: 2500 },
  { date: '2023-11-01', amount: 2500 },
  { date: '2023-12-01', amount: 2500 },
  { date: '2024-01-01', amount: 2500 },
  { date: '2024-02-01', amount: 2500 },
  { date: '2024-03-01', amount: 2500 },
  { date: '2024-03-20', amount: 5000 },
  { date: '2024-04-01', amount: 2500 },
  { date: '2024-05-01', amount: 2500 },
  { date: '2024-06-01', amount: 2500 },
  { date: '2024-06-15', amount: 10000 },
  { date: '2024-07-01', amount: 2500 },
  { date: '2024-08-01', amount: 2500 },
  { date: '2024-09-01', amount: 2500 },
  { date: '2024-10-01', amount: 2500 },
  { date: '2024-11-01', amount: 2500 },
  { date: '2024-12-01', amount: 2500 },
  { date: '2025-01-01', amount: 2500 },
  { date: '2025-01-22', amount: 3000 },
  { date: '2025-02-01', amount: 2500 },
]

function generateHistory(): PortfolioPoint[] {
  const start = new Date('2021-03-01')
  const end   = new Date('2026-02-01')
  const points: PortfolioPoint[] = []

  // taux mensuel simulé ~7% annuel + volatilité douce
  const monthlyBase = 0.0057
  const noise = [0, 0.001, -0.002, 0.003, -0.001, 0.002, 0.001, -0.003, 0.004, 0.002, -0.001, 0.003]

  let value = 0
  let invested = 0
  let noiseIdx = 0
  let current = new Date(start)

  while (current <= end) {
    const isoMonth = current.toISOString().slice(0, 7) // "YYYY-MM"

    // Ajouter les dépôts de ce mois
    deposits.forEach(({ date, amount }) => {
      if (date.startsWith(isoMonth)) {
        value += amount
        invested += amount
      }
    })

    // Appliquer la performance mensuelle
    if (value > 0) {
      const rate = monthlyBase + noise[noiseIdx % noise.length]
      value = value * (1 + rate)
      noiseIdx++
    }

    if (value > 0) {
      points.push({
        date: current.toISOString().slice(0, 10),
        value: Math.round(value * 100) / 100,
        invested: Math.round(invested * 100) / 100,
      })
    }

    current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
  }

  return points
}

export const portfolioHistory = generateHistory()
