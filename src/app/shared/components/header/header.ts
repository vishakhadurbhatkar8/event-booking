import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports:[RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  get role() {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
