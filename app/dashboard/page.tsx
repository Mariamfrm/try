"use client"

import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, GraduationCap, BookOpen, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState({
    stagiaires: 0,
    filieres: 0,
    utilisateurs: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    // Charger les statistiques réelles
    const loadStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
      }
    }

    if (user) {
      loadStats()
    }
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Gestion de Stagiaires</h1>
                <p className="text-xl opacity-90">
                  Bienvenue, {user.login}. Gérez vos stagiaires et filières efficacement.
                </p>
                <div className="mt-4 flex space-x-4">
                  <Button asChild variant="secondary">
                    <Link href="/stagiaires">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Gérer les stagiaires
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    <Link href="/filieres">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Gérer les filières
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="text-8xl font-bold opacity-20">DIM</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stagiaires</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.stagiaires}</div>
                <p className="text-xs text-muted-foreground">Total des stagiaires inscrits</p>
                <div className="mt-4 flex space-x-2">
                  <Button asChild size="sm">
                    <Link href="/stagiaires">Voir tous</Link>
                  </Button>
                  {user.role === "ADMIN" && (
                    <Button asChild size="sm" variant="outline">
                      <Link href="/stagiaires/nouveau">
                        <Plus className="h-4 w-4 mr-1" />
                        Nouveau
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Filières</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.filieres}</div>
                <p className="text-xs text-muted-foreground">Filières disponibles</p>
                <div className="mt-4 flex space-x-2">
                  <Button asChild size="sm">
                    <Link href="/filieres">Voir toutes</Link>
                  </Button>
                  {user.role === "ADMIN" && (
                    <Button asChild size="sm" variant="outline">
                      <Link href="/filieres/nouvelle">
                        <Plus className="h-4 w-4 mr-1" />
                        Nouvelle
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {user.role === "ADMIN" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.utilisateurs}</div>
                  <p className="text-xs text-muted-foreground">Utilisateurs du système</p>
                  <div className="mt-4 flex space-x-2">
                    <Button asChild size="sm">
                      <Link href="/utilisateurs">Gérer</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/utilisateurs/nouveau">
                        <Plus className="h-4 w-4 mr-1" />
                        Nouveau
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                    <Link href="/stagiaires">
                      <GraduationCap className="h-6 w-6 mb-2" />
                      Voir les stagiaires
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                    <Link href="/filieres">
                      <BookOpen className="h-6 w-6 mb-2" />
                      Gérer les filières
                    </Link>
                  </Button>

                  {user.role === "ADMIN" && (
                    <>
                      <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                        <Link href="/stagiaires/nouveau">
                          <Plus className="h-6 w-6 mb-2" />
                          Nouveau stagiaire
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                        <Link href="/utilisateurs">
                          <Users className="h-6 w-6 mb-2" />
                          Gérer utilisateurs
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
