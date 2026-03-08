import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private url = 'assets/mock/commandes.json';

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.url);
  }

  getCommandesByClient(clientId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.url);
  }

  getCommandesByRestaurant(restaurantId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.url);
  }

  ajouterCommande(commande: Commande): void {
    const commandes = this.getCommandesEnMemoire();
    commandes.push(commande);
    localStorage.setItem('commandes', JSON.stringify(commandes));
    console.log('Commande enregistrée :', commande);
  }
  mettreAJourCommande(commande: Commande): void {
    const commandes = this.getCommandesEnMemoire();
    const index = commandes.findIndex(c => c.id === commande.id);
    if (index !== -1) {
      commandes[index] = commande;
      localStorage.setItem('commandes', JSON.stringify(commandes));
    }
    console.log('Commande mise à jour :', commande);
  }

  getCommandesEnMemoire(): Commande[] {
    const data = localStorage.getItem('commandes');
    return data ? JSON.parse(data) : [];
  }
}
