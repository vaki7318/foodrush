import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
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
  nbArticlesPanier = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.utilisateur = this.authService.getUtilisateurConnecte();
    this.mettreAJourPanier();
    this.cdr.detectChanges();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.utilisateur = this.authService.getUtilisateurConnecte();
      this.mettreAJourPanier();
      this.cdr.detectChanges();
    });
  }

  mettreAJourPanier(): void {
    const data = localStorage.getItem('panier');
    const panier = data ? JSON.parse(data) : [];

    this.nbArticlesPanier = panier.reduce(
      (total: number, item: { quantite: number }) => total + item.quantite,
      0
    );

    this.cdr.detectChanges();
  }

  @HostListener('window:panierUpdated')
  onPanierUpdated(): void {
    this.mettreAJourPanier();
  }

  logout(): void {
    this.authService.logout();
    this.utilisateur = null;
    this.cdr.detectChanges();
    this.router.navigate(['/home']);
  }
}
