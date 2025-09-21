import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {  DatePipe } from '@angular/common';
@Component({
  selector: 'app-admin-event',
  imports:[FormsModule,DatePipe,ReactiveFormsModule],
  templateUrl: './admin-events.html',
  styleUrls: ['./admin-events.css']
})
export class AdminEvent implements OnInit {
  events: any[] = [];
  eventForm!: FormGroup;
  apiUrl = 'http://localhost:4000/events';
  loading = false;
  message: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required]
    });
    

    this.fetchEvents();
  }

  fetchEvents() {
    this.loading = true;
    this.http.get<any[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
        console.log('Events fetched:', data);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.events = [];
        this.loading = false;
        this.message = 'Failed to load events';
      }
    });
  }

  addEvent() {
    if (this.eventForm.invalid) return;

    this.http.post(this.apiUrl, this.eventForm.value, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        console.log('Event created:', res);
        alert(res.message || 'Event added successfully!');
        this.eventForm.reset();
        this.fetchEvents(); // Refresh the list
      },
      error: (err) => {
        console.error('Error creating event:', err);
        alert(err.error?.message || 'Failed to create event');
      }
    });
  }

  approveEvent(eventId: string) {
    this.http.put(`${this.apiUrl}/${eventId}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Event approved successfully!');
        this.fetchEvents();
      },
      error: (err) => {
        console.error('Error approving event:', err);
        alert(err.error?.message || 'Failed to approve event');
      }
    });
  }

  deleteEvent(eventId: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    this.http.delete(`${this.apiUrl}/${eventId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Event deleted successfully!');
        this.fetchEvents();
      },
      error: (err) => {
        console.error('Error deleting event:', err);
        alert(err.error?.message || 'Failed to delete event');
      }
    });
  }

  onBannerSelected(event: any, eventId: string) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('banner', file);

    this.http.post(`${this.apiUrl}/${eventId}/upload-banner`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => this.fetchEvents(),
      error: (err) => console.error('Banner upload failed', err)
    });
  }
}
