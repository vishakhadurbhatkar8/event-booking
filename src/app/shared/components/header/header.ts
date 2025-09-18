import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  role: string | null = null;

  ngOnInit() {
    this.role = localStorage.getItem('role'); 
  }
}
