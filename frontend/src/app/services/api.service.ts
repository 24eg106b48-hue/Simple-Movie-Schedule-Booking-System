import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, Movie, Show, ShowDetail } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api';

  getMovies(q = ''): Observable<Movie[]> { return this.http.get<Movie[]>(`${this.base}/movies`, { params: q ? { q } : {} }); }
  getMovie(id: number): Observable<Movie> { return this.http.get<Movie>(`${this.base}/movies/${id}`); }
  getShows(movieId: number): Observable<Show[]> { return this.http.get<Show[]>(`${this.base}/shows`, { params: { movieId } }); }
  getShow(id: number): Observable<ShowDetail> { return this.http.get<ShowDetail>(`${this.base}/shows/${id}`); }
  createBooking(b: { showId: number; seats: string[]; name: string; email: string }): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, b);
  }
  getBookings(email: string): Observable<Booking[]> { return this.http.get<Booking[]>(`${this.base}/bookings`, { params: { email } }); }
  cancelBooking(id: string): Observable<Booking> { return this.http.delete<Booking>(`${this.base}/bookings/${id}`); }
}
