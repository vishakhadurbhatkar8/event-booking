import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService,Event } from '../../../core/services/event';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css'
})
export class AdminEvents {
  selectedBanner: File | null = null;

  constructor(private eventService: EventService) {}

  onBannerSelected(event: any) {
    this.selectedBanner = event.target.files[0] || null;
  }

  uploadBanner() {
    if (!this.selectedBanner) {
      alert('No file selected');
      return;
    }
    const fd = new FormData();
    fd.append('banner', this.selectedBanner);

    this.eventService.uploadBanner('1', fd).subscribe({
      next: () => alert('Banner uploaded successfully'),
      error: () => alert('Failed to upload banner')
    });
  }
}
