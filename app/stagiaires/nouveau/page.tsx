"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Filiere {
  id: number
  nom: string
  niveau: string
}

export default function NouveauStagiairePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    civilite: "F",
    idFiliere: "",
    photo: null as File | null,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    // Charger les filières
    setFilieres([
      { id: 1, nom: "Développement Web", niveau: "Technicien Spécialisé" },
      { id: 2, nom: "Réseaux Informatiques", niveau: "Technicien" },
      { id: 3, nom: "Cybersécurité", niveau: "Technicien Spécialisé" },
      { id: 4, nom: "Data Science", niveau: "Technicien Spécialisé" },
    ])
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Simulation de l'ajout du stagiaire
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage("Stagiaire ajouté avec succès!")
      setTimeout(() => {
        router.push("/stagiaires")
      }, 2000)
    } catch (err) {
      setError("Erreur lors de l'ajout du stagiaire")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, photo: file })
  }

  if (!user || user.role !== "ADMIN") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Button asChild variant="outline" className="mb-4 bg-transparent">
              <Link href="/stagiaires">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau stagiaire</h1>
            <p className="mt-2 text-gray-600">Ajoutez un nouveau stagiaire au système</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations du stagiaire</CardTitle>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Civilité *</Label>
                      <RadioGroup
                        value={formData.civilite}
                        onValueChange={(value) => setFormData({ ...formData, civilite: value })}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="F" id="feminin" />
                          <Label htmlFor="feminin">Féminin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="M" id="masculin" />
                          <Label htmlFor="masculin">Masculin</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="filiere">Filière *</Label>
                      <Select
                        value={formData.idFiliere}
                        onValueChange={(value) => setFormData({ ...formData, idFiliere: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une filière" />
                        </SelectTrigger>
                        <SelectContent>
                          {filieres.map((filiere) => (
                            <SelectItem key={filiere.id} value={filiere.id.toString()}>
                              {filiere.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photo">Photo</Label>
                      <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
                      <p className="text-sm text-gray-500">
                        Si vous ne téléchargez pas de photo, une image par défaut sera attribuée en fonction du genre.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/stagiaires">Annuler</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
