import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  nom: string;
  email: string;
  role: string;
  telephone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private utilisateurConnecte: Utilisateur | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, motDePasse: string): Observable<Utilisateur | null> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password: motDePasse })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            const user: Utilisateur = {
              uid: '',
              nom: response.nom,
              email: response.email,
              role: response.role as 'client' | 'restaurateur',
              telephone: response.telephone
            };
            this.utilisateurConnecte = user;
            localStorage.setItem('utilisateur', JSON.stringify(user));
          }
        }),
        map(response => response.token ? {
          uid: '',
          nom: response.nom,
          email: response.email,
          role: response.role as 'client' | 'restaurateur',
          telephone: response.telephone
        } : null)
      );
  }

  inscription(data: { nom: string; email: string; motDePasse: string; role: 'client' | 'restaurateur'; telephone?: string }): Observable<Utilisateur | null> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      nom: data.nom,
      email: data.email,
      password: data.motDePasse,
      role: data.role,
      telephone: data.telephone
    }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const user: Utilisateur = {
            uid: '',
            nom: response.nom,
            email: response.email,
            role: response.role as 'client' | 'restaurateur',
            telephone: response.telephone
          };
          this.utilisateurConnecte = user;
          localStorage.setItem('utilisateur', JSON.stringify(user));
        }
      }),
      map(response => response.token ? {
        uid: '',
        nom: response.nom,
        email: response.email,
        role: response.role as 'client' | 'restaurateur',
        telephone: response.telephone
      } : null)
    );
  }

  mettreAJourProfilBackend(data: { nom: string; email: string; telephone: string }): Observable<Utilisateur> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/auth/update`, data).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const user: Utilisateur = {
            uid: '',
            nom: response.nom,
            email: response.email,
            role: response.role as 'client' | 'restaurateur',
            telephone: response.telephone
          };
          this.utilisateurConnecte = user;
          localStorage.setItem('utilisateur', JSON.stringify(user));
        }
      }),
      map(response => ({
        uid: '',
        nom: response.nom,
        email: response.email,
        role: response.role as 'client' | 'restaurateur',
        telephone: response.telephone
      }))
    );
  }

  supprimerCompte(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/delete`);
  }

  logout(): void {
    this.utilisateurConnecte = null;
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
  }

  getUtilisateurConnecte(): Utilisateur | null {
    if (this.utilisateurConnecte) {
      return this.utilisateurConnecte;
    }
    const data = localStorage.getItem('utilisateur');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  estConnecte(): boolean {
    return this.getToken() !== null;
  }

  estClient(): boolean {
    return this.getUtilisateurConnecte()?.role === 'client';
  }

  estRestaurateur(): boolean {
    return this.getUtilisateurConnecte()?.role === 'restaurateur';
  }

  reinitialiserMotDePasse(email: string, nouveauMotDePasse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recover`, { email, nouveauMotDePasse });
  }

  mettreAJourProfil(utilisateur: Utilisateur): void {
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    this.utilisateurConnecte = utilisateur;
  }
}
