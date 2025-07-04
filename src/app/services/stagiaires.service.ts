import { Injectable } from "@angular/core"
import { type HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Stagiaire, StagiaireRequest } from "../models/stagiaire.model"

export interface StagiairesResponse {
  data: Stagiaire[]
  total: number
  page: number
  limit: number
}

export interface StagiairesFilters {
  page?: number
  limit?: number
  search?: string
  filiere_id?: number
}

@Injectable({
  providedIn: "root",
})
export class StagiairesService {
  private readonly API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) {}

  getStagiaires(filters: StagiairesFilters = {}): Observable<StagiairesResponse> {
    let params = new HttpParams()

    if (filters.page) params = params.set("page", filters.page.toString())
    if (filters.limit) params = params.set("limit", filters.limit.toString())
    if (filters.search) params = params.set("search", filters.search)
    if (filters.filiere_id) params = params.set("filiere_id", filters.filiere_id.toString())

    return this.http.get<StagiairesResponse>(`${this.API_URL}/stagiaires`, { params })
  }

  getStagiaire(id: number): Observable<Stagiaire> {
    return this.http.get<Stagiaire>(`${this.API_URL}/stagiaires/${id}`)
  }

  createStagiaire(stagiaire: StagiaireRequest): Observable<Stagiaire> {
    return this.http.post<Stagiaire>(`${this.API_URL}/stagiaires`, stagiaire)
  }

  updateStagiaire(id: number, stagiaire: StagiaireRequest): Observable<Stagiaire> {
    return this.http.put<Stagiaire>(`${this.API_URL}/stagiaires/${id}`, stagiaire)
  }

  deleteStagiaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/stagiaires/${id}`)
  }
}
