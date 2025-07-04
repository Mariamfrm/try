import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatGridListModule } from "@angular/material/grid-list"
import type { AuthService } from "../../services/auth.service"
import type { HttpClient } from "@angular/common/http"

interface Stats {
  stagiaires: number
  filieres: number
  utilisateurs: number
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Tableau de bord</h1>
        <p class="page-subtitle">Bienvenue, {{ authService.getCurrentUser()?.login }}. Gérez vos stagiaires et filières efficacement.</p>
      </div>

      <!-- Section de bienvenue -->
      <mat-card class="welcome-card">
        <mat-card-content>
          <div class="welcome-content">
            <div class="welcome-text">
              <h2>Gestion de Stagiaires</h2>
              <p>Plateforme intuitive pour gérer vos stagiaires efficacement. 
                 Suivez leur progression, gérez les filières et communiquez facilement.</p>
              <div class="action-buttons">
                <button mat-raised-button color="primary" routerLink="/stagiaires">
                  <mat-icon>school</mat-icon>
                  Gérer les stagiaires
                </button>
                <button mat-raised-button color="accent" routerLink="/filieres">
                  <mat-icon>book</mat-icon>
                  Gérer les filières
                </button>
              </div>
            </div>
            <div class="welcome-logo">
              <div class="logo">DIM</div>
              <p>Gestion des Stagiaires</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Statistiques -->
      <mat-grid-list cols="3" rowHeight="200px" gutterSize="16px" class="stats-grid">
        <mat-grid-tile>
          <mat-card class="stats-card">
            <mat-card-content>
              <div class="stats-content">
                <mat-icon class="stats-icon">school</mat-icon>
                <div class="stats-number">{{ stats.stagiaires }}</div>
                <div class="stats-label">Stagiaires</div>
                <p class="stats-description">Total des stagiaires inscrits</p>
                <div class="stats-actions">
                  <button mat-button routerLink="/stagiaires">Voir tous</button>
                  <button mat-button routerLink="/stagiaires/nouveau" *ngIf="authService.isAdmin()">
                    <mat-icon>add</mat-icon>
                    Nouveau
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stats-card">
            <mat-card-content>
              <div class="stats-content">
                <mat-icon class="stats-icon">book</mat-icon>
                <div class="stats-number">{{ stats.filieres }}</div>
                <div class="stats-label">Filières</div>
                <p class="stats-description">Filières disponibles</p>
                <div class="stats-actions">
                  <button mat-button routerLink="/filieres">Voir toutes</button>
                  <button mat-button routerLink="/filieres/nouvelle" *ngIf="authService.isAdmin()">
                    <mat-icon>add</mat-icon>
                    Nouvelle
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile *ngIf="authService.isAdmin()">
          <mat-card class="stats-card">
            <mat-card-content>
              <div class="stats-content">
                <mat-icon class="stats-icon">people</mat-icon>
                <div class="stats-number">{{ stats.utilisateurs }}</div>
                <div class="stats-label">Utilisateurs</div>
                <p class="stats-description">Utilisateurs du système</p>
                <div class="stats-actions">
                  <button mat-button routerLink="/utilisateurs">Gérer</button>
                  <button mat-button routerLink="/utilisateurs/nouveau">
                    <mat-icon>add</mat-icon>
                    Nouveau
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile *ngIf="!authService.isAdmin()">
          <mat-card class="stats-card">
            <mat-card-content>
              <div class="stats-content">
                <mat-icon class="stats-icon">person</mat-icon>
                <div class="stats-number">1</div>
                <div class="stats-label">Mon Profil</div>
                <p class="stats-description">Gérez vos informations</p>
                <div class="stats-actions">
                  <button mat-button routerLink="/profile">
                    <mat-icon>settings</mat-icon>
                    Gérer mon profil
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Actions rapides -->
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Actions rapides</mat-card-title>
          <mat-card-subtitle>Accédez rapidement aux fonctionnalités principales</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-actions">
            <button mat-stroked-button class="quick-action-btn" routerLink="/stagiaires">
              <mat-icon>school</mat-icon>
              <span>Voir les stagiaires</span>
            </button>
            <button mat-stroked-button class="quick-action-btn" routerLink="/filieres">
              <mat-icon>book</mat-icon>
              <span>Gérer les filières</span>
            </button>
            <button mat-stroked-button class="quick-action-btn" routerLink="/stagiaires/nouveau" *ngIf="authService.isAdmin()">
              <mat-icon>add</mat-icon>
              <span>Nouveau stagiaire</span>
            </button>
            <button mat-stroked-button class="quick-action-btn" routerLink="/utilisateurs" *ngIf="authService.isAdmin()">
              <mat-icon>people</mat-icon>
              <span>Gérer utilisateurs</span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .welcome-card {
      background: linear-gradient(135deg, #2c3e50, #27ae60);
      color: white;
      margin-bottom: 24px;
    }

    .welcome-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
    }

    .welcome-text {
      flex: 1;
    }

    .welcome-text h2 {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 16px;
    }

    .welcome-text p {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
    }

    .welcome-logo {
      text-align: center;
      margin-left: 32px;
    }

    .logo {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .stats-grid {
      margin-bottom: 24px;
    }

    .stats-card {
      width: 100%;
      height: 100%;
    }

    .stats-content {
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stats-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-color);
      margin: 0 auto 16px;
    }

    .stats-number {
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .stats-label {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .stats-description {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 16px;
    }

    .stats-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .quick-action-btn {
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .quick-action-btn mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    @media (max-width: 768px) {
      .welcome-content {
        flex-direction: column;
        text-align: center;
      }

      .welcome-logo {
        margin-left: 0;
        margin-top: 24px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr !important;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  stats: Stats = {
    stagiaires: 0,
    filieres: 0,
    utilisateurs: 0,
  }

  constructor(
    public authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.loadStats()
  }

  private loadStats() {
    this.http.get<Stats>("http://localhost:3000/api/stats").subscribe({
      next: (stats) => {
        this.stats = stats
      },
      error: (error) => {
        console.error("Erreur lors du chargement des statistiques:", error)
        // Utiliser des données de démonstration en cas d'erreur
        this.stats = {
          stagiaires: 156,
          filieres: 12,
          utilisateurs: 8,
        }
      },
    })
  }
}
