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
import type { User } from "../../../models/user.model"

@Component({
  selector: "app-utilisateur-form",
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
        <button mat-stroked-button routerLink="/utilisateurs" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Retour à la liste
        </button>
        <h1 class="page-title">{{ isEditMode ? 'Éditer utilisateur' : 'Nouvel utilisateur' }}</h1>
        <p class="page-subtitle">{{ isEditMode ? 'Modifiez les informations de l\'utilisateur' : 'Ajoutez un nouvel utilisateur au système' }}</p>
      </div>

      <div class="form-container">
        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>Informations de l'utilisateur</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="utilisateurForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-column">
                  <mat-form-field appearance="outline">
                    <mat-label>Login *</mat-label>
                    <input matInput formControlName="login" required>
                    <mat-error *ngIf="utilisateurForm.get('login')?.hasError('required')">
                      Le login est requis
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email *</mat-label>
                    <input matInput type="email" formControlName="email" required>
                    <mat-error *ngIf="utilisateurForm.get('email')?.hasError('required')">
                      L'email est requis
                    </mat-error>
                    <mat-error *ngIf="utilisateurForm.get('email')?.hasError('email')">
                      L'email n'est pas valide
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" *ngIf="!isEditMode">
                    <mat-label>Mot de passe *</mat-label>
                    <input matInput type="password" formControlName="password" required>
                    <mat-error *ngIf="utilisateurForm.get('password')?.hasError('required')">
                      Le mot de passe est requis
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-column">
                  <mat-form-field appearance="outline">
                    <mat-label>Rôle *</mat-label>
                    <mat-select formControlName="role" required>
                      <mat-option value="">Sélectionnez un rôle</mat-option>
                      <mat-option value="ADMIN">Administrateur</mat-option>
                      <mat-option value="VISITEUR">Visiteur</mat-option>
                    </mat-select>
                    <mat-error *ngIf="utilisateurForm.get('role')?.hasError('required')">
                      Le rôle est requis
                    </mat-error>
                  </mat-form-field>

                  <div class="form-field">
                    <label class="form-label">Avatar</label>
                    <input type="file" accept="image/*" (change)="onFileSelected($event)" class="file-input">
                    <p class="help-text">
                      Si vous ne téléchargez pas d'avatar, une image par défaut sera attribuée.
                    </p>
                  </div>

                  <div class="current-avatar" *ngIf="currentAvatarUrl">
                    <label class="form-label">Avatar actuel</label>
                    <img [src]="currentAvatarUrl" alt="Avatar actuel" class="avatar-large">
                  </div>
                </div>
              </div>

              <div class="button-container">
                <button mat-raised-button color="primary" type="submit" [disabled]="utilisateurForm.invalid || loading">
                  <mat-icon>{{ loading ? 'hourglass_empty' : 'save' }}</mat-icon>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button mat-stroked-button type="button" routerLink="/utilisateurs">
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

    .current-avatar {
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
export class UtilisateurFormComponent implements OnInit {
  utilisateurForm: FormGroup
  isEditMode = false
  utilisateurId: number | null = null
  loading = false
  selectedFile: File | null = null
  currentAvatarUrl: string | null = null

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.utilisateurForm = this.fb.group({
      login: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
      role: ["", Validators.required],
    })
  }

  ngOnInit() {
    // Vérifier les permissions
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/utilisateurs"])
      return
    }

    // Vérifier si c'est un mode édition
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.utilisateurId = Number.parseInt(id)
      this.loadUtilisateur()
      // En mode édition, le mot de passe n'est pas requis
      this.utilisateurForm.get("password")?.clearValidators()
    } else {
      // En mode création, le mot de passe est requis
      this.utilisateurForm.get("password")?.setValidators([Validators.required])
    }
    this.utilisateurForm.get("password")?.updateValueAndValidity()
  }

  loadUtilisateur() {
    if (!this.utilisateurId) return

    // Simulation des données pour la démonstration
    const mockUtilisateurs: User[] = [
      { id: 1, login: "admin", email: "admin@example.com", role: "ADMIN", etat: true, avatar: "img3.jpg" },
      { id: 2, login: "visiteur", email: "visiteur@example.com", role: "VISITEUR", etat: true, avatar: "img6.jpg" },
    ]

    const utilisateur = mockUtilisateurs.find((u) => u.id === this.utilisateurId)
    if (utilisateur) {
      this.utilisateurForm.patchValue({
        login: utilisateur.login,
        email: utilisateur.email,
        role: utilisateur.role,
      })

      if (utilisateur.avatar) {
        this.currentAvatarUrl = `assets/images/${utilisateur.avatar}`
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
        this.currentAvatarUrl = e.target?.result as string
      }
      reader.readAsDataURL(this.selectedFile)
    }
  }

  onSubmit() {
    if (this.utilisateurForm.valid) {
      this.loading = true

      const formData = this.utilisateurForm.value

      // Simulation de l'enregistrement
      setTimeout(() => {
        this.loading = false

        const message = this.isEditMode ? "Utilisateur mis à jour avec succès!" : "Utilisateur ajouté avec succès!"

        this.snackBar.open(message, "Fermer", {
          duration: 3000,
          panelClass: ["success-snackbar"],
        })

        this.router.navigate(["/utilisateurs"])
      }, 1000)
    }
  }
}
