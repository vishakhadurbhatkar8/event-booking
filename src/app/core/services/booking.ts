import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Booking {
  id: string;
  eventId: string;
  status: 'reserved' | 'confirmed' | 'cancelled';
  expiresAt?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private api = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  reserveSeat(eventId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.api}/events/${eventId}/book`, {});
  }

  confirmBooking(bookingId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.api}/bookings/${bookingId}/confirm`, {});
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.api}/bookings/me`);
  }
  uploadIdProof(bookingId: string, formData: FormData) {
  return this.http.post(`${this.api}/bookings/${bookingId}/upload-id`, formData);
}


  // Mock fallback
  getMockBookings(): Observable<Booking[]> {
    return of([
      { id: 'b1', eventId: '1', status: 'confirmed' },
      { id: 'b2', eventId: '2', status: 'reserved', expiresAt: '2025-09-17T18:00:00Z' }
    ]);
  }
}
