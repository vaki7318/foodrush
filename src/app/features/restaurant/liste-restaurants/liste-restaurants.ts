import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RestaurantService } from '../../../core/services/restaurant';
import { Restaurant } from '../../../core/models/restaurant';

@Component({
  selector: 'app-liste-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './liste-restaurants.html',
  styleUrl: './liste-restaurants.scss'
})
export class ListeRestaurantsComponent implements OnInit {

  restaurants: Restaurant[] = [];
  restaurantsFiltres: Restaurant[] = [];
  categories: string[] = [];
  categorieSelectionnee = 'Tous';
  recherche = '';
  chargement = true;

  constructor(
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.restaurantsFiltres = data;
        this.categories = ['Tous', ...new Set(data.map(r => r.categorie))];
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.chargement = false;
        console.error('Erreur chargement restaurants', err);
        this.cdr.detectChanges();
      }
    });
  }

  filtrerParCategorie(categorie: string): void {
    this.categorieSelectionnee = categorie;
    this.appliquerFiltres();
  }

  rechercherRestaurant(): void {
    this.appliquerFiltres();
  }

  appliquerFiltres(): void {
    this.restaurantsFiltres = this.restaurants.filter(r => {
      const matchCategorie = this.categorieSelectionnee === 'Tous' || r.categorie === this.categorieSelectionnee;
      const matchRecherche = r.nom.toLowerCase().includes(this.recherche.toLowerCase()) ||
                             r.description.toLowerCase().includes(this.recherche.toLowerCase());
      return matchCategorie && matchRecherche;
    });
    this.cdr.detectChanges();
  }
}
