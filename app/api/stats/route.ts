import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Compter les stagiaires
    const { count: stagiairesCount } = await supabase.from("stagiaire").select("*", { count: "exact", head: true })

    // Compter les filières
    const { count: filieresCount } = await supabase.from("filiere").select("*", { count: "exact", head: true })

    // Compter les utilisateurs
    const { count: utilisateursCount } = await supabase.from("utilisateur").select("*", { count: "exact", head: true })

    return NextResponse.json({
      stagiaires: stagiairesCount || 0,
      filieres: filieresCount || 0,
      utilisateurs: utilisateursCount || 0,
    })
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
