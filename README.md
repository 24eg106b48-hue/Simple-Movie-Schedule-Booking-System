# CineBook – Simple Movie Schedule & Booking System

Angular 17 (standalone components) frontend + Node.js/Express REST API.
Data is stored in a JSON file (`backend/data/db.json`, auto-created with sample movies and shows on first run).

## Run

**1. Backend** (http://localhost:3000)
```bash
cd backend
npm install
npm start
```

**2. Frontend** (http://localhost:4200, proxies /api to the backend)
```bash
cd frontend
npm install
npm start
```

## Features
- Browse and search movies
- View showtimes grouped by date, with seats remaining
- Interactive seat map (max 8 seats), double-booking prevented on the server (HTTP 409)
- Booking confirmation, lookup by email, cancellation (frees seats)

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/movies?q= | List / search movies |
| GET | /api/movies/:id | Movie details |
| POST / DELETE | /api/movies(/:id) | Add / remove movie |
| GET | /api/shows?movieId=&date= | Shows with availability |
| GET | /api/shows/:id | Show + movie + bookedSeats |
| POST | /api/shows | Add a show |
| POST | /api/bookings | `{showId, seats[], name, email}` |
| GET | /api/bookings?email= | Bookings for an email |
| DELETE | /api/bookings/:id | Cancel booking |

## Structure
```
movie-booking-system/
├── backend/   server.js, db.js, routes/{movies,shows,bookings}.js
└── frontend/  Angular app: src/app/{pages,services}, models.ts, routes
```
Note: admin endpoints (add/delete movie/show) have no authentication – add JWT before real use.
