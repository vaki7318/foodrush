import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth';
import { Utilisateur } from '../../core/models/utilisateur';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.scss'
})
export class ProfilComponent implements OnInit {

  utilisateur: Utilisateur | null = null;
  nom = '';
  email = '';
  telephone = '';
  motDePasseActuel = '';
  nouveauMotDePasse = '';
  erreur = '';
  modeEdition = false;
  modeChangementMdp = false;
  cacheMotDePasse = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.utilisateur = this.authService.getUtilisateurConnecte();
    if (!this.utilisateur) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    if (this.utilisateur) {
      this.nom = this.utilisateur.nom;
      this.email = this.utilisateur.email;
      this.telephone = this.utilisateur.telephone || '';
    }
  }

  activerEdition(): void {
    this.modeEdition = true;
    this.erreur = '';
  }

  annulerEdition(): void {
    this.modeEdition = false;
    this.erreur = '';
    this.chargerDonnees();
  }

  sauvegarderProfil(): void {
    this.erreur = '';

    if (!this.nom.trim() || this.nom.trim().length < 2) {
      this.erreur = 'Le nom doit contenir au moins 2 caractères.';
      return;
    }

    if (!this.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.erreur = 'Email invalide.';
      return;
    }

    this.authService.mettreAJourProfilBackend({
      nom: this.nom.trim(),
      email: this.email.trim(),
      telephone: this.telephone.trim()
    }).subscribe({
      next: (utilisateur) => {
        this.utilisateur = utilisateur;
        this.modeEdition = false;
        this.chargerDonnees();
        this.snackBar.open('Profil mis à jour avec succès !', undefined, {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erreur = err?.error?.message || 'Erreur lors de la mise à jour du profil.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleChangementMdp(): void {
    this.modeChangementMdp = !this.modeChangementMdp;
    this.motDePasseActuel = '';
    this.nouveauMotDePasse = '';
    this.erreur = '';
  }

  changerMotDePasse(): void {
    this.erreur = '';

    if (!this.utilisateur) return;

    if (this.nouveauMotDePasse.length < 4) {
      this.erreur = 'Le nouveau mot de passe doit contenir au moins 4 caractères.';
      return;
    }

    this.authService.reinitialiserMotDePasse(this.utilisateur.email, this.nouveauMotDePasse).subscribe({
      next: () => {
        this.modeChangementMdp = false;
        this.motDePasseActuel = '';
        this.nouveauMotDePasse = '';
        this.snackBar.open('Mot de passe modifié avec succès !', undefined, {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = 'Erreur lors de la modification du mot de passe.';
        this.cdr.detectChanges();
      }
    });
  }

  supprimerCompte(): void {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );
    if (!confirmed) return;

    this.authService.supprimerCompte().subscribe({
      next: () => {
        this.authService.logout();
        this.snackBar.open('Compte supprimé avec succès.', undefined, {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        this.router.navigate(['/home']);
      },
      error: () => {
        this.erreur = 'Erreur lors de la suppression du compte.';
        this.cdr.detectChanges();
      }
    });
  }
}
