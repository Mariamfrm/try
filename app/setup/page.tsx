"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, Users } from "lucide-react"

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState({
    database: false,
    tables: false,
    data: false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const runScript = async (scriptName: string) => {
    try {
      const response = await fetch(`/api/setup/${scriptName}`, {
        method: "POST",
      })
      const result = await response.json()
      return response.ok
    } catch (error) {
      console.error(`Erreur lors de l'exécution de ${scriptName}:`, error)
      return false
    }
  }

  const handleSetup = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Créer les tables
      const tablesSuccess = await runScript("create-tables")
      setSetupStatus((prev) => ({ ...prev, tables: tablesSuccess }))

      if (tablesSuccess) {
        // Insérer les données
        const dataSuccess = await runScript("seed-data")
        setSetupStatus((prev) => ({ ...prev, data: dataSuccess }))

        if (dataSuccess) {
          setMessage("Configuration terminée avec succès ! Vous pouvez maintenant utiliser l'application.")
        } else {
          setMessage("Erreur lors de l'insertion des données.")
        }
      } else {
        setMessage("Erreur lors de la création des tables.")
      }
    } catch (error) {
      setMessage("Erreur lors de la configuration.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Configuration de la base de données</CardTitle>
          <p className="text-gray-600">
            Configurez votre base de données Supabase pour utiliser l'application de gestion des stagiaires.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className={setupStatus.data ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  setupStatus.tables ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                {setupStatus.tables ? <CheckCircle className="h-5 w-5" /> : <Database className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-medium">Création des tables</h3>
                <p className="text-sm text-gray-500">Tables filiere, stagiaire, utilisateur</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  setupStatus.data ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                {setupStatus.data ? <CheckCircle className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-medium">Insertion des données</h3>
                <p className="text-sm text-gray-500">Filières, stagiaires et utilisateurs de démonstration</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informations importantes :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Assurez-vous d'avoir configuré vos variables d'environnement Supabase</li>
              <li>• Les comptes par défaut : admin/123 et visiteur/123</li>
              <li>• Cette opération ne peut être effectuée qu'une seule fois</li>
            </ul>
          </div>

          <Button onClick={handleSetup} disabled={loading || setupStatus.data} className="w-full">
            {loading
              ? "Configuration en cours..."
              : setupStatus.data
                ? "Configuration terminée"
                : "Configurer la base de données"}
          </Button>

          {setupStatus.data && (
            <div className="text-center">
              <Button asChild variant="outline">
                <a href="/">Aller à la page de connexion</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
