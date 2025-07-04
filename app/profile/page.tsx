"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    avatar: null as File | null,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    setFormData((prev) => ({
      ...prev,
      email: user.email,
    }))
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Validation des mots de passe
      if (formData.newPassword && !formData.oldPassword) {
        setError("Veuillez entrer votre ancien mot de passe")
        return
      }

      // Simulation de la mise à jour du profil
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mettre à jour les données utilisateur
      updateProfile({ email: formData.email })

      setMessage("Profil mis à jour avec succès!")

      // Réinitialiser les champs de mot de passe
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }))
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, avatar: file })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
            <p className="mt-2 text-gray-600">Gérez vos informations personnelles et paramètres de compte</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
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
                      <Label htmlFor="login">Login</Label>
                      <Input id="login" value={user.login} disabled className="bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Input id="role" value={user.role} disabled className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Ancien mot de passe</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        placeholder="Entrez votre ancien mot de passe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder="Entrez votre nouveau mot de passe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar</Label>
                      <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-2">
                      <Label>Avatar actuel</Label>
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar ? `/images/${user.avatar}` : undefined} />
                        <AvatarFallback className="text-lg">{user.login.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
