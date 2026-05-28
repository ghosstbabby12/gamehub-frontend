import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nombre = '';
  email = '';
  password = '';
  errorMsg = '';
  loading = false;
  registered = false;
  countdown = 3;

  onSubmit(): void {
    this.loading = true;
    this.errorMsg = '';
    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.registered = true;
        this.cdr.markForCheck();
        this.startRedirectCountdown();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = (err.error?.message as string) ?? 'Error al registrarse. Intenta de nuevo.';
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  goToStore(): void {
    this.router.navigate(['/tienda']);
  }

  private startRedirectCountdown(): void {
    const tick = () => {
      this.countdown--;
      this.cdr.markForCheck();
      if (this.countdown > 0) {
        setTimeout(tick, 1000);
      } else {
        this.router.navigate(['/tienda']);
      }
    };
    setTimeout(tick, 1000);
  }
}
