import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav style="background:#020617;padding:14px 24px;display:flex;justify-content:space-between;align-items:center">
      <a routerLink="/" style="font-size:1.3rem;font-weight:700">🎬 CineBook</a>
      <div><a routerLink="/">Movies</a> &nbsp;|&nbsp; <a routerLink="/my-bookings">My Bookings</a></div>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
