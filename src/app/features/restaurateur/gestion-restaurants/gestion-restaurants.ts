import { Component, OnInit, signal, NgZone } from '@angular/core';
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
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();

    if (!utilisateur) {
      // sécurité: si pas connecté, on n'affiche rien
      this.restaurants.set([]);
      return;
    }

    // getRestaurants() contient déjà JSON + localStorage
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        const mesRestaurants = data.filter(r => r.proprietaireId === utilisateur.uid);
        this.restaurants.set(mesRestaurants);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  getRestaurantsLocaux(): Restaurant[] {
    const data = localStorage.getItem('restaurants_ajoutes');
    return data ? JSON.parse(data) : [];
  }

  ouvrirFormulaire(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();
    this.modeEdition = false;
    this.submittedRestaurant = false;
    this.telephoneErreur = '';
    this.restaurantForm = {
      id: Date.now(),
      nom: '',
      description: '',
      adresse: '',
      telephone: '',
      photo: '',
      categorie: '',
      proprietaireId: utilisateur!.uid
    };
    this.afficherFormulaire = true;
    this.adresseLigne = '';
    this.ville = '';
  }

  editerRestaurant(restaurant: Restaurant): void {
    this.modeEdition = true;
    this.restaurantForm = { ...restaurant };
    // Essaie de découper l'adresse existante : "123 Rue..., Ville "
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

    // Nettoyage des champs
    const nom = (this.restaurantForm.nom || '').trim();
    const categorie = (this.restaurantForm.categorie || '').trim();
    const telephone = (this.restaurantForm.telephone || '').trim();

    const adresseLigne = (this.adresseLigne || '').trim();
    const ville = (this.ville || '').trim();

    // Validation adresse découpée
    if (!nom || !categorie) {
      this.snackBar.open("Veuillez remplir le nom et la catégorie", undefined, {
        duration: 3000,
      });
      return;
    }

    if (!adresseLigne || !ville) {
      this.snackBar.open("Veuillez remplir l'adresse et la ville", undefined, {
        duration: 3000,
      });
      return;
    }

    if (adresseLigne.length < 5) {
      this.snackBar.open("Entrez une adresse valide.", undefined, {
        duration: 3000,
      });
      return;
    }


    // Téléphone obligatoire
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

    // Format téléphone standard
    const formattedTel = `${telDigits.slice(0, 3)}-${telDigits.slice(3, 6)}-${telDigits.slice(6)}`;

    // Construit l'adresse finale
    const adresse = `${adresseLigne}, ${ville}`;

    // On remet les valeurs nettoyées dans le form (optionnel mais propre)
    this.restaurantForm.nom = nom;
    this.restaurantForm.adresse = adresse;
    this.restaurantForm.categorie = categorie;
    this.restaurantForm.telephone = formattedTel;

    // Copie de l'objet
    const restaurantASauvegarder = { ...this.restaurantForm };

    // Photo par défaut si vide
    if (!restaurantASauvegarder.photo) {
      restaurantASauvegarder.photo =
        'https://placehold.co/400x300?text=' + encodeURIComponent(restaurantASauvegarder.nom);
    }

    const liste = this.restaurants();

    if (this.modeEdition) {
      const index = liste.findIndex(r => r.id === restaurantASauvegarder.id);
      if (index !== -1) {
        liste[index] = restaurantASauvegarder;
        this.restaurants.set([...liste]);
      }
      this.snackBar.open('Restaurant modifié avec succès !', undefined, { duration: 2000 });
    } else {
      this.restaurants.set([...liste, restaurantASauvegarder]);
      this.snackBar.open('Restaurant ajouté avec succès !', undefined, { duration: 2000 });
    }

    // Sauvegarde localStorage (ta logique inchangée)
    const restaurantsLocauxAutres = this.getRestaurantsLocaux()
      .filter(r => r.proprietaireId !== this.restaurantForm.proprietaireId);

    const restaurantsNouveaux = this.restaurants().filter(r => r.id > 1000);

    localStorage.setItem(
      'restaurants_ajoutes',
      JSON.stringify([...restaurantsLocauxAutres, ...restaurantsNouveaux])
    );

    this.afficherFormulaire = false;
  }

  supprimerRestaurant(id: number): void {
    const confirmation = confirm('Voulez-vous vraiment supprimer ce restaurant ?');

    if (!confirmation) {
      return;
    }

    this.restaurants.set(this.restaurants().filter(r => r.id !== id));
    const restaurantsLocaux = this.getRestaurantsLocaux().filter(r => r.id !== id);
    localStorage.setItem('restaurants_ajoutes', JSON.stringify(restaurantsLocaux));
    this.snackBar.open('Restaurant supprimé', undefined, { duration: 2000 });
  }

  formatTelephone(): void {
    // garde seulement les chiffres
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

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Sécurité: taille max (ex: 2MB) pour éviter localStorage trop gros
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.snackBar.open('Image trop lourde (max 2MB).', undefined, { duration: 2500 });
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      // reader.result est un "data URL" (base64) utilisable directement dans <img src="...">
      this.restaurantForm.photo = String(reader.result);
    };

    reader.onerror = () => {
      this.snackBar.open('Erreur lors du chargement de l’image.', undefined, { duration: 2500 });
    };

    reader.readAsDataURL(file);
  }

  annuler(): void {
    this.afficherFormulaire = false;
    this.submittedRestaurant = false;
    this.telephoneErreur = '';
  }
}
