import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import type { User, LoginRequest, LoginResponse } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "http://localhost:3000/api"
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser))
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response.user) {
          localStorage.setItem("currentUser", JSON.stringify(response.user))
          this.currentUserSubject.next(response.user)
        }
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "ADMIN"
  }

  updateProfile(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      this.currentUserSubject.next(updatedUser)
    }
  }
}
