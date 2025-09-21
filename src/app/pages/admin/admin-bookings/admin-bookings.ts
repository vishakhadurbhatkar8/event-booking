import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-bookings.html',
  styleUrls: ['./admin-bookings.css']
})
export class AdminBookingsComponent implements OnInit {
  allBookings: any[] = [];
  filteredBookings: any[] = [];
  loading = false;
  message: string | null = null;
  apiUrl = 'http://localhost:4000/bookings';
  
  // Filters
  statusFilter = '';
  eventFilter = '';
  dateFilter = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAllBookings();
  }

  fetchAllBookings() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (data) => {
        console.log('All bookings fetched:', data);
        this.allBookings = data;
        this.filteredBookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching all bookings:', err);
        this.loading = false;
        this.message = 'Failed to load bookings';
      }
    });
  }

  applyFilters() {
    this.filteredBookings = this.allBookings.filter(booking => {
      const matchesStatus = !this.statusFilter || booking.status === this.statusFilter;
      const matchesEvent = !this.eventFilter || 
        (booking.event && booking.event.title && 
         booking.event.title.toLowerCase().includes(this.eventFilter.toLowerCase()));
      const matchesDate = !this.dateFilter || 
        new Date(booking.reservedAt).toDateString() === new Date(this.dateFilter).toDateString();
      
      return matchesStatus && matchesEvent && matchesDate;
    });
  }

  clearFilters() {
    this.statusFilter = '';
    this.eventFilter = '';
    this.dateFilter = '';
    this.filteredBookings = this.allBookings;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'reserved': return 'status-reserved';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'approved': return '✅ Approved';
      case 'pending': return '⏳ Pending';
      case 'rejected': return '❌ Rejected';
      case 'cancelled': return '🚫 Cancelled';
      default: return status;
    }
  }

  approveBooking(bookingId: string) {
    if (!confirm('Are you sure you want to approve this booking?')) return;
    
    this.http.put(`${this.apiUrl}/${bookingId}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Booking approved successfully!');
        this.fetchAllBookings();
      },
      error: (err) => {
        console.error('Error approving booking:', err);
        alert(err.error?.message || 'Failed to approve booking');
      }
    });
  }

  rejectBooking(bookingId: string) {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    if (!confirm('Are you sure you want to reject this booking?')) return;
    
    this.http.put(`${this.apiUrl}/${bookingId}/reject`, { reason }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Booking rejected successfully!');
        this.fetchAllBookings();
      },
      error: (err) => {
        console.error('Error rejecting booking:', err);
        alert(err.error?.message || 'Failed to reject booking');
      }
    });
  }

  viewIdProof(idProofPath: string) {
    if (idProofPath) {
      window.open(`http://localhost:4000/${idProofPath}`, '_blank');
    }
  }
}
