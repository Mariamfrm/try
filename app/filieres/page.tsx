"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Filiere {
  id: number
  nom: string
  niveau: string
}

export default function FilieresPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNiveau, setSelectedNiveau] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    // Données de démonstration
    setFilieres([
      { id: 1, nom: "Développement Web", niveau: "Technicien Spécialisé" },
      { id: 2, nom: "Réseaux Informatiques", niveau: "Technicien" },
      { id: 3, nom: "Cybersécurité", niveau: "Technicien Spécialisé" },
      { id: 4, nom: "Data Science", niveau: "Technicien Spécialisé" },
      { id: 5, nom: "Maintenance Informatique", niveau: "Qualification" },
      { id: 6, nom: "Développement Mobile", niveau: "Technicien Spécialisé" },
      { id: 7, nom: "Administration Système", niveau: "Technicien" },
      { id: 8, nom: "Intelligence Artificielle", niveau: "Technicien Spécialisé" },
    ])
  }, [user, router])

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette filière?")) {
      setFilieres(filieres.filter((f) => f.id !== id))
    }
  }

  const filteredFilieres = filieres.filter((filiere) => {
    const matchesSearch = filiere.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesNiveau = selectedNiveau === "all" || filiere.niveau === selectedNiveau
    return matchesSearch && matchesNiveau
  })

  const totalPages = Math.ceil(filteredFilieres.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFilieres = filteredFilieres.slice(startIndex, startIndex + itemsPerPage)

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case "Qualification":
        return "bg-yellow-100 text-yellow-800"
      case "Technicien":
        return "bg-blue-100 text-blue-800"
      case "Technicien Spécialisé":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <h1 className="text-3xl font-bold text-gray-900">Filières</h1>
              <p className="mt-2 text-gray-600">Gérez les filières et niveaux de formation</p>
            </div>
            {user.role === "ADMIN" && (
              <Button asChild>
                <Link href="/filieres/nouvelle">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle filière
                </Link>
              </Button>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rechercher des filières</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom de la filière..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="Qualification">Qualification</SelectItem>
                    <SelectItem value="Technicien">Technicien</SelectItem>
                    <SelectItem value="Technicien Spécialisé">Technicien Spécialisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des filières ({filteredFilieres.length} filières)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedFilieres.map((filiere) => (
                  <div
                    key={filiere.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{filiere.id}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{filiere.nom}</h3>
                        <Badge className={getNiveauColor(filiere.niveau)}>{filiere.niveau}</Badge>
                      </div>
                    </div>

                    {user.role === "ADMIN" && (
                      <div className="flex space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/filieres/editer/${filiere.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(filiere.id)}>
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
