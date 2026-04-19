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

        // Récupérer les utilisateurs inscrits/modifiés en local
        const inscritsLocal = this.getUtilisateursLocaux();

        // Les utilisateurs locaux écrasent ceux du JSON (par email)
        const emailsLocaux = new Set(inscritsLocal.map(u => u.email));
        const utilisateursDuJson = utilisateurs.filter(u => !emailsLocaux.has(u.email));
        const tousLesUtilisateurs = [...utilisateursDuJson, ...inscritsLocal];

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

  trouverParEmail(email: string): Observable<Utilisateur | null> {
    return this.http.get<Utilisateur[]>(this.url).pipe(
      map(utilisateurs => {
        const inscritsLocal = this.getUtilisateursLocaux();
        const tousLesUtilisateurs = [...utilisateurs, ...inscritsLocal];
        return tousLesUtilisateurs.find(u => u.email === email) ?? null;
      })
    );
  }

  reinitialiserMotDePasse(email: string, nouveauMotDePasse: string, utilisateurOriginal?: Utilisateur): void {
    const inscrits = this.getUtilisateursLocaux();
    const index = inscrits.findIndex(u => u.email === email);
    if (index !== -1) {
      inscrits[index].motDePasse = nouveauMotDePasse;
    } else if (utilisateurOriginal) {
      // L'utilisateur vient du JSON mock, on crée une copie locale avec le nouveau mdp
      inscrits.push({ ...utilisateurOriginal, motDePasse: nouveauMotDePasse });
    } else {
      inscrits.push({ id: Date.now(), nom: '', email, motDePasse: nouveauMotDePasse, role: 'client' });
    }
    localStorage.setItem('utilisateurs_inscrits', JSON.stringify(inscrits));
  }

  mettreAJourProfil(utilisateur: Utilisateur): void {
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    this.utilisateurConnecte = utilisateur;

    // Mettre à jour ou créer dans la liste des inscrits locaux
    const inscrits = this.getUtilisateursLocaux();
    const index = inscrits.findIndex(u => u.id === utilisateur.id || u.email === utilisateur.email);
    if (index !== -1) {
      inscrits[index] = utilisateur;
    } else {
      inscrits.push(utilisateur);
    }
    localStorage.setItem('utilisateurs_inscrits', JSON.stringify(inscrits));
  }

  private getUtilisateursLocaux(): Utilisateur[] {
    const data = localStorage.getItem('utilisateurs_inscrits');
    return data ? JSON.parse(data) : [];
  }
}
