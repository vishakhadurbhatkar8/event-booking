import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-booking-dashboard',
  imports:[FormsModule,CommonModule],
  templateUrl: './booking-dashboard.html',
  styleUrls: ['./booking-dashboard.css']
})
export class BookingDashboardComponent implements OnInit {
  bookings: any[] = [];
  apiUrl = 'http://localhost:4000/bookings';
  message: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.http.get<any[]>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (data) => {
        console.log('Bookings fetched:', data);
        this.bookings = data;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.message = 'Failed to load bookings';
      }
    });
  }

  cancelBooking(id: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    this.http.put(`${this.apiUrl}/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.fetchBookings();
      },
      error: (err) => {
        console.error('Cancel booking error:', err);
        this.message = err.error?.message || 'Cancel failed';
      }
    });
  }

  uploadIdProof(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('idProof', file);

    this.http.post('http://localhost:4000/auth/upload-idproof', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => this.message = res.message,
      error: (err) => this.message = err.error?.message || 'Upload failed'
    });
  }
}
