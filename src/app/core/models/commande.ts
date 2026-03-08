export interface LigneCommande {
  platId: number;
  nomPlat: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Commande {
  id: number;
  clientId: number;
  restaurantId: number;
  lignes: LigneCommande[];
  statut: 'en_attente' | 'en_preparation' | 'livree';
  dateCommande: string;
  adresseLivraison: string;
}
