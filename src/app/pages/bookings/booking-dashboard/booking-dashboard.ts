import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService,Booking } from '../../../core/services/booking';
import { EventService,Event } from '../../../core/services/event';

@Component({
  selector: 'app-booking-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-dashboard.html',
  styleUrl: './booking-dashboard.css'
})
export class BookingDashboard implements OnInit {
  bookings: (Booking & { event?: Event, selectedFile?: File })[] = [];
  upcoming: (Booking & { event?: Event })[] = [];
  past: (Booking & { event?: Event })[] = [];
  loading = false;

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getMockBookings().subscribe({
      next: (data) => {
        this.bookings = data;

        this.eventService.getMockEvents().subscribe(evts => {
          this.bookings.forEach(b => {
            b.event = evts.find(e => e.id === b.eventId);
          });

          const now = new Date().toISOString();
          this.upcoming = this.bookings.filter(b =>
            (b.status === 'reserved' || b.status === 'confirmed') &&
            b.event && b.event.date >= now
          );
          this.past = this.bookings.filter(b =>
            b.status === 'cancelled' || (b.event && b.event.date < now)
          );

          this.loading = false;
        });
      },
      error: () => this.loading = false
    });
  }

  onFileSelected(event: any, booking: Booking & { selectedFile?: File }) {
    const file = event.target.files[0];
    if (file) {
      booking.selectedFile = file;
    }
  }

  uploadIdProof(booking: Booking & { selectedFile?: File }) {
    if (!booking.selectedFile) {
      alert('No file selected');
      return;
    }
    const fd = new FormData();
    fd.append('file', booking.selectedFile);

    this.bookingService.uploadIdProof(booking.id, fd).subscribe({
      next: () => alert('ID proof uploaded successfully'),
      error: () => alert('Failed to upload ID proof')
    });
  }

  cancelBooking(booking: Booking) {
    alert(`Cancel booking ${booking.id} (TODO: call cancel API)`);
  }
}
