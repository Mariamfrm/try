import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { type Router, type ActivatedRoute, RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import type { AuthService } from "../../../services/auth.service"
import type { FilieresService } from "../../../services/filieres.service"
import type { Filiere } from "../../../models/stagiaire.model"

@Component({
  selector: "app-filiere-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-stroked-button routerLink="/filieres" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Retour à la liste
        </button>
        <h1 class="page-title">{{ isEditMode ? 'Éditer filière' : 'Nouvelle filière' }}</h1>
        <p class="page-subtitle">{{ isEditMode ? 'Modifiez les informations de la filière' : 'Ajoutez une nouvelle filière au système' }}</p>
      </div>

      <div class="form-container">
        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>Informations de la filière</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="filiereForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Nom de la filière *</mat-label>
                <input matInput formControlName="nom_filiere" placeholder="Ex: Développement Web" required>
                <mat-error *ngIf="filiereForm.get('nom_filiere')?.hasError('required')">
                  Le nom de la filière est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Niveau *</mat-label>
                <mat-select formControlName="niveau" required>
                  <mat-option value="">Sélectionnez un niveau</mat-option>
                  <mat-option value="Qualification">Qualification</mat-option>
                  <mat-option value="Technicien">Technicien</mat-option>
                  <mat-option value="Technicien Spécialisé">Technicien Spécialisé</mat-option>
                </mat-select>
                <mat-error *ngIf="filiereForm.get('niveau')?.hasError('required')">
                  Le niveau est requis
                </mat-error>
              </mat-form-field>

              <div class="button-container">
                <button mat-raised-button color="primary" type="submit" [disabled]="filiereForm.invalid || loading">
                  <mat-icon>{{ loading ? 'hourglass_empty' : 'save' }}</mat-icon>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button mat-stroked-button type="button" routerLink="/filieres">
                  Annuler
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
    .back-button {
      margin-bottom: 16px;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .button-container {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .button-container {
        flex-direction: column;
      }

      .button-container button {
        width: 100%;
      }
    }
  `,
  ],
})
export class FiliereFormComponent implements OnInit {
  filiereForm: FormGroup
  isEditMode = false
  filiereId: number | null = null
  loading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private filieresService: FilieresService,
    private snackBar: MatSnackBar,
  ) {
    this.filiereForm = this.fb.group({
      nom_filiere: ["", Validators.required],
      niveau: ["", Validators.required],
    })
  }

  ngOnInit() {
    // Vérifier les permissions
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/filieres"])
      return
    }

    // Vérifier si c'est un mode édition
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.filiereId = Number.parseInt(id)
      this.loadFiliere()
    }
  }

  loadFiliere() {
    if (!this.filiereId) return

    // Simulation des données pour la démonstration
    const mockFilieres: Filiere[] = [
      { id: 1, nom_filiere: "Développement Web", niveau: "Technicien Spécialisé" },
      { id: 2, nom_filiere: "Réseaux Informatiques", niveau: "Technicien" },
      { id: 3, nom_filiere: "Cybersécurité", niveau: "Technicien Spécialisé" },
    ]

    const filiere = mockFilieres.find((f) => f.id === this.filiereId)
    if (filiere) {
      this.filiereForm.patchValue({
        nom_filiere: filiere.nom_filiere,
        niveau: filiere.niveau,
      })
    }
  }

  onSubmit() {
    if (this.filiereForm.valid) {
      this.loading = true

      const formData = this.filiereForm.value

      // Simulation de l'enregistrement
      setTimeout(() => {
        this.loading = false

        const message = this.isEditMode ? "Filière mise à jour avec succès!" : "Filière ajoutée avec succès!"

        this.snackBar.open(message, "Fermer", {
          duration: 3000,
          panelClass: ["success-snackbar"],
        })

        this.router.navigate(["/filieres"])
      }, 1000)
    }
  }
}
