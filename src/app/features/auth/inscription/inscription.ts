import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';
import { Utilisateur } from '../../../core/models/utilisateur';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
  ],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss'
})
export class InscriptionComponent {

  nom = '';
  prenoms = '';
  email = '';
  motDePasse = '';
  telephone = '';
  role: 'client' | 'restaurateur' = 'client';
  erreur = '';
  cacheMotDePasse = true;
  submitted = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  private isValidPassword(pwd: string): boolean {
    return pwd.length >= 4;
  }

  private isValidPhone(tel: string): boolean {
    return /^(\+?1\s?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/.test(tel);
  }

  inscrire(): void {
    this.submitted = true;
    this.erreur = '';

    if (!this.prenoms.trim() || this.prenoms.trim().length < 2) {
      this.erreur = 'Prénoms obligatoires (min 2 caractères).';
      return;
    }

    if (!this.nom.trim() || this.nom.trim().length < 2) {
      this.erreur = 'Nom obligatoire (min 2 caractères).';
      return;
    }

    // validation email simple (le champ HTML fera aussi une validation)
    if (!this.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.erreur = 'Email invalide.';
      return;
    }

    if (!this.isValidPassword(this.motDePasse)) {
      this.erreur = 'Le mot de passe doit contenir au moins 4 caractères.';
      return;
    }

    if (!this.isValidPhone(this.telephone)) {
      this.erreur = 'Téléphone invalide (ex: 514-000-0000).';
      return;
    }

    const nouvelUtilisateur: Utilisateur = {
      uid: '',
      nom: `${this.prenoms.trim()} ${this.nom.trim()}`,
      email: this.email.trim(),
      role: this.role,
      telephone: this.telephone.trim()
    };

    this.authService.inscription({
      nom: `${this.prenoms.trim()} ${this.nom.trim()}`,
      email: this.email.trim(),
      motDePasse: this.motDePasse,
      role: this.role,
      telephone: this.telephone.trim()
    }).subscribe({
      next: (utilisateur) => {
        if (utilisateur) {
          if (this.role === 'restaurateur') {
            this.router.navigate(['/restaurateur/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      error: (err) => {
        this.erreur = 'Erreur lors de l\'inscription.';
        this.snackBar.open(this.erreur, undefined, {
          duration: 4000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
      }
    });
  }
}
