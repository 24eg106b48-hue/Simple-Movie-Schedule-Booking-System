// Tiny JSON-file "database" (no external DB needed). Seeds sample data on first run.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'data', 'db.json');

function seed() {
  const movies = [
    { id: 1, title: 'Skyline Runner', genre: 'Sci-Fi', duration: 128, rating: 'PG-13', language: 'English',
      description: 'A courier races across a floating megacity to deliver a message that could end a war.',
      poster: 'https://placehold.co/300x450/1e293b/ffffff?text=Skyline+Runner' },
    { id: 2, title: 'The Last Monsoon', genre: 'Drama', duration: 142, rating: 'PG', language: 'Hindi',
      description: 'Three generations of a farming family face the season that decides their future.',
      poster: 'https://placehold.co/300x450/14532d/ffffff?text=Last+Monsoon' },
    { id: 3, title: 'Laugh Riot', genre: 'Comedy', duration: 105, rating: 'PG', language: 'English',
      description: 'A wedding planner has 24 hours to save the most chaotic wedding of the year.',
      poster: 'https://placehold.co/300x450/7c2d12/ffffff?text=Laugh+Riot' },
    { id: 4, title: 'Midnight Cipher', genre: 'Thriller', duration: 117, rating: 'R', language: 'English',
      description: 'A code-breaker discovers her own name in an unsolved cold-war cipher.',
      poster: 'https://placehold.co/300x450/3b0764/ffffff?text=Midnight+Cipher' }
  ];
  const times = ['10:00', '14:00', '18:30', '21:30'];
  const shows = [];
  let id = 1;
  const today = new Date();
  for (const m of movies) {
    for (let d = 0; d < 3; d++) {
      const date = new Date(today); date.setDate(today.getDate() + d);
      const iso = date.toISOString().slice(0, 10);
      times.slice(0, 2 + ((m.id + d) % 3)).forEach((time, i) => {
        shows.push({ id: id++, movieId: m.id, screen: `Screen ${1 + ((m.id + i) % 3)}`,
          date: iso, time, price: 150 + i * 50, rows: 6, cols: 8 });
      });
    }
  }
  return { movies, shows, bookings: [] };
}

function load() {
  if (!fs.existsSync(FILE)) save(seed());
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
function save(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
function allSeats(show) {
  const out = [];
  for (let r = 0; r < show.rows; r++)
    for (let c = 1; c <= show.cols; c++) out.push(String.fromCharCode(65 + r) + c);
  return out;
}
function bookedSeats(db, showId) {
  return db.bookings.filter(b => b.showId === showId && b.status === 'confirmed').flatMap(b => b.seats);
}
module.exports = { load, save, allSeats, bookedSeats };
