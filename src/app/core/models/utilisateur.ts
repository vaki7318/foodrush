export interface Utilisateur {
  uid: string;
  nom: string;
  email: string;
  role: 'client' | 'restaurateur';
  telephone?: string;
}
