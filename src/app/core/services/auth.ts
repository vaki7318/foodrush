import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'assets/mock/utilisateurs.json';
  private utilisateurConnecte: Utilisateur | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, motDePasse: string): Observable<Utilisateur | null> {
    return this.http.get<Utilisateur[]>(this.url).pipe(
      map(utilisateurs => {

        // Récupérer les utilisateurs inscrits en local
        const inscritsLocal = this.getUtilisateursLocaux();
        const tousLesUtilisateurs = [...utilisateurs, ...inscritsLocal];

        const user = tousLesUtilisateurs.find(
          u => u.email === email && u.motDePasse === motDePasse
        );

        if (user) {
          this.utilisateurConnecte = user;
          localStorage.setItem('utilisateur', JSON.stringify(user));
        }

        return user ?? null;
      })
    );
  }

  inscription(nouvelUtilisateur: Utilisateur): void {
    this.utilisateurConnecte = nouvelUtilisateur;
    localStorage.setItem('utilisateur', JSON.stringify(nouvelUtilisateur));

    // Sauvegarder dans la liste des inscrits locaux
    const inscrits = this.getUtilisateursLocaux();
    inscrits.push(nouvelUtilisateur);
    localStorage.setItem('utilisateurs_inscrits', JSON.stringify(inscrits));

    console.log('Nouvel utilisateur enregistré :', nouvelUtilisateur);
  }

  logout(): void {
    this.utilisateurConnecte = null;
    localStorage.removeItem('utilisateur');
  }

  getUtilisateurConnecte(): Utilisateur | null {
    if (this.utilisateurConnecte) {
      return this.utilisateurConnecte;
    }
    const data = localStorage.getItem('utilisateur');
    return data ? JSON.parse(data) : null;
  }

  estConnecte(): boolean {
    return this.getUtilisateurConnecte() !== null;
  }

  estClient(): boolean {
    return this.getUtilisateurConnecte()?.role === 'client';
  }

  estRestaurateur(): boolean {
    return this.getUtilisateurConnecte()?.role === 'restaurateur';
  }

  private getUtilisateursLocaux(): Utilisateur[] {
    const data = localStorage.getItem('utilisateurs_inscrits');
    return data ? JSON.parse(data) : [];
  }
}
