import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Booking, ShowDetail } from '../models';

@Component({
  selector: 'app-seat-booking',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  styles: [`
    .screen { text-align:center; background:#334155; padding:6px; border-radius:50% 50% 0 0; margin:16px auto 24px; max-width:420px; color:var(--muted); font-size:.8rem; }
    .row { display:flex; justify-content:center; gap:8px; margin-bottom:8px; align-items:center; }
    .lbl { width:20px; color:var(--muted); }
    .seat { width:36px; height:36px; border-radius:6px 6px 10px 10px; border:0; background:#475569; color:#fff; cursor:pointer; font-size:.75rem; }
    .seat.sel { background:var(--accent); color:#111; }
    .seat.taken { background:#7f1d1d; cursor:not-allowed; opacity:.6; }
  `],
  template: `
    <div class="container">
      @if (show) {
        <a [routerLink]="['/movie', show.movieId]">← Back</a>
        <h2>{{ show.movie.title }}</h2>
        <p class="muted">{{ show.date | date:'fullDate' }} • {{ show.time }} • {{ show.screen }} • ₹{{ show.price }}/seat</p>

        @if (confirmed) {
          <div class="success">
            <h3 style="margin-top:0">✅ Booking confirmed!</h3>
            Booking ID: <strong>{{ confirmed.id }}</strong><br>
            Seats: {{ confirmed.seats.join(', ') }}<br>
            Total: ₹{{ confirmed.total }}
          </div>
          <a class="btn" routerLink="/my-bookings" style="display:inline-block">View my bookings</a>
        } @else {
          <div class="screen">SCREEN</div>
          @for (r of rows; track r) {
            <div class="row">
              <span class="lbl">{{ r }}</span>
              @for (n of cols; track n) {
                <button class="seat" [class.sel]="isSelected(r + n)" [class.taken]="isTaken(r + n)"
                  [disabled]="isTaken(r + n)" (click)="toggle(r + n)">{{ n }}</button>
              }
            </div>
          }
          <p class="muted" style="text-align:center">Gray: available • Amber: selected • Red: booked</p>

          <div style="max-width:420px;margin:20px auto">
            <p><strong>Selected:</strong> {{ selected.length ? selected.join(', ') : 'none' }}
               — <strong>₹{{ selected.length * show.price }}</strong></p>
            <input placeholder="Your name" [(ngModel)]="name" />
            <input placeholder="Email" type="email" [(ngModel)]="email" />
            @if (error) { <div class="error">{{ error }}</div> }
            <button class="btn" style="width:100%" [disabled]="!selected.length || !name || !email || busy" (click)="book()">
              {{ busy ? 'Booking...' : 'Confirm Booking' }}
            </button>
          </div>
        }
      } @else if (error) { <div class="error">{{ error }}</div> }
    </div>`
})
export class SeatBookingComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  show?: ShowDetail; rows: string[] = []; cols: number[] = [];
  selected: string[] = []; name = ''; email = ''; error = ''; busy = false; confirmed?: Booking;

  ngOnInit() { this.load(); }
  load() {
    const id = +this.route.snapshot.paramMap.get('showId')!;
    this.api.getShow(id).subscribe({
      next: s => {
        this.show = s;
        this.rows = Array.from({ length: s.rows }, (_, i) => String.fromCharCode(65 + i));
        this.cols = Array.from({ length: s.cols }, (_, i) => i + 1);
      },
      error: () => this.error = 'Show not found.'
    });
  }
  isTaken(id: string) { return !!this.show?.bookedSeats.includes(id); }
  isSelected(id: string) { return this.selected.includes(id); }
  toggle(id: string) {
    if (this.isSelected(id)) this.selected = this.selected.filter(s => s !== id);
    else if (this.selected.length < 8) this.selected = [...this.selected, id];
  }
  book() {
    this.busy = true; this.error = '';
    this.api.createBooking({ showId: this.show!.id, seats: this.selected, name: this.name, email: this.email }).subscribe({
      next: b => { this.confirmed = b; this.busy = false; },
      error: e => {
        const msg = e.error?.error || 'Booking failed.';
        this.busy = false; this.selected = []; this.load(); // refresh seat map after a conflict
        this.error = msg;
      }
    });
  }
}
