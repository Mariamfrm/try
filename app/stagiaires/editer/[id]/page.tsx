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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface Stagiaire {
  id: number
  nom: string
  prenom: string
  civilite: "M" | "F"
  photo?: string
  idFiliere: number
  filiere: string
}

interface Filiere {
  id: number
  nom: string
  niveau: string
}

export default function EditerStagiairePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [stagiaire, setStagiaire] = useState<Stagiaire | null>(null)
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

    // Charger les données du stagiaire et les filières
    const loadData = () => {
      // Données de démonstration
      const stagiaires = [
        { id: 1, nom: "Dupont", prenom: "Marie", civilite: "F" as const, idFiliere: 1, filiere: "Développement Web" },
        {
          id: 2,
          nom: "Martin",
          prenom: "Pierre",
          civilite: "M" as const,
          idFiliere: 2,
          filiere: "Réseaux Informatiques",
        },
      ]

      const foundStagiaire = stagiaires.find((s) => s.id === Number.parseInt(id))
      if (foundStagiaire) {
        setStagiaire(foundStagiaire)
        setFormData({
          nom: foundStagiaire.nom,
          prenom: foundStagiaire.prenom,
          civilite: foundStagiaire.civilite,
          idFiliere: foundStagiaire.idFiliere.toString(),
          photo: null,
        })
      } else {
        setError("Stagiaire non trouvé")
      }

      setFilieres([
        { id: 1, nom: "Développement Web", niveau: "Technicien Spécialisé" },
        { id: 2, nom: "Réseaux Informatiques", niveau: "Technicien" },
        { id: 3, nom: "Cybersécurité", niveau: "Technicien Spécialisé" },
        { id: 4, nom: "Data Science", niveau: "Technicien Spécialisé" },
      ])
    }

    loadData()
  }, [user, router, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Simulation de la mise à jour du stagiaire
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage("Stagiaire mis à jour avec succès!")
      setTimeout(() => {
        router.push("/stagiaires")
      }, 2000)
    } catch (err) {
      setError("Erreur lors de la mise à jour du stagiaire")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, photo: file })
  }

  if (!user || user.role !== "ADMIN") return null

  if (!stagiaire && !error) {
    return <div>Chargement...</div>
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Éditer stagiaire</h1>
            <p className="mt-2 text-gray-600">Modifiez les informations du stagiaire</p>
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

              {stagiaire && (
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
                            <SelectValue />
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
                      </div>

                      <div className="space-y-2">
                        <Label>Photo actuelle</Label>
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={stagiaire.photo ? `/images/${stagiaire.photo}` : undefined} />
                          <AvatarFallback className="text-lg">
                            {stagiaire.prenom.charAt(0)}
                            {stagiaire.nom.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
