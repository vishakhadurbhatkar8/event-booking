import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Booking {
  _id: string;
  id?: string; // For backward compatibility
  user: string | any;
  event: string | any; // Can be ObjectId or populated event object
  eventId?: string; // For backward compatibility
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reservedAt: string;
  expiresAt?: string;
  idProof?: string;
  approvedBy?: string | any;
  approvedAt?: string;
  rejectionReason?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private api = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  reserveSeat(eventId: string): Observable<any> {
    return this.http.post<any>(`${this.api}/events/${eventId}/book`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  confirmBooking(bookingId: string): Observable<any> {
    return this.http.put<any>(`${this.api}/bookings/${bookingId}/confirm`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.api}/bookings/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }
  uploadIdProof(bookingId: string, formData: FormData) {
    return this.http.post(`${this.api}/bookings/${bookingId}/upload-idproof`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  approveBooking(bookingId: string): Observable<any> {
    return this.http.put<any>(`${this.api}/bookings/${bookingId}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  rejectBooking(bookingId: string, reason: string): Observable<any> {
    return this.http.put<any>(`${this.api}/bookings/${bookingId}/reject`, { reason }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }


  // Mock fallback
  getMockBookings(): Observable<Booking[]> {
    return of([
      { 
        _id: 'b1', 
        id: 'b1', 
        user: 'user1', 
        event: '1', 
        eventId: '1', 
        status: 'approved',
        reservedAt: '2025-01-15T10:00:00Z'
      },
      { 
        _id: 'b2', 
        id: 'b2', 
        user: 'user1', 
        event: '2', 
        eventId: '2', 
        status: 'pending', 
        expiresAt: '2025-09-17T18:00:00Z',
        reservedAt: '2025-01-15T10:00:00Z'
      }
    ]);
  }
}
