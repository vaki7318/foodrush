import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'auth/inscription',
    loadComponent: () => import('./features/auth/inscription/inscription').then(m => m.InscriptionComponent)
  },
  {
    path: 'restaurants',
    loadComponent: () => import('./features/restaurant/liste-restaurants/liste-restaurants').then(m => m.ListeRestaurantsComponent)
  },
  {
    path: 'restaurants/:id',
    loadComponent: () => import('./features/restaurant/detail-restaurant/detail-restaurant').then(m => m.DetailRestaurantComponent)
  },
  {
    path: 'restaurateur/dashboard',
    loadComponent: () => import('./features/restaurateur/dashboard-restaurateur/dashboard-restaurateur').then(m => m.DashboardRestateurateurComponent),
    canActivate: [AuthGuard],
    data: { roles: ['restaurateur'] }
  },
  {
    path: 'restaurateur/plats',
    loadComponent: () => import('./features/restaurateur/gestion-plats/gestion-plats').then(m => m.GestionPlatsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['restaurateur'] }
  },
  {
    path: 'commande/panier',
    loadComponent: () => import('./features/commande/panier/panier').then(m => m.PanierComponent),
    canActivate: [AuthGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'commande/mes-commandes',
    loadComponent: () => import('./features/commande/mes-commandes/mes-commandes').then(m => m.MesCommandesComponent),
    canActivate: [AuthGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'restaurateur/restaurants',
    loadComponent: () => import('./features/restaurateur/gestion-restaurants/gestion-restaurants').then(m => m.GestionRestaurantsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['restaurateur'] }
  },
  {
    path: 'restaurateur/restaurants/:id',
    loadComponent: () => import('./features/restaurant/detail-restaurant/detail-restaurant')
      .then(m => m.DetailRestaurantComponent),
    canActivate: [AuthGuard],
    data: { roles: ['restaurateur'] }
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
