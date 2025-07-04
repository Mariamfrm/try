import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const niveau = searchParams.get("niveau")

    let query = supabase.from("filiere").select("*")

    // Filtrage par recherche
    if (search) {
      query = query.ilike("nom_filiere", `%${search}%`)
    }

    // Filtrage par niveau
    if (niveau && niveau !== "all") {
      query = query.eq("niveau", niveau)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: filieres, error, count } = await query.range(from, to).order("id")

    if (error) {
      throw error
    }

    return NextResponse.json({
      data: filieres || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Erreur lors du chargement des filières:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom_filiere, niveau } = body

    const { data: filiere, error } = await supabase.from("filiere").insert({ nom_filiere, niveau }).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json(filiere)
  } catch (error) {
    console.error("Erreur lors de la création de la filière:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
