import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  onSubmit(): void {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate([res.rol === 'ADMIN' ? '/admin' : '/tienda']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          (err.error?.message as string) ?? 'Credenciales incorrectas. Intenta de nuevo.';
        this.cdr.markForCheck();
      },
    });
  }
}
