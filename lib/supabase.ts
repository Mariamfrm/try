import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types pour TypeScript
export interface Filiere {
  id: number
  nom_filiere: string
  niveau: string
  created_at?: string
}

export interface Stagiaire {
  id: number
  nom: string
  prenom: string
  civilite: "M" | "F"
  photo?: string
  id_filiere: number
  created_at?: string
  filiere?: Filiere
}

export interface Utilisateur {
  id: number
  login: string
  email: string
  pwd: string
  role: "ADMIN" | "VISITEUR"
  etat: boolean
  avatar?: string
  created_at?: string
}
