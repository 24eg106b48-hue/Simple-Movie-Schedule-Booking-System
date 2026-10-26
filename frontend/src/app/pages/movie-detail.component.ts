import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Movie, Show } from '../models';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="container">
      <a routerLink="/">← Back</a>
      @if (movie) {
        <div style="display:flex;gap:24px;margin:20px 0;flex-wrap:wrap">
          <img [src]="movie.poster" [alt]="movie.title" style="width:220px;border-radius:12px" />
          <div style="flex:1;min-width:240px">
            <h1 style="margin-top:0">{{ movie.title }}</h1>
            <p class="muted">{{ movie.genre }} • {{ movie.duration }} min • {{ movie.rating }} • {{ movie.language }}</p>
            <p>{{ movie.description }}</p>
          </div>
        </div>
        <h2>Showtimes</h2>
        @for (d of dates; track d) {
          <h4>{{ d | date:'EEEE, d MMM' }}</h4>
          @for (s of showsOn(d); track s.id) {
            @if ((s.availableSeats ?? 0) > 0) {
              <a class="chip" [routerLink]="['/book', s.id]">
                {{ s.time }} · {{ s.screen }} · ₹{{ s.price }} <span class="muted">({{ s.availableSeats }} left)</span>
              </a>
            } @else { <span class="chip" style="opacity:.4">{{ s.time }} · Sold out</span> }
          }
        } @empty { <p class="muted">No shows scheduled.</p> }
      }
    </div>`
})
export class MovieDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  movie?: Movie; shows: Show[] = []; dates: string[] = [];
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.api.getMovie(id).subscribe(m => this.movie = m);
    this.api.getShows(id).subscribe(s => { this.shows = s; this.dates = [...new Set(s.map(x => x.date))]; });
  }
  showsOn(d: string) { return this.shows.filter(s => s.date === d); }
}
