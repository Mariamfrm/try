import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import type { Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBarModule, type MatSnackBar } from "@angular/material/snack-bar"
import type { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="login-header">
            <mat-icon class="login-icon">school</mat-icon>
            <h1>Gestion des Stagiaires</h1>
            <p>Connectez-vous à votre compte</p>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Login</mat-label>
              <input matInput formControlName="login" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('login')?.hasError('required')">
                Le login est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Le mot de passe est requis
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || loading" class="login-button">
              <mat-icon *ngIf="loading">hourglass_empty</mat-icon>
              <mat-icon *ngIf="!loading">login</mat-icon>
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
          
          <div class="demo-accounts">
            <h3>Comptes de démonstration :</h3>
            <p><strong>Admin:</strong> admin / 123</p>
            <p><strong>Visiteur:</strong> visiteur / 123</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2c3e50, #27ae60);
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .login-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-color);
      margin-bottom: 16px;
    }

    .login-header h1 {
      margin: 0 0 8px 0;
      color: var(--primary-color);
    }

    .login-header p {
      margin: 0;
      color: #666;
    }

    .login-button {
      width: 100%;
      height: 48px;
      margin-top: 16px;
    }

    .demo-accounts {
      margin-top: 24px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      text-align: center;
    }

    .demo-accounts h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
    }

    .demo-accounts p {
      margin: 4px 0;
      font-size: 12px;
      color: #888;
    }
  `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      login: ["", Validators.required],
      password: ["", Validators.required],
    })

    // Rediriger si déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/dashboard"])
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false
          this.router.navigate(["/dashboard"])
        },
        error: (error) => {
          this.loading = false
          this.snackBar.open("Login ou mot de passe incorrect", "Fermer", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    }
  }
}
