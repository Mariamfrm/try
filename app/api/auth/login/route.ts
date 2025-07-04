import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createHash } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    // Hacher le mot de passe avec MD5 pour correspondre au système PHP
    const hashedPassword = createHash("md5").update(password).digest("hex")

    // Rechercher l'utilisateur dans Supabase
    const { data: user, error } = await supabase
      .from("utilisateur")
      .select("*")
      .eq("login", login)
      .eq("pwd", hashedPassword)
      .eq("etat", true)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 })
    }

    // Retourner les données utilisateur sans le mot de passe
    const { pwd, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
