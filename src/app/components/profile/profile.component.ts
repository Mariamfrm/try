import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import type { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Mon profil</h1>
        <p class="page-subtitle">Gérez vos informations personnelles et paramètres de compte</p>
      </div>

      <div class="form-container">
        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>Informations du profil</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-column">
                  <mat-form-field appearance="outline">
                    <mat-label>Login</mat-label>
                    <input matInput formControlName="login" readonly>
                    <mat-icon matSuffix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email *</mat-label>
                    <input matInput type="email" formControlName="email" required>
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                      L'email est requis
                    </mat-error>
                    <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                      L'email n'est pas valide
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Rôle</mat-label>
                    <input matInput formControlName="role" readonly>
                    <mat-icon matSuffix>security</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-column">
                  <mat-form-field appearance="outline">
                    <mat-label>Ancien mot de passe</mat-label>
                    <input matInput type="password" formControlName="oldPassword" 
                           placeholder="Entrez votre ancien mot de passe">
                    <mat-icon matSuffix>lock</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Nouveau mot de passe</mat-label>
                    <input matInput type="password" formControlName="newPassword" 
                           placeholder="Entrez votre nouveau mot de passe">
                    <mat-icon matSuffix>lock_open</mat-icon>
                  </mat-form-field>

                  <div class="form-field">
                    <label class="form-label">Avatar</label>
                    <input type="file" accept="image/*" (change)="onFileSelected($event)" class="file-input">
                  </div>

                  <div class="current-avatar" *ngIf="currentAvatarUrl">
                    <label class="form-label">Avatar actuel</label>
                    <img [src]="currentAvatarUrl" alt="Avatar actuel" class="avatar-large">
                  </div>
                </div>
              </div>

              <div class="button-container">
                <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || loading">
                  <mat-icon>{{ loading ? 'hourglass_empty' : 'save' }}</mat-icon>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
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
export class ProfileComponent implements OnInit {
  profileForm: FormGroup
  loading = false
  selectedFile: File | null = null
  currentAvatarUrl: string | null = null

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.profileForm = this.fb.group({
      login: [""],
      email: ["", [Validators.required, Validators.email]],
      role: [""],
      oldPassword: [""],
      newPassword: [""],
    })
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser()
    if (user) {
      this.profileForm.patchValue({
        login: user.login,
        email: user.email,
        role: user.role === "ADMIN" ? "Administrateur" : "Visiteur",
      })

      if (user.avatar) {
        this.currentAvatarUrl = `assets/images/${user.avatar}`
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
    if (this.profileForm.valid) {
      this.loading = true

      const formData = this.profileForm.value

      // Validation des mots de passe
      if (formData.newPassword && !formData.oldPassword) {
        this.snackBar.open("Veuillez entrer votre ancien mot de passe", "Fermer", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
        this.loading = false
        return
      }

      // Simulation de la mise à jour
      setTimeout(() => {
        this.loading = false

        // Mettre à jour les données utilisateur
        this.authService.updateProfile({ email: formData.email })

        this.snackBar.open("Profil mis à jour avec succès!", "Fermer", {
          duration: 3000,
          panelClass: ["success-snackbar"],
        })

        // Réinitialiser les champs de mot de passe
        this.profileForm.patchValue({
          oldPassword: "",
          newPassword: "",
        })
      }, 1000)
    }
  }
}
