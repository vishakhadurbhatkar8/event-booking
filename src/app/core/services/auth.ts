import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:4000'; // backend
  token = signal<string | null>(localStorage.getItem('token'));
  role = signal<string | null>(localStorage.getItem('role'));

  constructor(private http: HttpClient) {}

  requestOtp(email: string) {
    return this.http.post<{ devOtp?: string }>(`${this.api}/auth/request-otp`, { email });
  }

  verifyOtp(email: string, code: string) {
    return this.http.post<{ token: string, role: string }>(
      `${this.api}/auth/verify-otp`,
      { email, code }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.token.set(res.token);
        this.role.set(res.role);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.token.set(null);
    this.role.set(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  isAdmin() {
    return this.role() === 'admin' || this.role() === 'superadmin';
  }
}
