import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import type { AuthService } from "./services/auth.service"
import type { Router } from "@angular/router"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <div class="app-container">
      <mat-toolbar *ngIf="authService.isAuthenticated()" class="toolbar">
        <span>Gestion des Stagiaires</span>
        <span class="spacer"></span>
        
        <button mat-button routerLink="/dashboard">
          <mat-icon>home</mat-icon>
          Accueil
        </button>
        
        <button mat-button routerLink="/stagiaires">
          <mat-icon>school</mat-icon>
          Stagiaires
        </button>
        
        <button mat-button routerLink="/filieres">
          <mat-icon>book</mat-icon>
          Filières
        </button>
        
        <button mat-button routerLink="/utilisateurs" *ngIf="authService.isAdmin()">
          <mat-icon>people</mat-icon>
          Utilisateurs
        </button>
        
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ authService.getCurrentUser()?.login }}
        </button>
        
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            Mon Profil
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Se déconnecter
          </button>
        </mat-menu>
      </mat-toolbar>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: #f5f7fa;
    }
    
    .toolbar button {
      margin-left: 8px;
    }
  `,
  ],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
