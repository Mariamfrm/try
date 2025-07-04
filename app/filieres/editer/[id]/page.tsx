"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface Filiere {
  id: number
  nom: string
  niveau: string
}

export default function EditerFilierePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [filiere, setFiliere] = useState<Filiere | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    niveau: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    // Charger les données de la filière
    const loadFiliere = () => {
      // Données de démonstration
      const filieres = [
        { id: 1, nom: "Développement Web", niveau: "Technicien Spécialisé" },
        { id: 2, nom: "Réseaux Informatiques", niveau: "Technicien" },
        { id: 3, nom: "Cybersécurité", niveau: "Technicien Spécialisé" },
      ]

      const foundFiliere = filieres.find((f) => f.id === Number.parseInt(id))
      if (foundFiliere) {
        setFiliere(foundFiliere)
        setFormData({
          nom: foundFiliere.nom,
          niveau: foundFiliere.niveau,
        })
      } else {
        setError("Filière non trouvée")
      }
    }

    loadFiliere()
  }, [user, router, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Simulation de la mise à jour de la filière
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage("Filière mise à jour avec succès!")
      setTimeout(() => {
        router.push("/filieres")
      }, 2000)
    } catch (err) {
      setError("Erreur lors de la mise à jour de la filière")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "ADMIN") return null

  if (!filiere && !error) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Button asChild variant="outline" className="mb-4 bg-transparent">
              <Link href="/filieres">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Éditer filière</h1>
            <p className="mt-2 text-gray-600">Modifiez les informations de la filière</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations de la filière</CardTitle>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {filiere && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom de la filière *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="niveau">Niveau *</Label>
                      <Select
                        value={formData.niveau}
                        onValueChange={(value) => setFormData({ ...formData, niveau: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Qualification">Qualification</SelectItem>
                          <SelectItem value="Technicien">Technicien</SelectItem>
                          <SelectItem value="Technicien Spécialisé">Technicien Spécialisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/filieres">Annuler</Link>
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
