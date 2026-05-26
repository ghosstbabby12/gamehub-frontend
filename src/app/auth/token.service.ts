import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_KEY = 'gh_access_token';
  private readonly REFRESH_KEY = 'gh_refresh_token';
  private readonly USER_KEY = 'gh_current_user';

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_KEY, accessToken);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  saveUser(user: AuthResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthResponse | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? (JSON.parse(data) as AuthResponse) : null;
  }
}
