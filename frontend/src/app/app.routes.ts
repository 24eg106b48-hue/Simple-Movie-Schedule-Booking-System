import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail.component';
import { SeatBookingComponent } from './pages/seat-booking.component';
import { MyBookingsComponent } from './pages/my-bookings.component';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'book/:showId', component: SeatBookingComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: '**', redirectTo: '' }
];
