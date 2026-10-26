import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Movie } from '../models';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="container">
      <h2>Now Showing</h2>
      <input placeholder="Search movies..." [(ngModel)]="query" (ngModelChange)="load()" />
      @if (error) { <div class="error">{{ error }}</div> }
      <div class="grid">
        @for (m of movies; track m.id) {
          <a class="card" [routerLink]="['/movie', m.id]" style="color:inherit">
            <img [src]="m.poster" [alt]="m.title" style="width:100%;display:block" />
            <div class="body">
              <strong>{{ m.title }}</strong>
              <div class="muted">{{ m.genre }} • {{ m.duration }} min • {{ m.rating }}</div>
            </div>
          </a>
        } @empty { <p class="muted">No movies found.</p> }
      </div>
    </div>`
})
export class MovieListComponent implements OnInit {
  private api = inject(ApiService);
  movies: Movie[] = []; query = ''; error = '';
  ngOnInit() { this.load(); }
  load() {
    this.api.getMovies(this.query).subscribe({
      next: m => { this.movies = m; this.error = ''; },
      error: () => this.error = 'Could not load movies. Is the backend running on port 3000?'
    });
  }
}
