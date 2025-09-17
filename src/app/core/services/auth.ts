import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:4000'; // backend base URL
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  requestOtp(email: string) {
    return this.http.post<{ devOtp?: string }>(`${this.api}/auth/request-otp`, { email });
  }

  verifyOtp(email: string, code: string) {
    return this.http.post<{ token: string }>(`${this.api}/auth/verify-otp`, { email, code }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.token.set(res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
