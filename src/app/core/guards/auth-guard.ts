import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const utilisateur = this.authService.getUtilisateurConnecte();

    if (!utilisateur) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const rolesAutorises = route.data['roles'] as string[];
    if (rolesAutorises && !rolesAutorises.includes(utilisateur.role)) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
