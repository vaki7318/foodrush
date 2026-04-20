import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plat } from '../models/plat';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatService {

  private apiUrl = environment.businessUrl;

  constructor(private http: HttpClient) {}

  getPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>(`${this.apiUrl}/plats`);
  }

  getPlatsByRestaurant(restaurantId: number): Observable<Plat[]> {
    return this.http.get<Plat[]>(`${this.apiUrl}/plats/restaurant/${restaurantId}`);
  }

  getPlatById(id: number): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}/plats/${id}`);
  }

  createPlat(plat: Plat): Observable<Plat> {
    return this.http.post<Plat>(`${this.apiUrl}/plats`, plat);
  }

  updatePlat(id: number, plat: Plat): Observable<Plat> {
    return this.http.put<Plat>(`${this.apiUrl}/plats/${id}`, plat);
  }

  deletePlat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/plats/${id}`);
  }
}
