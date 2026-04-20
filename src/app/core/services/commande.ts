import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl = environment.businessUrl;

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes`);
  }

  getCommandesByClient(clientId: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes/client/${clientId}`);
  }

  getCommandesByRestaurant(restaurantId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes/restaurant/${restaurantId}`);
  }

  ajouterCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/commandes`, commande);
  }

  mettreAJourStatut(commandeId: number, statut: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/commandes/${commandeId}/statut`, { statut });
  }
}
