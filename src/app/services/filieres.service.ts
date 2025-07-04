import { Injectable } from "@angular/core"
import { type HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Filiere } from "../models/stagiaire.model"

export interface FilieresResponse {
  data: Filiere[]
  total: number
  page: number
  limit: number
}

export interface FilieresFilters {
  page?: number
  limit?: number
  search?: string
  niveau?: string
}

@Injectable({
  providedIn: "root",
})
export class FilieresService {
  private readonly API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) {}

  getFilieres(filters: FilieresFilters = {}): Observable<FilieresResponse> {
    let params = new HttpParams()

    if (filters.page) params = params.set("page", filters.page.toString())
    if (filters.limit) params = params.set("limit", filters.limit.toString())
    if (filters.search) params = params.set("search", filters.search)
    if (filters.niveau) params = params.set("niveau", filters.niveau)

    return this.http.get<FilieresResponse>(`${this.API_URL}/filieres`, { params })
  }

  getFiliere(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${this.API_URL}/filieres/${id}`)
  }

  createFiliere(filiere: Omit<Filiere, "id" | "created_at">): Observable<Filiere> {
    return this.http.post<Filiere>(`${this.API_URL}/filieres`, filiere)
  }

  updateFiliere(id: number, filiere: Omit<Filiere, "id" | "created_at">): Observable<Filiere> {
    return this.http.put<Filiere>(`${this.API_URL}/filieres/${id}`, filiere)
  }

  deleteFiliere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/filieres/${id}`)
  }
}
