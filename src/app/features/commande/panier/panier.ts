import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { CommandeService } from '../../../core/services/commande';
import { AuthService } from '../../../core/services/auth';
import { RestaurantService } from '../../../core/services/restaurant';
import { Restaurant } from '../../../core/models/restaurant';
import { Plat } from '../../../core/models/plat';
import { Commande, LigneCommande } from '../../../core/models/commande';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './panier.html',
  styleUrl: './panier.scss'
})
export class PanierComponent implements OnInit {

  panier: { plat: Plat, quantite: number }[] = [];
  adresseLivraison = '';
  submittedCommande = false;
  adresseErreur = '';
  restaurantsMap: Map<number, Restaurant> = new Map();

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('panier');
    this.panier = data ? JSON.parse(data) : [];
    this.chargerRestaurants();
    this.cdr.detectChanges();
  }

  chargerRestaurants(): void {
    const ids = [...new Set(this.panier.map(item => item.plat.restaurantId))];
    ids.forEach(id => {
      if (!this.restaurantsMap.has(id)) {
        this.restaurantService.getRestaurantById(id).subscribe({
          next: (r) => { this.restaurantsMap.set(id, r); this.cdr.detectChanges(); }
        });
      }
    });
  }

  getGroupes(): { restaurantId: number, items: { plat: Plat, quantite: number, globalIndex: number }[] }[] {
    const map = new Map<number, { plat: Plat, quantite: number, globalIndex: number }[]>();
    this.panier.forEach((item, globalIndex) => {
      if (!map.has(item.plat.restaurantId)) {
        map.set(item.plat.restaurantId, []);
      }
      map.get(item.plat.restaurantId)!.push({ ...item, globalIndex });
    });
    return Array.from(map.entries()).map(([restaurantId, items]) => ({ restaurantId, items }));
  }

  getTotalGroupe(restaurantId: number): number {
    return this.panier
      .filter(item => item.plat.restaurantId === restaurantId)
      .reduce((total, item) => total + item.plat.prix * item.quantite, 0);
  }

  augmenterQuantite(index: number): void {
    this.panier[index].quantite++;
    this.panier = [...this.panier];
    this.sauvegarderPanier();
    this.cdr.detectChanges();
  }

  diminuerQuantite(index: number): void {
    if (this.panier[index].quantite > 1) {
      this.panier[index].quantite--;
      this.panier = [...this.panier];
    } else {
      this.supprimerPlat(index);
    }
    this.sauvegarderPanier();
    this.cdr.detectChanges();
  }

  supprimerPlat(index: number): void {
    this.panier.splice(index, 1);
    this.panier = [...this.panier];
    this.sauvegarderPanier();
    this.cdr.detectChanges();
  }

  sauvegarderPanier(): void {
    localStorage.setItem('panier', JSON.stringify(this.panier));
    window.dispatchEvent(new Event('panierUpdated'));
  }

  getTotal(): number {
    return this.panier.reduce((total, item) => total + item.plat.prix * item.quantite, 0);
  }

  viderPanier(): void {
    this.panier = [];
    localStorage.removeItem('panier');
    window.dispatchEvent(new Event('panierUpdated'));
    this.cdr.detectChanges();
  }

  passerCommande(): void {
    this.submittedCommande = true;
    this.adresseErreur = '';

    const adresse = (this.adresseLivraison || '').trim();

    if (!adresse) {
      this.adresseErreur = 'Veuillez entrer une adresse de livraison.';
      this.snackBar.open(this.adresseErreur, undefined, { duration: 3000 });
      return;
    }

    if (adresse.length < 5) {
      this.adresseErreur = 'Adresse de livraison invalide.';
      this.snackBar.open(this.adresseErreur, undefined, { duration: 3000 });
      return;
    }

    if (this.panier.length === 0) {
      this.snackBar.open('Votre panier est vide', undefined, { duration: 3000 });
      return;
    }

    const utilisateur = this.authService.getUtilisateurConnecte();
    const groupes = this.getGroupes();
    const dateCommande = new Date().toISOString().split('T')[0];

    const commandes$ = groupes.map(groupe => {
      const lignes: LigneCommande[] = groupe.items.map(item => ({
        platId: item.plat.id,
        nomPlat: item.plat.nom,
        quantite: item.quantite,
        prixUnitaire: item.plat.prix
      }));

      const commande: Commande = {
        clientId: utilisateur!.email,
        restaurantId: groupe.restaurantId,
        lignes,
        statut: 'en_attente',
        dateCommande,
        adresseLivraison: adresse
      };

      return this.commandeService.ajouterCommande(commande);
    });

    forkJoin(commandes$).subscribe({
      next: () => {
        this.viderPanier();
        const nb = groupes.length;
        this.snackBar.open(
          nb > 1 ? `${nb} commandes passées avec succès !` : 'Commande passée avec succès !',
          undefined,
          { duration: 3000 }
        );
        this.router.navigate(['/commande/mes-commandes']);
      },
      error: () => this.snackBar.open('Erreur lors de la commande, veuillez réessayer.', undefined, { duration: 3000 })
    });
  }
}
