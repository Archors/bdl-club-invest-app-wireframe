export type ResourceType = 'article' | 'video' | 'visite' | 'lettre'

export interface Resource {
  id: string
  type: ResourceType
  title: string
  description: string
  date: string
  duration?: string
  location?: string
}

export const mockResources: Resource[] = [
  // Tribunes
  {
    id: 'art-1',
    type: 'article',
    title: 'Intelligence artificielle : des premiers symptômes à un risque de propagation',
    description: 'Analyse des risques liés à l\'intelligence artificielle et leur potentiel de propagation sur les marchés.',
    date: '2026-01-28',
  },
  {
    id: 'art-2',
    type: 'article',
    title: 'Le Cygne Noir de l\'inflation : La Fed en passe de faire sauter les verrous monétaires ?',
    description: 'Analyse des préoccupations inflationnistes et de la politique monétaire de la Réserve fédérale.',
    date: '2025-12-15',
  },
  {
    id: 'art-3',
    type: 'article',
    title: 'A l\'instar de la SEC, le régulateur européen saura-t-il se remettre en question ?',
    description: 'Réflexion sur l\'évolution de la régulation financière en Europe face aux défis actuels.',
    date: '2025-11-14',
  },
  // Rencontres entreprises / Visites
  {
    id: 'vis-1',
    type: 'visite',
    title: 'Visite de la fab de Soitec',
    description: 'Visite de l\'usine de fabrication de Soitec, leader mondial des matériaux semi-conducteurs innovants.',
    date: '2026-01-12',
    location: 'Bernin',
  },
  {
    id: 'vis-2',
    type: 'visite',
    title: 'Visite du site de Nexans Ampacity à Lyon',
    description: 'Découverte du site de Nexans spécialisé dans les solutions de câbles supraconducteurs.',
    date: '2026-01-08',
    location: 'Lyon',
  },
  {
    id: 'vis-3',
    type: 'visite',
    title: 'Visite de la plus grande usine de SIG Group',
    description: 'Immersion dans la plus grande usine du groupe SIG, spécialiste de l\'emballage alimentaire.',
    date: '2025-12-19',
    location: 'Linnich',
  },
  {
    id: 'vis-4',
    type: 'visite',
    title: 'CMD de Schneider Electric',
    description: 'Capital Markets Day de Schneider Electric, leader mondial de la gestion de l\'énergie.',
    date: '2025-12-16',
    location: 'Rueil-Malmaison',
  },
  {
    id: 'vis-5',
    type: 'visite',
    title: 'CMD de Rheinmetall à Unterlüß',
    description: 'Capital Markets Day du groupe de défense et d\'automobile Rheinmetall.',
    date: '2025-11-20',
    location: 'Unterlüß',
  },
  {
    id: 'vis-6',
    type: 'visite',
    title: 'Visite d\'une blanchisserie Elis',
    description: 'Découverte des opérations d\'Elis, leader de la location-entretien de textile professionnel.',
    date: '2025-11-27',
  },
  {
    id: 'vis-7',
    type: 'visite',
    title: 'Bodycote – Visite du site de Neuilly-en-Thelle',
    description: 'Visite du site de traitement thermique de Bodycote, spécialiste mondial du secteur.',
    date: '2025-11-12',
    location: 'Neuilly-en-Thelle',
  },
  {
    id: 'vis-8',
    type: 'visite',
    title: 'Visite de laboratoires de Food Testing Eurofins à Hambourg',
    description: 'Immersion dans les laboratoires d\'analyse alimentaire du groupe Eurofins Scientific.',
    date: '2025-11-05',
    location: 'Hambourg',
  },
  // Vidéos
  {
    id: 'vid-1',
    type: 'video',
    title: 'Point marché mensuel – Janvier 2026',
    description: 'Retour sur les performances du mois et perspectives pour les semaines à venir.',
    date: '2026-01-31',
    duration: '12 min',
  },
  {
    id: 'vid-2',
    type: 'video',
    title: 'Point marché mensuel – Décembre 2025',
    description: 'Bilan des marchés en fin d\'année et analyse des tendances pour 2026.',
    date: '2025-12-31',
    duration: '14 min',
  },
  {
    id: 'vid-3',
    type: 'video',
    title: 'La stratégie BDL Convictions expliquée',
    description: 'Notre gérant détaille l\'approche d\'investissement du fonds phare BDL Convictions.',
    date: '2025-12-10',
    duration: '18 min',
  },
  // Lettres du Club
  {
    id: 'let-1',
    type: 'lettre',
    title: 'La Lettre du Club – Janvier 2026',
    description: 'Synthèse mensuelle : allocation, performances et actualités du Club.',
    date: '2026-01-31',
  },
  {
    id: 'let-2',
    type: 'lettre',
    title: 'La Lettre du Club – Décembre 2025',
    description: 'Bilan de l\'année 2025 et perspectives pour 2026.',
    date: '2025-12-31',
  },
  {
    id: 'let-3',
    type: 'lettre',
    title: 'La Lettre du Club – Novembre 2025',
    description: 'Focus sur les résultats du troisième trimestre et les visites d\'entreprises.',
    date: '2025-11-30',
  },
]

export function getResourcesByType(type: ResourceType): Resource[] {
  return mockResources
    .filter((r) => r.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
