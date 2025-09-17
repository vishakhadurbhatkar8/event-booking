import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  otp = '';
  otpSent = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  requestOtp() {
    this.loading = true;
    this.auth.requestOtp(this.email).subscribe({
      next: (res) => {
        this.otpSent = true;
        this.loading = false;
        if (res.devOtp) {
          alert('Dev OTP: ' + res.devOtp); // ⚠️ dev only
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to send OTP');
      }
    });
  }

  verifyOtp() {
    this.loading = true;
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Invalid OTP');
      }
    });
  }
}
