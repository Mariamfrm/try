import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createHash } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role")
    const etat = searchParams.get("etat")

    let query = supabase.from("utilisateur").select("*")

    // Filtrage par recherche
    if (search) {
      query = query.ilike("login", `%${search}%`)
    }

    // Filtrage par rôle
    if (role && role !== "all") {
      query = query.eq("role", role)
    }

    // Filtrage par état
    if (etat && etat !== "all") {
      query = query.eq("etat", etat === "true")
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: utilisateurs, error, count } = await query.range(from, to).order("id")

    if (error) {
      throw error
    }

    // Retirer les mots de passe des résultats
    const utilisateursSansMotDePasse = utilisateurs?.map(({ pwd, ...user }) => user) || []

    return NextResponse.json({
      data: utilisateursSansMotDePasse,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { login, email, password, role, avatar } = body

    // Vérifier si le login existe déjà
    const { data: existingUser } = await supabase.from("utilisateur").select("id").eq("login", login).single()

    if (existingUser) {
      return NextResponse.json({ error: "Ce login existe déjà" }, { status: 400 })
    }

    // Hacher le mot de passe avec MD5
    const hashedPassword = createHash("md5").update(password).digest("hex")

    const { data: utilisateur, error } = await supabase
      .from("utilisateur")
      .insert({
        login,
        email,
        pwd: hashedPassword,
        role,
        avatar: avatar || `img${Math.floor(Math.random() * 8) + 1}.jpg`,
        etat: true,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Retirer le mot de passe du résultat
    const { pwd, ...utilisateurSansMotDePasse } = utilisateur
    return NextResponse.json(utilisateurSansMotDePasse)
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
