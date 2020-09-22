export interface IArea {
  nom: string
  code: string
  surface?: number
}

// Même format d’entrée et de sortie pour les communes
export interface ICommune extends IArea {
  departement: string
  region: string
}

export interface IForetInput {
  gid: number
  foret: string
  // eslint-disable-next-line camelcase
  code_for: string
  area: number
  perimeter: number
}

export interface IForetOutput extends IArea {
  perimetre: number
}
