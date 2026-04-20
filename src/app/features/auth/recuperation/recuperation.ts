import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';
import { Utilisateur } from '../../../core/models/utilisateur';

@Component({
  selector: 'app-recuperation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recuperation.html',
  styleUrl: './recuperation.scss'
})
export class RecuperationComponent {

  email = '';
  erreur = '';
  succes = false;
  nouveauMotDePasse = '';
  confirmMotDePasse = '';
  etape: 'email' | 'reset' = 'email';
  cacheMotDePasse = true;
  utilisateurTrouve: Utilisateur | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  verifierEmail(): void {
    this.erreur = '';

    if (!this.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.erreur = 'Veuillez entrer un email valide.';
      return;
    }

    // Simuler la vérification : on cherche l'email dans les utilisateurs
    this.authService.trouverParEmail(this.email).subscribe({
      next: (utilisateur) => {
        if (utilisateur) {
          this.utilisateurTrouve = utilisateur;
          this.etape = 'reset';
          this.snackBar.open('Email trouvé ! Définissez votre nouveau mot de passe.', undefined, {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        } else {
          this.erreur = 'Aucun compte associé à cet email.';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Une erreur est survenue. Veuillez réessayer.';
        this.cdr.detectChanges();
      }
    });
  }

  reinitialiserMotDePasse(): void {
    this.erreur = '';

    if (this.nouveauMotDePasse.length < 4) {
      this.erreur = 'Le mot de passe doit contenir au moins 4 caractères.';
      return;
    }

    if (this.nouveauMotDePasse !== this.confirmMotDePasse) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authService.reinitialiserMotDePasse(this.email, this.nouveauMotDePasse).subscribe({
      next: () => {
        this.succes = true;
        this.snackBar.open('Mot de passe réinitialisé avec succès !', undefined, {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: () => {
        this.erreur = 'Erreur lors de la réinitialisation.';
        this.cdr.detectChanges();
      }
    });
  }
}
