import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-admin-dashboard',
  imports:[FormsModule,DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  events: any[] = [];
  newEvent = { title: '', description: '', date: '', location: '' };
  apiUrl = 'http://localhost:4000/events';
  message: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error(err)
    });
  }

  approveEvent(id: string) {
    this.http.put(`${this.apiUrl}/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.fetchEvents();
      },
      error: (err) => console.error(err)
    });
  }

  deleteEvent(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.fetchEvents();
      },
      error: (err) => console.error(err)
    });
  }

  addEvent() {
    this.http.post(this.apiUrl, this.newEvent, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        this.message = 'Event created successfully';
        this.newEvent = { title: '', description: '', date: '', location: '' };
        this.fetchEvents();
      },
      error: (err) => console.error(err)
    });
  }
}
