import { Injectable } from "@angular/core"
import type { CanActivate, Router } from "@angular/router"
import type { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true
    } else {
      this.router.navigate(["/dashboard"])
      return false
    }
  }
}
