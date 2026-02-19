// Répartition géographique simulée basée sur les fonds BDL (focus Europe)
export interface CountryAllocation {
  iso: string   // ISO-3166-1 alpha-3 pour react-simple-maps
  name: string
  weight: number // % du portefeuille total
}

export const geoAllocation: CountryAllocation[] = [
  { iso: 'FRA', name: 'France',       weight: 28.4 },
  { iso: 'DEU', name: 'Allemagne',    weight: 14.2 },
  { iso: 'NLD', name: 'Pays-Bas',     weight: 9.8  },
  { iso: 'CHE', name: 'Suisse',       weight: 8.5  },
  { iso: 'GBR', name: 'Royaume-Uni',  weight: 7.6  },
  { iso: 'SWE', name: 'Suède',        weight: 5.9  },
  { iso: 'ESP', name: 'Espagne',      weight: 5.2  },
  { iso: 'ITA', name: 'Italie',       weight: 4.8  },
  { iso: 'DNK', name: 'Danemark',     weight: 3.7  },
  { iso: 'BEL', name: 'Belgique',     weight: 3.1  },
  { iso: 'FIN', name: 'Finlande',     weight: 2.4  },
  { iso: 'NOR', name: 'Norvège',      weight: 2.1  },
  { iso: 'IRL', name: 'Irlande',      weight: 1.8  },
  { iso: 'AUT', name: 'Autriche',     weight: 1.3  },
  { iso: 'PRT', name: 'Portugal',     weight: 1.2  },
]
