import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService,Event } from '../../../core/services/event';
import { BookingService,Booking } from '../../../core/services/booking';
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
    this.eventService.getEventById(id).subscribe({
      next: (ev) => this.event = ev,
      error: () => {
        // fallback mock
        this.eventService.getMockEvents().subscribe(list => {
          this.event = list.find(e => e.id === id) || null;
        });
      }
    });
  }

  reserveSeat() {
    if (!this.event) return;
    this.bookingService.reserveSeat(this.event.id).subscribe({
      next: (res) => {
        this.booking = res;
        this.startCountdown(res.expiresAt || new Date(Date.now() + 120000).toISOString());
      },
      error: () => alert('Reservation failed')
    });
  }

  confirmBooking() {
    if (!this.booking) return;
    this.bookingService.confirmBooking(this.booking.id).subscribe({
      next: (res) => {
        this.booking = res;
        alert('Booking confirmed!');
        this.router.navigate(['/bookings']);
      },
      error: () => alert('Failed to confirm booking')
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
