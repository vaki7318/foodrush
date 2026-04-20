import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = environment.businessUrl;

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`);
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/restaurants/${id}`);
  }

  getRestaurantsByCategorie(categorie: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants/categorie/${categorie}`);
  }

  getRestaurantsByProprietaire(proprietaireId: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants/proprietaire/${proprietaireId}`);
  }

  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.apiUrl}/restaurants`, restaurant);
  }

  updateRestaurant(id: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.apiUrl}/restaurants/${id}`, restaurant);
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/restaurants/${id}`);
  }
}
