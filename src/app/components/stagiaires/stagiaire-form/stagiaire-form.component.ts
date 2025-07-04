import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { type Router, type ActivatedRoute, RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatRadioModule } from "@angular/material/radio"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import type { AuthService } from "../../../services/auth.service"
import type { StagiairesService } from "../../../services/stagiaires.service"
import type { FilieresService } from "../../../services/filieres.service"
import type { Stagiaire, Filiere } from "../../../models/stagiaire.model"

@Component({
  selector: "app-stagiaire-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-stroked-button routerLink="/stagiaires" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Retour à la liste
        </button>
        <h1 class="page-title">{{ isEditMode ? 'Éditer stagiaire' : 'Nouveau stagiaire' }}</h1>
        <p class="page-subtitle">{{ isEditMode ? 'Modifiez les informations du stagiaire' : 'Ajoutez un nouveau stagiaire au système' }}</p>
      </div>

      <div class="form-container">
        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>Informations du stagiaire</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="stagiaireForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-column">
                  <mat-form-field appearance="outline">
                    <mat-label>Nom *</mat-label>
                    <input matInput formControlName="nom" required>
                    <mat-error *ngIf="stagiaireForm.get('nom')?.hasError('required')">
                      Le nom est requis
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Prénom *</mat-label>
                    <input matInput formControlName="prenom" required>
                    <mat-error *ngIf="stagiaireForm.get('prenom')?.hasError('required')">
                      Le prénom est requis
                    </mat-error>
                  </mat-form-field>

                  <div class="form-field">
                    <label class="form-label">Civilité *</label>
                    <mat-radio-group formControlName="civilite" class="radio-group">
                      <mat-radio-button value="F">Féminin</mat-radio-button>
                      <mat-radio-button value="M">Masculin</mat-radio-button>
                    </mat-radio-group>
                  </div>
                </div>

                <div class="form-column">
                  <mat-form-field appearance="outline">
                    <mat-label>Filière *</mat-label>
                    <mat-select formControlName="id_filiere" required>
                      <mat-option value="">Sélectionnez une filière</mat-option>
                      <mat-option *ngFor="let filiere of filieres" [value]="filiere.id">
                        {{ filiere.nom_filiere }} - {{ filiere.niveau }}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="stagiaireForm.get('id_filiere')?.hasError('required')">
                      La filière est requise
                    </mat-error>
                  </mat-form-field>

                  <div class="form-field">
                    <label class="form-label">Photo</label>
                    <input type="file" accept="image/*" (change)="onFileSelected($event)" class="file-input">
                    <p class="help-text">
                      Si vous ne téléchargez pas de photo, une image par défaut sera attribuée en fonction du genre.
                    </p>
                  </div>

                  <div class="current-photo" *ngIf="currentPhotoUrl">
                    <label class="form-label">Photo actuelle</label>
                    <img [src]="currentPhotoUrl" alt="Photo actuelle" class="avatar-large">
                  </div>
                </div>
              </div>

              <div class="button-container">
                <button mat-raised-button color="primary" type="submit" [disabled]="stagiaireForm.invalid || loading">
                  <mat-icon>{{ loading ? 'hourglass_empty' : 'save' }}</mat-icon>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button mat-stroked-button type="button" routerLink="/stagiaires">
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
      max-width: 800px;
      margin: 0 auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 24px;
    }

    .form-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-field {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.6);
    }

    .radio-group {
      display: flex;
      gap: 16px;
    }

    .file-input {
      width: 100%;
      padding: 12px;
      border: 2px dashed #ddd;
      border-radius: 8px;
      background-color: #fafafa;
      cursor: pointer;
    }

    .file-input:hover {
      border-color: #ccc;
      background-color: #f5f5f5;
    }

    .help-text {
      font-size: 0.8em;
      color: #666;
      margin-top: 8px;
      margin-bottom: 0;
    }

    .current-photo {
      text-align: center;
    }

    .avatar-large {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }

    .button-container {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

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
export class StagiaireFormComponent implements OnInit {
  stagiaireForm: FormGroup
  filieres: Filiere[] = []
  isEditMode = false
  stagiaireId: number | null = null
  loading = false
  selectedFile: File | null = null
  currentPhotoUrl: string | null = null

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private stagiairesService: StagiairesService,
    private filieresService: FilieresService,
    private snackBar: MatSnackBar,
  ) {
    this.stagiaireForm = this.fb.group({
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      civilite: ["F", Validators.required],
      id_filiere: ["", Validators.required],
    })
  }

  ngOnInit() {
    // Vérifier les permissions
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/stagiaires"])
      return
    }

    this.loadFilieres()

    // Vérifier si c'est un mode édition
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.stagiaireId = Number.parseInt(id)
      this.loadStagiaire()
    }
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

  loadStagiaire() {
    if (!this.stagiaireId) return

    // Simulation des données pour la démonstration
    const mockStagiaires: Stagiaire[] = [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Marie",
        civilite: "F",
        photo: "img1.jpg",
        id_filiere: 1,
      },
      {
        id: 2,
        nom: "Martin",
        prenom: "Pierre",
        civilite: "M",
        photo: "img3.jpg",
        id_filiere: 2,
      },
    ]

    const stagiaire = mockStagiaires.find((s) => s.id === this.stagiaireId)
    if (stagiaire) {
      this.stagiaireForm.patchValue({
        nom: stagiaire.nom,
        prenom: stagiaire.prenom,
        civilite: stagiaire.civilite,
        id_filiere: stagiaire.id_filiere,
      })

      if (stagiaire.photo) {
        this.currentPhotoUrl = `assets/images/${stagiaire.photo}`
      }
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]

      // Prévisualisation de l'image
      const reader = new FileReader()
      reader.onload = (e) => {
        this.currentPhotoUrl = e.target?.result as string
      }
      reader.readAsDataURL(this.selectedFile)
    }
  }

  onSubmit() {
    if (this.stagiaireForm.valid) {
      this.loading = true

      const formData = this.stagiaireForm.value

      // Simulation de l'enregistrement
      setTimeout(() => {
        this.loading = false

        const message = this.isEditMode ? "Stagiaire mis à jour avec succès!" : "Stagiaire ajouté avec succès!"

        this.snackBar.open(message, "Fermer", {
          duration: 3000,
          panelClass: ["success-snackbar"],
        })

        this.router.navigate(["/stagiaires"])
      }, 1000)
    }
  }
}
