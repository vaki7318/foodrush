import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommandeService } from '../../../core/services/commande';
import { AuthService } from '../../../core/services/auth';
import { Commande } from '../../../core/models/commande';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './mes-commandes.html',
  styleUrl: './mes-commandes.scss'
})
export class MesCommandesComponent implements OnInit {

  commandes: Commande[] = [];

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();
    console.log('Utilisateur connecté:', utilisateur);

    if (utilisateur) {
      this.commandeService.getCommandesByClient(utilisateur.email).subscribe({
        next: (data) => {
          console.log('Mes commandes:', data);
          this.commandes = data.sort((a, b) => b.id! - a.id!);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur chargement commandes', err)
      });
    }
  }

  getStatutLibelle(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'en_preparation': return 'En préparation';
      case 'livree': return 'Livrée';
      default: return statut;
    }
  }

  getStatutCouleur(statut: string): string {
    switch (statut) {
      case 'en_attente': return '#ff9800';
      case 'en_preparation': return '#3f51b5';
      case 'livree': return 'green';
      default: return 'grey';
    }
  }

  getTotal(commande: Commande): number {
    return commande.lignes.reduce((total, ligne) =>
      total + ligne.prixUnitaire * ligne.quantite, 0);
  }
}
