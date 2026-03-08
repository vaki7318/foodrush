import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email = '';
  motDePasse = '';
  erreur = '';
  cacheMotDePasse = true;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {}

  login(): void {
    this.erreur = '';
    this.cdr.detectChanges();

    this.authService.login(this.email, this.motDePasse).subscribe({
      next: (utilisateur) => {
        if (utilisateur) {
          if (utilisateur.role === 'restaurateur') {
            this.router.navigate(['/restaurateur/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.erreur = 'Email ou mot de passe incorrect.';
          this.snackBar.open(
            "Adresse e-mail ou mot de passe inconnu. Veuillez essayer d'autres identifiants ou vous inscrire",
            undefined,
            {
              duration: 4000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center'
            }
          );
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.erreur = 'Une erreur est survenue. Veuillez réessayer.';
        this.cdr.detectChanges();
      }
    });
  }
}
