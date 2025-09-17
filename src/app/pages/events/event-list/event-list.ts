import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService,Event } from '../../../core/services/event';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList implements OnInit {
  events: Event[] = [];
  search = '';
  location = '';
  loading = false;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Load initial query params
    this.route.queryParamMap.subscribe(params => {
      this.search = params.get('q') || '';
      this.location = params.get('location') || '';
      this.loadEvents();
    });
  }

  loadEvents() {
    this.loading = true;

    // Replace with backend when ready
    this.eventService.getMockEvents().subscribe({
      next: (data) => {
        this.events = data.filter(ev =>
          ev.title.toLowerCase().includes(this.search.toLowerCase()) &&
          (this.location ? ev.location.toLowerCase() === this.location.toLowerCase() : true)
        );
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.search, location: this.location || null },
      queryParamsHandling: 'merge'
    });
  }
}
