import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { PlatService } from '../../../core/services/plat';
import { RestaurantService } from '../../../core/services/restaurant';
import { AuthService } from '../../../core/services/auth';
import { Plat } from '../../../core/models/plat';
import { Restaurant } from '../../../core/models/restaurant';

@Component({
  selector: 'app-gestion-plats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './gestion-plats.html',
  styleUrl: './gestion-plats.scss'
})
export class GestionPlatsComponent implements OnInit {

  restaurants: Restaurant[] = [];
  restaurantSelectionneId: number | null = null;
  plats: Plat[] = [];
  afficherFormulaire = false;
  modeEdition = false;

  categoriesDisponibles = ['Entrée', 'Plat principal', 'Dessert', 'Boisson'];

  platForm: Plat = {
    id: 0,
    nom: '',
    description: '',
    prix: 0,
    photo: '',
    categorie: '',
    restaurantId: 0,
    disponible: true
  };

  constructor(
    private platService: PlatService,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();
    if (!utilisateur) return;

    this.restaurantService.getRestaurantsByProprietaire(utilisateur.email).subscribe({
      next: (data) => {
        this.restaurants = data;

        if (this.restaurants.length > 0) {
          this.restaurantSelectionneId = this.restaurants[0].id;
          this.chargerPlats();
        } else {
          this.restaurantSelectionneId = null;
          this.plats = [];
        }

        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Erreur lors du chargement des restaurants', 'OK', { duration: 3000 })
    });
  }

  chargerPlats(): void {
    if (!this.restaurantSelectionneId) {
      this.plats = [];
      return;
    }

    this.platService.getPlatsByRestaurant(this.restaurantSelectionneId).subscribe({
      next: (data) => {
        this.plats = data;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Erreur lors du chargement des plats', 'OK', { duration: 3000 })
    });
  }

  ouvrirFormulaire(): void {
    if (this.restaurants.length === 0) {
      this.snackBar.open("Vous n'avez pas encore de restaurant. Ajoutez un restaurant d'abord.", '', {
        duration: 3500
      });
      return;
    }

    this.modeEdition = false;
    this.platForm = {
      id: 0,
      nom: '',
      description: '',
      prix: 0,
      photo: '',
      categorie: '',
      restaurantId: this.restaurantSelectionneId || this.restaurants[0].id,
      disponible: true
    };
    this.afficherFormulaire = true;
    this.cdr.detectChanges();
  }

  editerPlat(plat: Plat): void {
    this.modeEdition = true;
    this.platForm = { ...plat };
    this.afficherFormulaire = true;
    this.cdr.detectChanges();
  }

  sauvegarderPlat(): void {
    if (!this.platForm.nom || !this.platForm.categorie) {
      this.snackBar.open('Veuillez remplir le nom et la catégorie', 'OK', { duration: 3000 });
      return;
    }

    if (this.platForm.prix <= 0) {
      this.snackBar.open('Veuillez entrer un prix valide', 'OK', { duration: 3000 });
      return;
    }

    const platASauvegarder: Plat = {
      ...this.platForm,
      restaurantId: Number(this.platForm.restaurantId)
    };

    if (!platASauvegarder.photo) {
      platASauvegarder.photo = 'https://placehold.co/300x200?text=' + encodeURIComponent(platASauvegarder.nom);
    }

    if (this.modeEdition) {
      this.platService.updatePlat(platASauvegarder.id, platASauvegarder).subscribe({
        next: (updated) => {
          const index = this.plats.findIndex(p => p.id === updated.id);
          if (index !== -1) this.plats[index] = updated;
          this.plats = [...this.plats];
          this.snackBar.open('Plat modifié avec succès !', 'OK', { duration: 2000 });
          this.afficherFormulaire = false;
          this.cdr.detectChanges();
        },
        error: () => this.snackBar.open('Erreur lors de la modification', 'OK', { duration: 3000 })
      });
    } else {
      this.platService.createPlat(platASauvegarder).subscribe({
        next: (created) => {
          this.plats = [...this.plats, created];
          this.snackBar.open('Plat ajouté avec succès !', 'OK', { duration: 2000 });
          this.afficherFormulaire = false;
          this.cdr.detectChanges();
        },
        error: () => this.snackBar.open("Erreur lors de l'ajout du plat", 'OK', { duration: 3000 })
      });
    }
  }

  supprimerPlat(id: number): void {
    if (!confirm('Confirmer la suppression de ce plat ?')) return;

    this.platService.deletePlat(id).subscribe({
      next: () => {
        this.plats = this.plats.filter(p => p.id !== id);
        this.snackBar.open('Plat supprimé', 'OK', { duration: 2000 });
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 })
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Veuillez choisir une image.', 'OK', { duration: 2500 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.platForm.photo = String(reader.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onRestaurantChange(): void {
    this.chargerPlats();
  }

  annuler(): void {
    this.afficherFormulaire = false;
    this.cdr.detectChanges();
  }
}
