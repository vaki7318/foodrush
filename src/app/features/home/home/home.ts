import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RestaurantService } from '../../../core/services/restaurant';
import { Restaurant } from '../../../core/models/restaurant';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {

  restaurants: Restaurant[] = [];
  restaurantsFiltres: Restaurant[] = [];
  categories: string[] = [];
  categorieSelectionnee = 'Tous';

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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement restaurants', err)
    });
  }

  filtrerParCategorie(categorie: string): void {
    this.categorieSelectionnee = categorie;
    if (categorie === 'Tous') {
      this.restaurantsFiltres = this.restaurants;
    } else {
      this.restaurantsFiltres = this.restaurants.filter(r => r.categorie === categorie);
    }
    this.cdr.detectChanges();
  }
}
