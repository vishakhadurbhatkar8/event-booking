import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css']
})
export class AdminReportsComponent implements OnInit {
  apiUrl = 'http://localhost:4000';
  loading = false;
  error: string | null = null;

  // Summary data
  summary: any = {};

  // Chart data
  eventChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  bookingChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  eventsChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };

  // Chart options
  eventChartOptions: ChartConfiguration<'bar'>['options'] = { 
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Bookings per Event'
      }
    }
  };
  
  bookingChartOptions: ChartConfiguration<'pie'>['options'] = { 
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Bookings by Status'
      }
    }
  };
  
  eventsChartOptions: ChartConfiguration<'doughnut'>['options'] = { 
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Events by Approval Status'
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${this.apiUrl}/bookings/analytics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (data) => {
        console.log('Analytics data:', data);
        this.summary = data.summary;
        this.prepareCharts(data.charts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.error = err.error?.message || 'Failed to load analytics';
        this.loading = false;
        // Fallback to dummy data
        this.prepareDummyCharts();
      }
    });
  }

  prepareCharts(charts: any) {
    // Bookings per Event (Bar Chart)
    this.eventChartData = {
      labels: charts.bookingsPerEvent.map((item: any) => item.event),
      datasets: [{
        label: 'Bookings',
        data: charts.bookingsPerEvent.map((item: any) => item.bookings),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1
      }]
    };

    // Bookings by Status (Pie Chart)
    this.bookingChartData = {
      labels: charts.bookingsByStatus.map((item: any) => item.status),
      datasets: [{
        data: charts.bookingsByStatus.map((item: any) => item.count),
        backgroundColor: [
          '#28a745', // approved
          '#ffc107', // pending
          '#dc3545', // rejected
          '#6c757d'  // cancelled
        ]
      }]
    };

    // Events by Status (Doughnut Chart)
    this.eventsChartData = {
      labels: charts.eventsByStatus.map((item: any) => item.status),
      datasets: [{
        data: charts.eventsByStatus.map((item: any) => item.count),
        backgroundColor: [
          '#28a745', // approved
          '#ffc107'  // pending
        ]
      }]
    };
  }

  prepareDummyCharts() {
    this.summary = {
      totalBookings: 10,
      approvedBookings: 5,
      pendingBookings: 3,
      rejectedBookings: 1,
      cancelledBookings: 1,
      totalEvents: 5,
      approvedEvents: 4,
      pendingEvents: 1,
      recentBookings: 3
    };

    this.eventChartData = {
      labels: ['Angular Conference', 'React Meetup'],
      datasets: [{ 
        label: 'Bookings', 
        data: [5, 3], 
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1
      }]
    };

    this.bookingChartData = {
      labels: ['Approved', 'Pending', 'Rejected', 'Cancelled'],
      datasets: [{ 
        data: [5, 3, 1, 1], 
        backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d'] 
      }]
    };

    this.eventsChartData = {
      labels: ['Approved', 'Pending'],
      datasets: [{ 
        data: [4, 1], 
        backgroundColor: ['#28a745', '#ffc107'] 
      }]
    };
  }
}
