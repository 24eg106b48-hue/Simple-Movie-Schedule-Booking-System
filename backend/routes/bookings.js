const router = require('express').Router();
const { load, save, allSeats, bookedSeats } = require('../db');

const enrich = (db, b) => {
  const show = db.shows.find(s => s.id === b.showId) || {};
  const movie = db.movies.find(m => m.id === show.movieId) || {};
  return { ...b, movieTitle: movie.title, date: show.date, time: show.time, screen: show.screen };
};

// My bookings: GET /api/bookings?email=you@example.com
router.get('/', (req, res) => {
  const email = String(req.query.email || '').toLowerCase();
  if (!email) return res.status(400).json({ error: 'email query param is required' });
  const db = load();
  res.json(db.bookings.filter(b => b.email === email).map(b => enrich(db, b)).reverse());
});

router.post('/', (req, res) => {
  const { showId, seats, name, email } = req.body || {};
  if (!showId || !Array.isArray(seats) || !seats.length || !name || !email)
    return res.status(400).json({ error: 'showId, seats[], name and email are required' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (seats.length > 8) return res.status(400).json({ error: 'Maximum 8 seats per booking' });

  const db = load();
  const show = db.shows.find(s => s.id === +showId);
  if (!show) return res.status(404).json({ error: 'Show not found' });
  const valid = allSeats(show);
  if (new Set(seats).size !== seats.length || seats.some(s => !valid.includes(s)))
    return res.status(400).json({ error: 'Invalid seat selection' });
  const clash = seats.filter(s => bookedSeats(db, show.id).includes(s));
  if (clash.length) return res.status(409).json({ error: `Seats already booked: ${clash.join(', ')}` });

  const booking = {
    id: 'BK' + Date.now().toString(36).toUpperCase(), showId: show.id, seats,
    name: name.trim(), email: email.toLowerCase(), total: seats.length * show.price,
    status: 'confirmed', createdAt: new Date().toISOString()
  };
  db.bookings.push(booking); save(db);
  res.status(201).json(enrich(db, booking));
});

router.delete('/:id', (req, res) => {
  const db = load();
  const b = db.bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  b.status = 'cancelled'; save(db);
  res.json(enrich(db, b));
});

module.exports = router;
