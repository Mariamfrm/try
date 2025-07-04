"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Stagiaire {
  id: number
  nom: string
  prenom: string
  civilite: "M" | "F"
  photo?: string
  filiere: string
}

interface Filiere {
  id: number
  nom: string
  niveau: string
}

export default function StagiairesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiliere, setSelectedFiliere] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    const loadStagiaires = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          search: searchTerm,
          filiere_id: selectedFiliere === "all" ? "0" : selectedFiliere,
        })

        const response = await fetch(`/api/stagiaires?${params}`)
        if (response.ok) {
          const data = await response.json()
          setStagiaires(data.data || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des stagiaires:", error)
      }
    }

    const loadFilieres = async () => {
      try {
        const response = await fetch("/api/filieres?limit=100")
        if (response.ok) {
          const data = await response.json()
          setFilieres(data.data || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des filières:", error)
      }
    }

    loadStagiaires()
    loadFilieres()
  }, [user, router, currentPage, searchTerm, selectedFiliere])

  const filteredStagiaires = stagiaires.filter((stagiaire) => {
    const matchesSearch =
      stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFiliere = selectedFiliere === "all" || stagiaire.filiere === selectedFiliere
    return matchesSearch && matchesFiliere
  })

  const totalPages = Math.ceil(filteredStagiaires.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStagiaires = filteredStagiaires.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire?")) {
      try {
        const response = await fetch(`/api/stagiaires/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setStagiaires(stagiaires.filter((s) => s.id !== id))
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stagiaires</h1>
              <p className="mt-2 text-gray-600">Gérez la liste des stagiaires inscrits</p>
            </div>
            {user.role === "ADMIN" && (
              <Button asChild>
                <Link href="/stagiaires/nouveau">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau stagiaire
                </Link>
              </Button>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rechercher des stagiaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom ou prénom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedFiliere} onValueChange={setSelectedFiliere}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Toutes les filières" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les filières</SelectItem>
                    {filieres.map((filiere) => (
                      <SelectItem key={filiere.id} value={filiere.nom}>
                        {filiere.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des stagiaires ({filteredStagiaires.length} stagiaires)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedStagiaires.map((stagiaire) => (
                  <div
                    key={stagiaire.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={stagiaire.photo ? `/images/${stagiaire.photo}` : undefined} />
                        <AvatarFallback>
                          {stagiaire.prenom.charAt(0)}
                          {stagiaire.nom.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {stagiaire.prenom} {stagiaire.nom}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {stagiaire.id}</p>
                      </div>
                      <Badge variant="secondary">{stagiaire.filiere}</Badge>
                      <Badge variant={stagiaire.civilite === "F" ? "default" : "outline"}>
                        {stagiaire.civilite === "F" ? "Féminin" : "Masculin"}
                      </Badge>
                    </div>

                    {user.role === "ADMIN" && (
                      <div className="flex space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/stagiaires/editer/${stagiaire.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(stagiaire.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
