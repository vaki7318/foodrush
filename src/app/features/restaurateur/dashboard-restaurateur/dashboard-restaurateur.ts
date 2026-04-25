import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { RestaurantService } from '../../../core/services/restaurant';
import { PlatService } from '../../../core/services/plat';
import { CommandeService } from '../../../core/services/commande';
import { AuthService } from '../../../core/services/auth';
import { Restaurant } from '../../../core/models/restaurant';
import { Plat } from '../../../core/models/plat';
import { Commande } from '../../../core/models/commande';

@Component({
  selector: 'app-dashboard-restaurateur',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './dashboard-restaurateur.html',
  styleUrl: './dashboard-restaurateur.scss'
})
export class DashboardRestateurateurComponent implements OnInit, OnDestroy {

  restaurant: Restaurant | null = null;
  restaurants: Restaurant[] = [];
  restaurantSelectionne: Restaurant | null = null;
  plats: Plat[] = [];
  commandes: Commande[] = [];
  chargement = true;
  private routerSub!: Subscription;

  constructor(
    private restaurantService: RestaurantService,
    private platService: PlatService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerRestaurants();
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd && e.urlAfterRedirects.includes('/restaurateur/dashboard'))
    ).subscribe(() => this.chargerRestaurants());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  chargerRestaurants(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();
    if (!utilisateur) return;

    this.chargement = true;
    this.restaurantService.getRestaurantsByProprietaire(utilisateur.email).subscribe({
      next: (data) => {
        this.restaurants = data;
        if (this.restaurants.length > 0) {
          const selectionne = this.restaurantSelectionne
            ? this.restaurants.find(r => r.id === this.restaurantSelectionne!.id) ?? this.restaurants[0]
            : this.restaurants[0];
          this.restaurant = selectionne;
          this.restaurantSelectionne = selectionne;
          this.chargerDonnees(selectionne.id);
        }
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => { this.chargement = false; this.cdr.detectChanges(); }
    });
  }

  chargerDonnees(restaurantId: number): void {
    this.platService.getPlatsByRestaurant(restaurantId).subscribe({
      next: (plats) => {
        this.plats = plats;
        this.cdr.detectChanges();
      }
    });

    this.commandeService.getCommandesByRestaurant(restaurantId).subscribe({
      next: (commandes) => {
        this.commandes = commandes.sort((a, b) => b.id! - a.id!);
        this.cdr.detectChanges();
      }
    });
  }

  selectionnerRestaurant(restaurant: Restaurant): void {
    this.restaurant = restaurant;
    this.restaurantSelectionne = restaurant;
    this.chargerDonnees(restaurant.id);
  }

  getStatutLibelle(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'en_preparation': return 'En préparation';
      case 'livree': return 'Livrée';
      default: return statut;
    }
  }

  getStatutCouleur(statut: string): string {
    switch (statut) {
      case 'en_attente': return '#ff9800';
      case 'en_preparation': return '#3f51b5';
      case 'livree': return 'green';
      default: return 'grey';
    }
  }

  changerStatut(commande: Commande): void {
    let nouveauStatut = commande.statut;
    if (commande.statut === 'en_attente') {
      nouveauStatut = 'en_preparation';
    } else if (commande.statut === 'en_preparation') {
      nouveauStatut = 'livree';
    }
    this.commandeService.mettreAJourStatut(commande.id!, nouveauStatut).subscribe({
      next: (cmd) => {
        commande.statut = cmd.statut;
        this.cdr.detectChanges();
      }
    });
  }

  getBoutonStatut(statut: string): string {
    switch (statut) {
      case 'en_attente': return '🍳 Mettre en préparation';
      case 'en_preparation': return '✅ Marquer comme livrée';
      default: return '';
    }
  }

  getTotal(commande: Commande): number {
    return commande.lignes.reduce((total, ligne) =>
      total + ligne.prixUnitaire * ligne.quantite, 0);
  }

  getNombrePlatsDisponibles(): number {
    return this.plats.filter(p => p.disponible).length;
  }

  getCommandesEnAttente(): number {
    return this.commandes.filter(c => c.statut === 'en_attente').length;
  }
}
