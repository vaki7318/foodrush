import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RestaurantService } from '../../../core/services/restaurant';
import { AuthService } from '../../../core/services/auth';
import { Restaurant } from '../../../core/models/restaurant';

@Component({
  selector: 'app-gestion-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './gestion-restaurants.html',
  styleUrl: './gestion-restaurants.scss'
})
export class GestionRestaurantsComponent implements OnInit {

  restaurants = signal<Restaurant[]>([]);
  chargement = true;
  afficherFormulaire = false;
  modeEdition = false;
  submittedRestaurant = false;
  telephoneErreur = '';

  categoriesDisponibles = ['Mexicain', 'Français', 'Italien', 'Japonais', 'Chinois', 'Indien', 'Libanais', 'Américain', 'Africain', 'Autre'];

  restaurantForm: Restaurant = {
    id: 0,
    nom: '',
    description: '',
    adresse: '',
    telephone: '',
    photo: '',
    categorie: '',
    proprietaireId: ''
  };
  adresseLigne = '';
  ville = '';

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();

    if (!utilisateur) {
      this.restaurants.set([]);
      this.chargement = false;
      return;
    }

    this.restaurantService.getRestaurantsByProprietaire(utilisateur.email).subscribe({
      next: (data) => { this.restaurants.set(data); this.chargement = false; },
      error: () => {
        this.chargement = false;
        this.snackBar.open('Erreur lors du chargement des restaurants', undefined, { duration: 3000 });
      }
    });
  }

  ouvrirFormulaire(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();
    this.modeEdition = false;
    this.submittedRestaurant = false;
    this.telephoneErreur = '';
    this.restaurantForm = {
      id: 0,
      nom: '',
      description: '',
      adresse: '',
      telephone: '',
      photo: '',
      categorie: '',
      proprietaireId: utilisateur!.email
    };
    this.afficherFormulaire = true;
    this.adresseLigne = '';
    this.ville = '';
  }

  editerRestaurant(restaurant: Restaurant): void {
    this.modeEdition = true;
    this.restaurantForm = { ...restaurant };
    if (restaurant.adresse) {
      const parties = restaurant.adresse.split(',');
      this.adresseLigne = (parties[0] || '').trim();
      this.ville = (parties[1] || '').trim();
    }
    this.afficherFormulaire = true;
  }

  sauvegarderRestaurant(): void {
    this.submittedRestaurant = true;
    this.telephoneErreur = '';

    const nom = (this.restaurantForm.nom || '').trim();
    const categorie = (this.restaurantForm.categorie || '').trim();
    const telephone = (this.restaurantForm.telephone || '').trim();
    const adresseLigne = (this.adresseLigne || '').trim();
    const ville = (this.ville || '').trim();

    if (!nom || !categorie) {
      this.snackBar.open('Veuillez remplir le nom et la catégorie', undefined, { duration: 3000 });
      return;
    }

    if (!adresseLigne || !ville) {
      this.snackBar.open("Veuillez remplir l'adresse et la ville", undefined, { duration: 3000 });
      return;
    }

    if (adresseLigne.length < 5) {
      this.snackBar.open('Entrez une adresse valide.', undefined, { duration: 3000 });
      return;
    }

    const telDigits = telephone.replace(/\D/g, '');

    if (!telDigits) {
      this.telephoneErreur = 'Téléphone obligatoire.';
      this.snackBar.open(this.telephoneErreur, undefined, { duration: 3000 });
      return;
    }

    if (telDigits.length !== 10) {
      this.telephoneErreur = 'Téléphone invalide. Entrez 10 chiffres (ex: 819-000-0000).';
      this.snackBar.open(this.telephoneErreur, undefined, { duration: 3000 });
      return;
    }

    const formattedTel = `${telDigits.slice(0, 3)}-${telDigits.slice(3, 6)}-${telDigits.slice(6)}`;
    const adresse = `${adresseLigne}, ${ville}`;

    const restaurantASauvegarder: Restaurant = {
      ...this.restaurantForm,
      nom,
      adresse,
      categorie,
      telephone: formattedTel
    };

    if (!restaurantASauvegarder.photo) {
      restaurantASauvegarder.photo = 'https://placehold.co/400x300?text=' + encodeURIComponent(nom);
    }

    if (this.modeEdition) {
      this.restaurantService.updateRestaurant(restaurantASauvegarder.id, restaurantASauvegarder).subscribe({
        next: (updated) => {
          const liste = this.restaurants();
          const index = liste.findIndex(r => r.id === updated.id);
          if (index !== -1) {
            liste[index] = updated;
            this.restaurants.set([...liste]);
          }
          this.snackBar.open('Restaurant modifié avec succès !', undefined, { duration: 2000 });
          this.afficherFormulaire = false;
        },
        error: () => this.snackBar.open('Erreur lors de la modification', undefined, { duration: 3000 })
      });
    } else {
      this.restaurantService.createRestaurant(restaurantASauvegarder).subscribe({
        next: (created) => {
          this.restaurants.set([...this.restaurants(), created]);
          this.snackBar.open('Restaurant ajouté avec succès !', undefined, { duration: 2000 });
          this.afficherFormulaire = false;
        },
        error: () => this.snackBar.open("Erreur lors de l'ajout du restaurant", undefined, { duration: 3000 })
      });
    }
  }

  supprimerRestaurant(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce restaurant ?')) return;

    this.restaurantService.deleteRestaurant(id).subscribe({
      next: () => {
        this.restaurants.set(this.restaurants().filter(r => r.id !== id));
        this.snackBar.open('Restaurant supprimé', undefined, { duration: 2000 });
      },
      error: () => this.snackBar.open('Erreur lors de la suppression', undefined, { duration: 3000 })
    });
  }

  formatTelephone(): void {
    const digits = (this.restaurantForm.telephone || '').replace(/\D/g, '').slice(0, 10);

    let formatted = digits;
    if (digits.length > 3 && digits.length <= 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    this.restaurantForm.telephone = formatted;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      this.snackBar.open('Image trop lourde (max 2MB).', undefined, { duration: 2500 });
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.restaurantForm.photo = String(reader.result);
    };

    reader.onerror = () => {
      this.snackBar.open("Erreur lors du chargement de l'image.", undefined, { duration: 2500 });
    };

    reader.readAsDataURL(file);
  }

  annuler(): void {
    this.afficherFormulaire = false;
    this.submittedRestaurant = false;
    this.telephoneErreur = '';
  }
}
