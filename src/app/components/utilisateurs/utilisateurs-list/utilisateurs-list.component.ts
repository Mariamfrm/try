import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { type FormBuilder, type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule, type PageEvent } from "@angular/material/paginator"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatChipsModule } from "@angular/material/chips"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import type { AuthService } from "../../../services/auth.service"
import type { User } from "../../../models/user.model"

@Component({
  selector: "app-utilisateurs-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Utilisateurs</h1>
          <p class="page-subtitle">Gérez les utilisateurs et leurs permissions</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/utilisateurs/nouveau">
          <mat-icon>add</mat-icon>
          Nouvel utilisateur
        </button>
      </div>

      <!-- Filtres de recherche -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Rechercher des utilisateurs</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" class="search-container">
            <mat-form-field appearance="outline">
              <mat-label>Login</mat-label>
              <input matInput formControlName="search" placeholder="Rechercher...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Rôle</mat-label>
              <mat-select formControlName="role">
                <mat-option value="">Tous les rôles</mat-option>
                <mat-option value="ADMIN">Administrateur</mat-option>
                <mat-option value="VISITEUR">Visiteur</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>État</mat-label>
              <mat-select formControlName="etat">
                <mat-option value="">Tous les états</mat-option>
                <mat-option value="true">Activé</mat-option>
                <mat-option value="false">Désactivé</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Filtrer
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Liste des utilisateurs -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Liste des utilisateurs ({{ totalUtilisateurs }} utilisateurs)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="utilisateurs" class="full-width">
              <!-- Colonne Avatar -->
              <ng-container matColumnDef="avatar">
                <th mat-header-cell *matHeaderCellDef>Avatar</th>
                <td mat-cell *matCellDef="let utilisateur">
                  <img 
                    [src]="getAvatarUrl(utilisateur.avatar)" 
                    [alt]="utilisateur.login"
                    class="avatar-small"
                    style="border-radius: 50%; object-fit: cover;">
                </td>
              </ng-container>

              <!-- Colonne Login -->
              <ng-container matColumnDef="login">
                <th mat-header-cell *matHeaderCellDef>Login</th>
                <td mat-cell *matCellDef="let utilisateur">
                  <div>
                    <strong>{{ utilisateur.login }}</strong>
                    <br>
                    <small class="text-muted">{{ utilisateur.email }}</small>
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Rôle -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rôle</th>
                <td mat-cell *matCellDef="let utilisateur">
                  <mat-chip [class]="utilisateur.role === 'ADMIN' ? 'badge-success' : 'badge-info'">
                    {{ utilisateur.role === 'ADMIN' ? 'Administrateur' : 'Visiteur' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne État -->
              <ng-container matColumnDef="etat">
                <th mat-header-cell *matHeaderCellDef>État</th>
                <td mat-cell *matCellDef="let utilisateur">
                  <mat-chip [class]="utilisateur.etat ? 'badge-success' : 'badge-danger'">
                    {{ utilisateur.etat ? 'Activé' : 'Désactivé' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let utilisateur">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" [routerLink]="['/utilisateurs/editer', utilisateur.id]">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [color]="utilisateur.etat ? 'warn' : 'accent'" 
                            (click)="toggleEtat(utilisateur)">
                      <mat-icon>{{ utilisateur.etat ? 'person_off' : 'person' }}</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteUtilisateur(utilisateur)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  [class]="row.etat ? 'user-active' : 'user-inactive'"></tr>
            </table>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            [length]="totalUtilisateurs"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10, 25, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .search-container {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-container .mat-form-field {
      flex: 1;
      min-width: 150px;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 16px;
    }

    .avatar-small {
      width: 40px;
      height: 40px;
    }

    .text-muted {
      color: #666;
      font-size: 0.8em;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .user-active {
      background-color: rgba(39, 174, 96, 0.05);
    }

    .user-inactive {
      background-color: rgba(231, 76, 60, 0.05);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .search-container {
        flex-direction: column;
      }

      .search-container .mat-form-field {
        width: 100%;
      }
    }
  `,
  ],
})
export class UtilisateursListComponent implements OnInit {
  utilisateurs: User[] = []
  searchForm: FormGroup
  displayedColumns: string[] = ["avatar", "login", "role", "etat", "actions"]
  totalUtilisateurs = 0
  pageSize = 10
  currentPage = 0

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.searchForm = this.fb.group({
      search: [""],
      role: [""],
      etat: [""],
    })
  }

  ngOnInit() {
    this.loadUtilisateurs()
  }

  loadUtilisateurs() {
    // Simulation des données pour la démonstration
    const mockUtilisateurs: User[] = [
      { id: 1, login: "admin", email: "admin@example.com", role: "ADMIN", etat: true },
      { id: 2, login: "visiteur", email: "visiteur@example.com", role: "VISITEUR", etat: true },
      { id: 3, login: "marie.dupont", email: "marie.dupont@example.com", role: "VISITEUR", etat: true },
      { id: 4, login: "jean.martin", email: "jean.martin@example.com", role: "VISITEUR", etat: false },
      { id: 5, login: "sophie.bernard", email: "sophie.bernard@example.com", role: "ADMIN", etat: true },
    ]

    // Filtrer les données selon les critères
    let filteredUtilisateurs = mockUtilisateurs

    const searchTerm = this.searchForm.get("search")?.value?.toLowerCase()
    if (searchTerm) {
      filteredUtilisateurs = filteredUtilisateurs.filter((u) => u.login.toLowerCase().includes(searchTerm))
    }

    const role = this.searchForm.get("role")?.value
    if (role) {
      filteredUtilisateurs = filteredUtilisateurs.filter((u) => u.role === role)
    }

    const etat = this.searchForm.get("etat")?.value
    if (etat !== "") {
      filteredUtilisateurs = filteredUtilisateurs.filter((u) => u.etat.toString() === etat)
    }

    this.totalUtilisateurs = filteredUtilisateurs.length
    const startIndex = this.currentPage * this.pageSize
    this.utilisateurs = filteredUtilisateurs.slice(startIndex, startIndex + this.pageSize)
  }

  applyFilters() {
    this.currentPage = 0
    this.loadUtilisateurs()
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.loadUtilisateurs()
  }

  getAvatarUrl(avatar: string | undefined): string {
    return avatar ? `assets/images/${avatar}` : "assets/images/default-avatar.jpg"
  }

  toggleEtat(utilisateur: User) {
    const currentUser = this.authService.getCurrentUser()
    if (utilisateur.id === currentUser?.id && !utilisateur.etat) {
      this.snackBar.open("Vous ne pouvez pas désactiver votre propre compte.", "Fermer", {
        duration: 3000,
        panelClass: ["error-snackbar"],
      })
      return
    }

    // Simulation du changement d'état
    utilisateur.etat = !utilisateur.etat

    const message = utilisateur.etat ? "Utilisateur activé avec succès" : "Utilisateur désactivé avec succès"

    this.snackBar.open(message, "Fermer", {
      duration: 3000,
      panelClass: ["success-snackbar"],
    })
  }

  deleteUtilisateur(utilisateur: User) {
    const currentUser = this.authService.getCurrentUser()
    if (utilisateur.id === currentUser?.id) {
      this.snackBar.open("Vous ne pouvez pas supprimer votre propre compte.", "Fermer", {
        duration: 3000,
        panelClass: ["error-snackbar"],
      })
      return
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${utilisateur.login}" ?`)) {
      // Simulation de la suppression
      this.utilisateurs = this.utilisateurs.filter((u) => u.id !== utilisateur.id)
      this.totalUtilisateurs--

      this.snackBar.open("Utilisateur supprimé avec succès", "Fermer", {
        duration: 3000,
        panelClass: ["success-snackbar"],
      })
    }
  }
}
