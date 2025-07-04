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
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Utilisateur {
  id: number
  login: string
  email: string
  role: "ADMIN" | "VISITEUR"
  etat: boolean
  avatar?: string
}

export default function UtilisateursPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedEtat, setSelectedEtat] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    // Données de démonstration
    setUtilisateurs([
      { id: 1, login: "admin", email: "admin@example.com", role: "ADMIN", etat: true },
      { id: 2, login: "visiteur", email: "visiteur@example.com", role: "VISITEUR", etat: true },
      { id: 3, login: "marie.dupont", email: "marie.dupont@example.com", role: "VISITEUR", etat: true },
      { id: 4, login: "jean.martin", email: "jean.martin@example.com", role: "VISITEUR", etat: false },
      { id: 5, login: "sophie.bernard", email: "sophie.bernard@example.com", role: "ADMIN", etat: true },
    ])
  }, [user, router])

  const handleToggleEtat = async (id: number, currentEtat: boolean) => {
    if (id === user?.id && !currentEtat) {
      alert("Vous ne pouvez pas désactiver votre propre compte.")
      return
    }

    setUtilisateurs(utilisateurs.map((u) => (u.id === id ? { ...u, etat: !currentEtat } : u)))
  }

  const handleDelete = async (id: number) => {
    if (id === user?.id) {
      alert("Vous ne pouvez pas supprimer votre propre compte.")
      return
    }

    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      setUtilisateurs(utilisateurs.filter((u) => u.id !== id))
    }
  }

  const filteredUtilisateurs = utilisateurs.filter((utilisateur) => {
    const matchesSearch = utilisateur.login.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || utilisateur.role === selectedRole
    const matchesEtat = selectedEtat === "all" || utilisateur.etat.toString() === selectedEtat
    return matchesSearch && matchesRole && matchesEtat
  })

  const totalPages = Math.ceil(filteredUtilisateurs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUtilisateurs = filteredUtilisateurs.slice(startIndex, startIndex + itemsPerPage)

  if (!user || user.role !== "ADMIN") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
              <p className="mt-2 text-gray-600">Gérez les utilisateurs et leurs permissions</p>
            </div>
            <Button asChild>
              <Link href="/utilisateurs/nouveau">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Link>
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rechercher des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Login..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Tous les rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="VISITEUR">Visiteur</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedEtat} onValueChange={setSelectedEtat}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Tous les états" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les états</SelectItem>
                    <SelectItem value="true">Activé</SelectItem>
                    <SelectItem value="false">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs ({filteredUtilisateurs.length} utilisateurs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedUtilisateurs.map((utilisateur) => (
                  <div
                    key={utilisateur.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      utilisateur.etat ? "bg-white" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={utilisateur.avatar ? `/images/${utilisateur.avatar}` : undefined} />
                        <AvatarFallback>{utilisateur.login.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{utilisateur.login}</h3>
                        <p className="text-sm text-gray-500">{utilisateur.email}</p>
                      </div>
                      <Badge variant={utilisateur.role === "ADMIN" ? "default" : "secondary"}>
                        {utilisateur.role === "ADMIN" ? "Administrateur" : "Visiteur"}
                      </Badge>
                      <Badge variant={utilisateur.etat ? "default" : "destructive"}>
                        {utilisateur.etat ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/utilisateurs/editer/${utilisateur.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEtat(utilisateur.id, utilisateur.etat)}
                      >
                        {utilisateur.etat ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(utilisateur.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
