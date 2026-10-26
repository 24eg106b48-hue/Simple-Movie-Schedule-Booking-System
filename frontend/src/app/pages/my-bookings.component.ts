import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Booking } from '../models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="container">
      <h2>My Bookings</h2>
      <div style="display:flex;gap:10px">
        <input placeholder="Enter your email" [(ngModel)]="email" (keyup.enter)="search()" style="margin:0" />
        <button class="btn" (click)="search()" [disabled]="!email">Find</button>
      </div>
      @if (error) { <div class="error">{{ error }}</div> }
      @if (searched && !bookings.length && !error) { <p class="muted">No bookings found for this email.</p> }
      @for (b of bookings; track b.id) {
        <div class="card" style="padding:16px;margin-top:16px" [style.opacity]="b.status === 'cancelled' ? 0.5 : 1">
          <strong>{{ b.movieTitle }}</strong> — {{ b.status }}<br>
          <span class="muted">{{ b.date | date:'mediumDate' }} • {{ b.time }} • {{ b.screen }}</span><br>
          Seats: {{ b.seats.join(', ') }} • Total ₹{{ b.total }} • ID {{ b.id }}<br>
          @if (b.status === 'confirmed') {
            <button class="btn danger" style="margin-top:10px" (click)="cancel(b)">Cancel booking</button>
          }
        </div>
      }
    </div>`
})
export class MyBookingsComponent {
  private api = inject(ApiService);
  email = ''; bookings: Booking[] = []; error = ''; searched = false;
  search() {
    this.api.getBookings(this.email).subscribe({
      next: b => { this.bookings = b; this.error = ''; this.searched = true; },
      error: e => this.error = e.error?.error || 'Could not load bookings.'
    });
  }
  cancel(b: Booking) {
    if (!confirm('Cancel this booking?')) return;
    this.api.cancelBooking(b.id).subscribe(() => this.search());
  }
}
