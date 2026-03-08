import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RestaurantService } from '../../../core/services/restaurant';
import { PlatService } from '../../../core/services/plat';
import { AuthService } from '../../../core/services/auth';
import { Restaurant } from '../../../core/models/restaurant';
import { Plat } from '../../../core/models/plat';

@Component({
  selector: 'app-detail-restaurant',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './detail-restaurant.html',
  styleUrl: './detail-restaurant.scss'
})
export class DetailRestaurantComponent implements OnInit {

  restaurant: Restaurant | null = null;
  plats: Plat[] = [];
  platsFiltres: Plat[] = [];
  categories: string[] = [];
  categorieSelectionnee = 'Tous';
  panier: { plat: Plat, quantite: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private platService: PlatService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const panierData = localStorage.getItem('panier');
    this.panier = panierData ? JSON.parse(panierData) : [];

    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurant = data.find(r => r.id === id) || null;
        this.cdr.detectChanges();
      }
    });

    this.platService.getPlatsByRestaurant(id).subscribe({
      next: (data) => {
        this.plats = data;
        this.platsFiltres = this.plats;
        this.categories = ['Tous', ...new Set(this.plats.map(p => p.categorie))];
        this.cdr.detectChanges();
      }
    });
  }

  filtrerParCategorie(categorie: string): void {
    this.categorieSelectionnee = categorie;
    if (categorie === 'Tous') {
      this.platsFiltres = this.plats;
    } else {
      this.platsFiltres = this.plats.filter(p => p.categorie === categorie);
    }
    this.cdr.detectChanges();
  }

  ajouterAuPanier(plat: Plat): void {
    if (!this.authService.estConnecte()) {
      this.snackBar.open('Veuillez vous connecter pour commander', 'Connexion', { duration: 3000 })
        .onAction().subscribe(() => this.router.navigate(['/auth/login']));
      return;
    }

    const existant = this.panier.find(p => p.plat.id === plat.id);
    if (existant) {
      existant.quantite++;
    } else {
      this.panier.push({ plat, quantite: 1 });
    }

    localStorage.setItem('panier', JSON.stringify(this.panier));
    window.dispatchEvent(new Event('panierUpdated'));
    this.snackBar.open(`${plat.nom} ajouté au panier !`, 'OK', { duration: 2000 });
    this.cdr.detectChanges();
  }

  getQuantitePanier(platId: number): number {
    return this.panier.find(p => p.plat.id === platId)?.quantite || 0;
  }
}
