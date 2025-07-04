import { Injectable } from "@angular/core"
import { type HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { User } from "../models/user.model"

export interface UtilisateursResponse {
  data: User[]
  total: number
  page: number
  limit: number
}

export interface UtilisateursFilters {
  page?: number
  limit?: number
  search?: string
  role?: string
  etat?: string
}

@Injectable({
  providedIn: "root",
})
export class UtilisateursService {
  private readonly API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) {}

  getUtilisateurs(filters: UtilisateursFilters = {}): Observable<UtilisateursResponse> {
    let params = new HttpParams()

    if (filters.page) params = params.set("page", filters.page.toString())
    if (filters.limit) params = params.set("limit", filters.limit.toString())
    if (filters.search) params = params.set("search", filters.search)
    if (filters.role) params = params.set("role", filters.role)
    if (filters.etat) params = params.set("etat", filters.etat)

    return this.http.get<UtilisateursResponse>(`${this.API_URL}/utilisateurs`, { params })
  }

  getUtilisateur(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/utilisateurs/${id}`)
  }

  createUtilisateur(utilisateur: Omit<User, "id" | "created_at">): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/utilisateurs`, utilisateur)
  }

  updateUtilisateur(id: number, utilisateur: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/utilisateurs/${id}`, utilisateur)
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/utilisateurs/${id}`)
  }

  toggleEtat(id: number): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/utilisateurs/${id}/toggle-etat`, {})
  }
}
