import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private api = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  // Real API
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.api}/events`);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.api}/events/${id}`);
  }

  uploadBanner(eventId: string, fd: FormData): Observable<any> {
    return this.http.post<any>(`${this.api}/events/${eventId}/upload-banner`, fd);
  }

  // Mock fallback (remove later)
  getMockEvents(): Observable<Event[]> {
    return of([
      {
        id: '1',
        title: 'Angular Conference',
        description: 'Deep dive into Angular 17',
        date: '2025-09-30',
        location: 'Goa'
      },
      {
        id: '2',
        title: 'React Meetup',
        description: 'React 19 updates',
        date: '2025-10-05',
        location: 'Pune'
      }
    ]);
  }
}
