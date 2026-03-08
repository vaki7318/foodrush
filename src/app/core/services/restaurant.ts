import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private url = 'assets/mock/restaurants.json';

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.url).pipe(
      map(restaurants => {
        const restaurantsLocaux = this.getRestaurantsLocaux();
        return [...restaurants, ...restaurantsLocaux];
      })
    );
  }

  getRestaurantById(id: number): Observable<Restaurant | undefined> {
    return this.getRestaurants().pipe(
      map(restaurants => restaurants.find(r => r.id === id))
    );
  }

  getRestaurantsByCategorie(categorie: string): Observable<Restaurant[]> {
    return this.getRestaurants().pipe(
      map(restaurants => restaurants.filter(r => r.categorie === categorie))
    );
  }

  getRestaurantsByProprietaire(proprietaireId: number): Observable<Restaurant[]> {
    return this.getRestaurants().pipe(
      map(restaurants => restaurants.filter(r => r.proprietaireId === proprietaireId))
    );
  }

  private getRestaurantsLocaux(): Restaurant[] {
    const data = localStorage.getItem('restaurants_ajoutes');
    return data ? JSON.parse(data) : [];
  }
}
