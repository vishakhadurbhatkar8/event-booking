import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../../core/services/event';
import { BookingService, Booking } from '../../../core/services/booking';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails implements OnInit, OnDestroy {
  event: Event | null = null;
  booking: Booking | null = null;
  countdown = 0;
  timer: any;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadEvent(id);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  loadEvent(id: string) {
    console.log('Loading event with ID:', id);
    this.eventService.getEventById(id).subscribe({
      next: (ev) => {
        console.log('Event loaded:', ev);
        this.event = ev;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        // fallback mock (only if Mongo fails)
        this.eventService.getMockEvents().subscribe(list => {
          this.event = list.find(e => e._id === id || e.id === id) || null;
        });
      }
    });
  }

reserveSeat() {
  if (!this.event) return;

  const eventId = (this.event as any)._id;  // ✅ always use Mongo _id

  this.bookingService.reserveSeat(eventId).subscribe({
    next: (res) => {
      console.log('Reservation response:', res);
      this.booking = res.booking;
      // Use the expiresAt from the backend response
      if (res.booking.expiresAt) {
        this.startCountdown(res.booking.expiresAt);
      } else {
        // Fallback: set a 2-minute countdown
        const expiresAt = new Date(Date.now() + 120000).toISOString();
        this.startCountdown(expiresAt);
      }
      alert('Booking request submitted! Please upload your ID proof to complete the reservation.');
    },
    error: (err) => {
      console.error('Reservation failed', err);
      alert(err.error?.message || 'Reservation failed');
    }
  });
}

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

uploadIdProof() {
  if (!this.booking || !this.selectedFile) {
    alert('Please select a file to upload');
    return;
  }

  const formData = new FormData();
  formData.append('idProof', this.selectedFile);

  this.bookingService.uploadIdProof(this.booking._id, formData).subscribe({
    next: (res: any) => {
      console.log('ID proof upload response:', res);
      this.booking = res.booking;
      alert('ID proof uploaded successfully! Your booking is now under review.');
      this.selectedFile = null;
    },
    error: (err) => {
      console.error('ID proof upload failed', err);
      alert(err.error?.message || 'Failed to upload ID proof');
    }
  });
}


  confirmBooking() {
    if (!this.booking) return;

    // ✅ FIX: Use _id if available
    const bookingId = this.booking._id || (this.booking as any).id;
    console.log('Confirming booking with ID:', bookingId);

    this.bookingService.confirmBooking(bookingId).subscribe({
      next: (res) => {
        console.log('Confirm booking response:', res);
        this.booking = res.booking;
        alert('Booking confirmed!');
        this.router.navigate(['/bookings']);
      },
      error: (err) => {
        console.error('Confirm booking failed', err);
        alert(err.error?.message || 'Failed to confirm booking');
      }
    });
  }

  private startCountdown(expiresAt: string) {
    if (this.timer) clearInterval(this.timer);

    this.updateCountdown(expiresAt);
    this.timer = setInterval(() => this.updateCountdown(expiresAt), 1000);
  }

  private updateCountdown(expiresAt: string) {
    const diff = new Date(expiresAt).getTime() - Date.now();
    this.countdown = Math.max(0, Math.floor(diff / 1000));

    if (this.countdown === 0 && this.timer) {
      clearInterval(this.timer);
    }
  }
}
