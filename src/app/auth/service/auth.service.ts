import { Injectable } from '@angular/core';
import { apiUrl } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${apiUrl}auth`;
  private tokenKey = 'authToken';
  private nombre: string = '';

  constructor(private http: HttpClient, private router: Router, private httpUtils: HttpUtilsService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/log-in`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setNombre(response.token);
        }
      }),
      catchError(this.httpUtils.handleError)
    );
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setNombre(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nombre = payload.sub;
    console.log(payload)
    const headers = this.httpUtils.getHeaders(); 
    this.http.get<any>(`${this.apiUrl}/${nombre}`, { headers }).pipe(
      tap(response => this.nombre = response.nombre)
    ).subscribe();
  }

  public getNombre(): string {
      return this.nombre;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (error) {
      console.error('Token parsing error:', error);
      return false;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      this.router.navigate(['/login']);
    }
  }
}
