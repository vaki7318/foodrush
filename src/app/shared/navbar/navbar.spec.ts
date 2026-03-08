import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Utilisateur } from '../../core/models/utilisateur';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {

  utilisateur: Utilisateur | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.utilisateur = this.authService.getUtilisateurConnecte();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.utilisateur = this.authService.getUtilisateurConnecte();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
    this.utilisateur = null;
  }
}
