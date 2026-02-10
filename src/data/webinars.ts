export interface Webinar {
  id: string
  title: string
  description: string
  date: string
  time: string
  speaker: string
  registered: boolean
}

export const mockWebinars: Webinar[] = [
  {
    id: 'web-1',
    title: 'Point marché T1 2025 : Bilan et perspectives',
    description: 'Notre équipe de gestion revient sur les performances du premier trimestre et partage ses convictions pour la suite.',
    date: '2025-03-15',
    time: '18h30',
    speaker: 'Équipe de gestion BDL',
    registered: false,
  },
  {
    id: 'web-2',
    title: 'Masterclass : Optimiser sa fiscalité avec l\'assurance vie',
    description: 'Comprendre les avantages fiscaux de l\'assurance vie et les stratégies pour optimiser votre patrimoine.',
    date: '2025-04-10',
    time: '12h30',
    speaker: 'Cabinet conseil fiscal',
    registered: false,
  },
  {
    id: 'web-3',
    title: 'Les tendances ESG : investir responsable en 2025',
    description: 'Décryptage des critères environnementaux, sociaux et de gouvernance dans la gestion de portefeuille.',
    date: '2025-05-22',
    time: '18h30',
    speaker: 'Analyste ESG BDL',
    registered: false,
  },
]
