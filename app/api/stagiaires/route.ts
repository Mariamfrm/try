import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const filiereId = searchParams.get("filiere_id")

    let query = supabase.from("stagiaire").select(`
        *,
        filiere:id_filiere (
          id,
          nom_filiere,
          niveau
        )
      `)

    // Filtrage par recherche
    if (search) {
      query = query.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%`)
    }

    // Filtrage par filière
    if (filiereId && filiereId !== "0") {
      query = query.eq("id_filiere", filiereId)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: stagiaires, error, count } = await query.range(from, to).order("id")

    if (error) {
      throw error
    }

    return NextResponse.json({
      data: stagiaires || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Erreur lors du chargement des stagiaires:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, prenom, civilite, id_filiere, photo } = body

    const { data: stagiaire, error } = await supabase
      .from("stagiaire")
      .insert({
        nom,
        prenom,
        civilite,
        id_filiere,
        photo: photo || `img${Math.floor(Math.random() * 8) + 1}.jpg`,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(stagiaire)
  } catch (error) {
    console.error("Erreur lors de la création du stagiaire:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
