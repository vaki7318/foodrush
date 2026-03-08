export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
  role: 'client' | 'restaurateur';
  telephone?: string;
}
