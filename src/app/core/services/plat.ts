import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Plat } from '../models/plat';

@Injectable({
  providedIn: 'root'
})
export class PlatService {

  private url = 'assets/mock/plats.json';

  constructor(private http: HttpClient) {}

  // Lit les plats ajoutés localement (en évitant les erreurs côté "server")
  private getPlatsLocaux(): Plat[] {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem('plats_ajoutes');
    const plats = data ? JSON.parse(data) : [];

    // Normalisation: on force les champs numériques
    return plats.map((p: any) => ({
      ...p,
      id: Number(p.id),
      prix: Number(p.prix),
      restaurantId: Number(p.restaurantId)
    }));
  }

  getPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>(this.url).pipe(
      map((platsJSON) => {
        const platsLocaux = this.getPlatsLocaux();

        // Fusion + anti-doublon par id
        const mapById = new Map<number, Plat>();

        [...platsJSON, ...platsLocaux].forEach((p) => {
          mapById.set(Number(p.id), {
            ...p,
            id: Number(p.id),
            prix: Number(p.prix),
            restaurantId: Number(p.restaurantId)
          });
        });

        return Array.from(mapById.values());
      })
    );
  }

  getPlatsByRestaurant(restaurantId: number): Observable<Plat[]> {
    return this.getPlats().pipe(
      map((plats) => plats.filter(p => p.restaurantId === restaurantId))
    );
  }

  getPlatById(id: number): Observable<Plat | undefined> {
    return this.getPlats().pipe(
      map((plats) => plats.find(p => p.id === id))
    );
  }
}
