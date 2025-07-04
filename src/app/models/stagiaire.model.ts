export interface Stagiaire {
  id: number
  nom: string
  prenom: string
  civilite: "M" | "F"
  photo?: string
  id_filiere: number
  filiere?: Filiere
  created_at?: string
}

export interface Filiere {
  id: number
  nom_filiere: string
  niveau: string
  created_at?: string
}

export interface StagiaireRequest {
  nom: string
  prenom: string
  civilite: "M" | "F"
  id_filiere: number
  photo?: string
}
