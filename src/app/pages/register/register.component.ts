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

  onSubmit(): void {
    this.loading = true;
    this.errorMsg = '';
    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/tienda']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = (err.error?.message as string) ?? 'Error al registrarse. Intenta de nuevo.';
        this.cdr.markForCheck();
      },
    });
  }
}
