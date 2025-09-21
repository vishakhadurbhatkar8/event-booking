import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports:[FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  otp = '';
  step = 1;
  apiUrl = 'http://localhost:4000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  requestOtp() {
    this.http.post(`${this.apiUrl}/request-otp`, { email: this.email }).subscribe({
      next: () => this.step = 2,
      error: (err) => console.error(err)
    });
  }

  verifyOtp() {
    this.http.post(`${this.apiUrl}/verify-otp`, { email: this.email, otp: this.otp }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.router.navigate(['/']);
      },
      error: (err) => console.error(err)
    });
  }
}
