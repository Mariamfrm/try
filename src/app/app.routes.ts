import type { Routes } from "@angular/router"
import { AuthGuard } from "./guards/auth.guard"
import { AdminGuard } from "./guards/admin.guard"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./components/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./components/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "stagiaires",
    loadComponent: () =>
      import("./components/stagiaires/stagiaires-list/stagiaires-list.component").then(
        (m) => m.StagiairesListComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "stagiaires/nouveau",
    loadComponent: () =>
      import("./components/stagiaires/stagiaire-form/stagiaire-form.component").then((m) => m.StagiaireFormComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "stagiaires/editer/:id",
    loadComponent: () =>
      import("./components/stagiaires/stagiaire-form/stagiaire-form.component").then((m) => m.StagiaireFormComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "filieres",
    loadComponent: () =>
      import("./components/filieres/filieres-list/filieres-list.component").then((m) => m.FilieresListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "filieres/nouvelle",
    loadComponent: () =>
      import("./components/filieres/filiere-form/filiere-form.component").then((m) => m.FiliereFormComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "filieres/editer/:id",
    loadComponent: () =>
      import("./components/filieres/filiere-form/filiere-form.component").then((m) => m.FiliereFormComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "utilisateurs",
    loadComponent: () =>
      import("./components/utilisateurs/utilisateurs-list/utilisateurs-list.component").then(
        (m) => m.UtilisateursListComponent,
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "utilisateurs/nouveau",
    loadComponent: () =>
      import("./components/utilisateurs/utilisateur-form/utilisateur-form.component").then(
        (m) => m.UtilisateurFormComponent,
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "utilisateurs/editer/:id",
    loadComponent: () =>
      import("./components/utilisateurs/utilisateur-form/utilisateur-form.component").then(
        (m) => m.UtilisateurFormComponent,
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "profile",
    loadComponent: () => import("./components/profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
]
