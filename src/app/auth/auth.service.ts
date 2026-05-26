import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, TokenRefreshResponse } from '../models/auth.models';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private readonly BASE = `${environment.apiUrl}/api/auth`;

  currentUser$ = new BehaviorSubject<AuthResponse | null>(null);

  constructor() {
    const user = this.tokenService.getUser();
    if (user && this.isLoggedIn()) {
      this.currentUser$.next(user);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE}/login`, { email, password })
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  register(nombre: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE}/register`, { nombre, email, password })
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  logout(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      this.http.post(`${this.BASE}/logout`, {}).subscribe({ error: () => {} });
    }
    this.tokenService.clearTokens();
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<TokenRefreshResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http
      .post<TokenRefreshResponse>(`${this.BASE}/refresh`, { refreshToken })
      .pipe(tap((res) => this.tokenService.saveTokens(res.accessToken, res.refreshToken)));
  }

  decodeJwt(token: string): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getAccessToken();
    if (!token) return false;
    const decoded = this.decodeJwt(token);
    if (!decoded) return false;
    return (decoded['exp'] as number) > Math.floor(Date.now() / 1000);
  }

  getRole(): string | null {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;
    const decoded = this.decodeJwt(token);
    return (decoded?.['rol'] as string) ?? null;
  }

  private handleAuthResponse(res: AuthResponse): void {
    this.tokenService.saveTokens(res.accessToken, res.refreshToken);
    this.tokenService.saveUser(res);
    queueMicrotask(() => this.currentUser$.next(res));
  }
}
