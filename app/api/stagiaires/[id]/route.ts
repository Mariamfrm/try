import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: stagiaire, error } = await supabase
      .from("stagiaire")
      .select(`
        *,
        filiere:id_filiere (
          id,
          nom_filiere,
          niveau
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(stagiaire)
  } catch (error) {
    console.error("Erreur lors du chargement du stagiaire:", error)
    return NextResponse.json({ error: "Stagiaire non trouvé" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { nom, prenom, civilite, id_filiere, photo } = body

    const updateData: any = { nom, prenom, civilite, id_filiere }
    if (photo) {
      updateData.photo = photo
    }

    const { data: stagiaire, error } = await supabase
      .from("stagiaire")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(stagiaire)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stagiaire:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("stagiaire").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Stagiaire supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du stagiaire:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
