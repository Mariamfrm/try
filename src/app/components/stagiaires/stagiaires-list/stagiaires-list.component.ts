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
import { MatDialogModule, type MatDialog } from "@angular/material/dialog"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import type { AuthService } from "../../../services/auth.service"
import type { StagiairesService } from "../../../services/stagiaires.service"
import type { FilieresService } from "../../../services/filieres.service"
import type { Stagiaire, Filiere } from "../../../models/stagiaire.model"

@Component({
  selector: "app-stagiaires-list",
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
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Stagiaires</h1>
          <p class="page-subtitle">Gérez la liste des stagiaires inscrits</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/stagiaires/nouveau" *ngIf="authService.isAdmin()">
          <mat-icon>add</mat-icon>
          Nouveau stagiaire
        </button>
      </div>

      <!-- Filtres de recherche -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Rechercher des stagiaires</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" class="search-container">
            <mat-form-field appearance="outline">
              <mat-label>Nom ou prénom</mat-label>
              <input matInput formControlName="search" placeholder="Rechercher...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Filière</mat-label>
              <mat-select formControlName="filiere">
                <mat-option value="">Toutes les filières</mat-option>
                <mat-option *ngFor="let filiere of filieres" [value]="filiere.id">
                  {{ filiere.nom_filiere }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Civilité</mat-label>
              <mat-select formControlName="civilite">
                <mat-option value="">Toutes</mat-option>
                <mat-option value="F">Féminin</mat-option>
                <mat-option value="M">Masculin</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Filtrer
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Liste des stagiaires -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Liste des stagiaires ({{ totalStagiaires }} stagiaires)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="stagiaires" class="full-width">
              <!-- Colonne Photo -->
              <ng-container matColumnDef="photo">
                <th mat-header-cell *matHeaderCellDef>Photo</th>
                <td mat-cell *matCellDef="let stagiaire">
                  <img 
                    [src]="getPhotoUrl(stagiaire.photo, stagiaire.civilite)" 
                    [alt]="stagiaire.prenom + ' ' + stagiaire.nom"
                    class="avatar-small"
                    style="border-radius: 50%; object-fit: cover;">
                </td>
              </ng-container>

              <!-- Colonne Nom -->
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let stagiaire">
                  <div>
                    <strong>{{ stagiaire.prenom }} {{ stagiaire.nom }}</strong>
                    <br>
                    <small class="text-muted">ID: {{ stagiaire.id }}</small>
                  </div>
                </td>
              </ng-container>

              <!-- Colonne Civilité -->
              <ng-container matColumnDef="civilite">
                <th mat-header-cell *matHeaderCellDef>Civilité</th>
                <td mat-cell *matCellDef="let stagiaire">
                  <mat-chip [class]="stagiaire.civilite === 'F' ? 'badge-info' : 'badge-success'">
                    {{ stagiaire.civilite === 'F' ? 'Féminin' : 'Masculin' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Filière -->
              <ng-container matColumnDef="filiere">
                <th mat-header-cell *matHeaderCellDef>Filière</th>
                <td mat-cell *matCellDef="let stagiaire">
                  <mat-chip class="badge-success">
                    {{ stagiaire.filiere?.nom_filiere || 'Non définie' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Colonne Actions -->
              <ng-container matColumnDef="actions" *ngIf="authService.isAdmin()">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let stagiaire">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" [routerLink]="['/stagiaires/editer', stagiaire.id]">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteStagiaire(stagiaire)">
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
            [length]="totalStagiaires"
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
export class StagiairesListComponent implements OnInit {
  stagiaires: Stagiaire[] = []
  filieres: Filiere[] = []
  searchForm: FormGroup
  displayedColumns: string[] = ["photo", "nom", "civilite", "filiere"]
  totalStagiaires = 0
  pageSize = 10
  currentPage = 0

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private stagiairesService: StagiairesService,
    private filieresService: FilieresService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.searchForm = this.fb.group({
      search: [""],
      filiere: [""],
      civilite: [""],
    })

    if (this.authService.isAdmin()) {
      this.displayedColumns.push("actions")
    }
  }

  ngOnInit() {
    this.loadFilieres()
    this.loadStagiaires()
  }

  loadStagiaires() {
    const filters = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      search: this.searchForm.get("search")?.value || "",
      filiere_id: this.searchForm.get("filiere")?.value || undefined,
    }

    // Simulation des données pour la démonstration
    const mockStagiaires: Stagiaire[] = [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Marie",
        civilite: "F",
        photo: "img1.jpg",
        id_filiere: 1,
        filiere: { id: 1, nom_filiere: "Développement Web", niveau: "Technicien Spécialisé" },
      },
      {
        id: 2,
        nom: "Martin",
        prenom: "Pierre",
        civilite: "M",
        photo: "img3.jpg",
        id_filiere: 2,
        filiere: { id: 2, nom_filiere: "Réseaux Informatiques", niveau: "Technicien" },
      },
      {
        id: 3,
        nom: "Bernard",
        prenom: "Sophie",
        civilite: "F",
        photo: "img2.jpg",
        id_filiere: 1,
        filiere: { id: 1, nom_filiere: "Développement Web", niveau: "Technicien Spécialisé" },
      },
      {
        id: 4,
        nom: "Dubois",
        prenom: "Jean",
        civilite: "M",
        photo: "img4.jpg",
        id_filiere: 3,
        filiere: { id: 3, nom_filiere: "Cybersécurité", niveau: "Technicien Spécialisé" },
      },
      {
        id: 5,
        nom: "Moreau",
        prenom: "Emma",
        civilite: "F",
        photo: "img5.jpg",
        id_filiere: 4,
        filiere: { id: 4, nom_filiere: "Data Science", niveau: "Technicien Spécialisé" },
      },
    ]

    // Filtrer les données selon les critères
    let filteredStagiaires = mockStagiaires

    const searchTerm = filters.search.toLowerCase()
    if (searchTerm) {
      filteredStagiaires = filteredStagiaires.filter(
        (s) => s.nom.toLowerCase().includes(searchTerm) || s.prenom.toLowerCase().includes(searchTerm),
      )
    }

    if (filters.filiere_id) {
      filteredStagiaires = filteredStagiaires.filter((s) => s.id_filiere === filters.filiere_id)
    }

    const civilite = this.searchForm.get("civilite")?.value
    if (civilite) {
      filteredStagiaires = filteredStagiaires.filter((s) => s.civilite === civilite)
    }

    this.totalStagiaires = filteredStagiaires.length
    const startIndex = this.currentPage * this.pageSize
    this.stagiaires = filteredStagiaires.slice(startIndex, startIndex + this.pageSize)
  }

  loadFilieres() {
    // Simulation des données pour la démonstration
    this.filieres = [
      { id: 1, nom_filiere: "Développement Web", niveau: "Technicien Spécialisé" },
      { id: 2, nom_filiere: "Réseaux Informatiques", niveau: "Technicien" },
      { id: 3, nom_filiere: "Cybersécurité", niveau: "Technicien Spécialisé" },
      { id: 4, nom_filiere: "Data Science", niveau: "Technicien Spécialisé" },
      { id: 5, nom_filiere: "Intelligence Artificielle", niveau: "Technicien Spécialisé" },
    ]
  }

  applyFilters() {
    this.currentPage = 0
    this.loadStagiaires()
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex
    this.pageSize = event.pageSize
    this.loadStagiaires()
  }

  getPhotoUrl(photo: string | undefined, civilite: string): string {
    if (photo) {
      return `assets/images/${photo}`
    }
    // Image par défaut selon le genre
    return civilite === "F" ? "assets/images/default-female.jpg" : "assets/images/default-male.jpg"
  }

  deleteStagiaire(stagiaire: Stagiaire) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${stagiaire.prenom} ${stagiaire.nom} ?`)) {
      // Simulation de la suppression
      this.stagiaires = this.stagiaires.filter((s) => s.id !== stagiaire.id)
      this.totalStagiaires--

      this.snackBar.open("Stagiaire supprimé avec succès", "Fermer", {
        duration: 3000,
        panelClass: ["success-snackbar"],
      })
    }
  }
}
