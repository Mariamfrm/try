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
import type { FilieresService } from "../../../services/filieres.service"
import type { Filiere } from "../../../models/stagiaire.model"

@Component({
  selector: "app-filieres-list",
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
          <h1 class="page-title">Filières</h1>
          <p class="page-subtitle">Gérez les filières et niveaux de formation</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/filieres/nouvelle" *ngIf="authService.isAdmin()">
          <mat-icon>add</mat-icon>
          Nouvelle filière
        </button>
      </div>

      <!-- Filtres de recherche -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Rechercher des filières</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" class="search-container">
            <mat-form-field appearance="outline">
              <mat-label>Nom de la filière</mat-label>
              <input matInput formControlName="search" placeholder="Rechercher...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Niveau</mat-label>
              <mat-select formControlName="niveau">
                <mat-option value="">Tous les niveaux</mat-option>
                <mat-option value="Qualification">Qualification</mat-option>
                <mat-option value="Technicien">Technicien</mat-option>
                <mat-option value="Technicien Spécialisé">Technicien Spécialisé</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Filtrer
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Liste des filières -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Liste des filières ({{ totalFilieres }} filières)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="filieres" class="full-width">
              <!-- Colonne ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let filiere">
                  <div class="id-badge">{{ filiere.id }}</div>
                </td>
              </ng-container>

              <!-- Colonne Nom -->
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom de la filière</th>
                <td mat-cell *matCellDef="let filiere">
                  <strong>{{ filiere.nom_filiere }}</strong>
                </td>
              </ng-container>

              <!-- Colonne Niveau -->
              <ng-container matColumnDef="niveau">
                <th mat-header-cell *matHeaderCellDef>Niveau</th>
                <td mat-cell *matCellDef="let filiere">
                  <mat-chip [class]="getNiveauClass(filiere.niveau)">
                    {{ filiere.niveau }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions" *ngIf="authService.isAdmin()">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let filiere">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" [routerLink]="['/filieres/editer', filiere.id]">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteFiliere(filiere)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            [length]="totalFilieres"
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
      min-width: 200px;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 16px;
    }

    .id-badge {
      width: 32px;
      height: 32px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
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
export class FilieresListComponent implements OnInit {
  filieres: Filiere[] = []
  searchForm: FormGroup
  displayedColumns: string[] = ["id", "nom", "niveau"]
  totalFilieres = 0
  pageSize = 10
  currentPage = 0

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private filieresService: FilieresService,
    private snackBar: MatSnackBar,
  ) {
    this.searchForm = this.fb.group({
      search: [""],
      niveau: [""],
    })

    if (this.authService.isAdmin()) {
      this.displayedColumns.push("actions")
    }
  }

  ngOnInit() {
    this.loadFilieres()
  }

  loadFilieres() {
    // Simulation des données pour la démonstration
    const mockFilieres: Filiere[] = [
      { id: 1, nom_filiere: "Développement Web", niveau: "Technicien Spécialisé" },
      { id: 2, nom_filiere: "Réseaux Informatiques", niveau: "Technicien" },
      { id: 3, nom_filiere: "Cybersécurité", niveau: "Technicien Spécialisé" },
      { id: 4, nom_filiere: "Data Science", niveau: "Technicien Spécialisé" },
      { id: 5, nom_filiere: "Intelligence Artificielle", niveau: "Technicien Spécialisé" },
      { id: 6, nom_filiere: "Maintenance Informatique", niveau: "Qualification" },
      { id: 7, nom_filiere: "Développement Mobile", niveau: "Technicien Spécialisé" },
      { id: 8, nom_filiere: "Administration Système", niveau: "Technicien" },
    ]

    // Filtrer les données selon les critères
    let filteredFilieres = mockFilieres

    const searchTerm = this.searchForm.get("search")?.value?.toLowerCase()
    if (searchTerm) {
      filteredFilieres = filteredFilieres.filter((f) => f.nom_filiere.toLowerCase().includes(searchTerm))
    }

    const niveau = this.searchForm.get("niveau")?.value
    if (niveau) {
      filteredFilieres = filteredFilieres.filter((f) => f.niveau === niveau)
    }

    this.totalFilieres = filteredFilieres.length
    const startIndex = this.currentPage * this.pageSize
    this.filieres = filteredFilieres.slice(startIndex, startIndex + this.pageSize)
  }

  applyFilters() {
    this.currentPage = 0
    this.loadFilieres()
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.loadFilieres()
  }

  getNiveauClass(niveau: string): string {
    switch (niveau) {
      case "Qualification":
        return "badge-warning"
      case "Technicien":
        return "badge-info"
      case "Technicien Spécialisé":
        return "badge-success"
      default:
        return "badge-info"
    }
  }

  deleteFiliere(filiere: Filiere) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la filière "${filiere.nom_filiere}" ?`)) {
      // Simulation de la suppression
      this.filieres = this.filieres.filter((f) => f.id !== filiere.id)
      this.totalFilieres--

      this.snackBar.open("Filière supprimée avec succès", "Fermer", {
        duration: 3000,
        panelClass: ["success-snackbar"],
      })
    }
  }
}
