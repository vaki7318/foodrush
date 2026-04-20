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

    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data.filter(r => r.proprietaireId === utilisateur!.uid);

        // Si le restaurateur a au moins un restaurant, on sélectionne le premier par défaut
        if (this.restaurants.length > 0) {
          this.restaurantSelectionneId = this.restaurants[0].id;
          this.chargerPlats();
        } else {
          this.restaurantSelectionneId = null;
          this.plats = [];
        }

        this.cdr.detectChanges();
      }
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
      }
    });
  }

  getPlatsLocaux(): Plat[] {
    const data = localStorage.getItem('plats_ajoutes');
    return data ? JSON.parse(data) : [];
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
      id: Date.now(),
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
    console.log('sauvegarderPlat appelé', this.platForm);

    if (!this.platForm.nom || !this.platForm.categorie) {
      this.snackBar.open('Veuillez remplir le nom et la catégorie', 'OK', { duration: 3000 });
      return;
    }

    if (this.platForm.prix <= 0) {
      this.snackBar.open('Veuillez entrer un prix valide', 'OK', { duration: 3000 });
      return;
    }

    const platASauvegarder = {
      ...this.platForm,
      restaurantId: Number(this.platForm.restaurantId)
    };

    if (!platASauvegarder.photo) {
      platASauvegarder.photo = 'https://placehold.co/300x200?text=' + platASauvegarder.nom;
    }

    if (this.modeEdition) {
      const index = this.plats.findIndex(p => p.id === platASauvegarder.id);
      if (index !== -1) {
        this.plats[index] = platASauvegarder;
      }
      this.snackBar.open('Plat modifié avec succès !', 'OK', { duration: 2000 });
    } else {
      this.plats = [...this.plats, platASauvegarder];
      this.snackBar.open('Plat ajouté avec succès !', 'OK', { duration: 2000 });
    }

    // Sauvegarder les plats ajoutés dans localStorage
    const platsLocauxAutresRestaurants = this.getPlatsLocaux()
      .filter(p => p.restaurantId !== platASauvegarder.restaurantId);
    const platsNouveaux = this.plats.filter(p => p.id > 1000);
    localStorage.setItem('plats_ajoutes', JSON.stringify([...platsLocauxAutresRestaurants, ...platsNouveaux]));

    this.afficherFormulaire = false;
    this.cdr.detectChanges();
  }

  supprimerPlat(id: number): void {
    const ok = confirm("Confirmer la suppression de ce plat ?");
    if (!ok) return;

    this.plats = this.plats.filter(p => p.id !== id);

    const platsLocaux = this.getPlatsLocaux().filter(p => p.id !== id);
    localStorage.setItem('plats_ajoutes', JSON.stringify(platsLocaux));

    this.snackBar.open('Plat supprimé', 'OK', { duration: 2000 });
    this.cdr.detectChanges();
  }
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.snackBar.open("Veuillez choisir une image.", 'OK', { duration: 2500 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.platForm.photo = String(reader.result); // base64 image
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
