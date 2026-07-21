import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, UsuarioAuth } from '../models/auth.models';
import { RolService } from './rol.service';

const TOKEN_KEY = 'osa_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private rolService = inject(RolService);

  private token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  currentUser = signal<UsuarioAuth | null>(null);
  isAuthenticated = computed(() => this.token() !== null);

  constructor() {
    if (this.token()) {
      this.restaurarSesion();
    }
  }

  getToken(): string | null {
    return this.token();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(tap(resp => this.establecerSesion(resp)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private restaurarSesion() {
    this.http
      .get<UsuarioAuth>(`${environment.apiUrl}/auth/me`)
      .pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      )
      .subscribe(user => {
        if (user) {
          this.currentUser.set(user);
          this.rolService.setRol(user.rol);
        }
      });
  }

  private establecerSesion(resp: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, resp.access_token);
    this.token.set(resp.access_token);
    this.currentUser.set(resp.user);
    this.rolService.setRol(resp.user.rol);
  }
}
