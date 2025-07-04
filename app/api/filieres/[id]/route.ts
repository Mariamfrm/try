import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: filiere, error } = await supabase.from("filiere").select("*").eq("id", params.id).single()

    if (error) {
      throw error
    }

    return NextResponse.json(filiere)
  } catch (error) {
    console.error("Erreur lors du chargement de la filière:", error)
    return NextResponse.json({ error: "Filière non trouvée" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { nom_filiere, niveau } = body

    const { data: filiere, error } = await supabase
      .from("filiere")
      .update({ nom_filiere, niveau })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(filiere)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la filière:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérifier s'il y a des stagiaires dans cette filière
    const { count } = await supabase
      .from("stagiaire")
      .select("*", { count: "exact", head: true })
      .eq("id_filiere", params.id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer cette filière car elle est utilisée par des stagiaires." },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("filiere").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Filière supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de la filière:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
