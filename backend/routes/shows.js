const router = require('express').Router();
const { load, save, allSeats, bookedSeats } = require('../db');

// List shows (optionally for one movie / date) with availability
router.get('/', (req, res) => {
  const db = load();
  let shows = db.shows;
  if (req.query.movieId) shows = shows.filter(s => s.movieId === +req.query.movieId);
  if (req.query.date) shows = shows.filter(s => s.date === req.query.date);
  shows = shows
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map(s => ({ ...s, availableSeats: allSeats(s).length - bookedSeats(db, s.id).length }));
  res.json(shows);
});

// Single show with movie + booked seats (used by the seat picker)
router.get('/:id', (req, res) => {
  const db = load();
  const show = db.shows.find(s => s.id === +req.params.id);
  if (!show) return res.status(404).json({ error: 'Show not found' });
  res.json({ ...show, movie: db.movies.find(m => m.id === show.movieId), bookedSeats: bookedSeats(db, show.id) });
});

router.post('/', (req, res) => {
  const { movieId, screen, date, time, price } = req.body || {};
  const db = load();
  if (!db.movies.some(m => m.id === +movieId) || !date || !time || !price)
    return res.status(400).json({ error: 'valid movieId, date, time and price are required' });
  const show = { id: Math.max(0, ...db.shows.map(s => s.id)) + 1, movieId: +movieId,
    screen: screen || 'Screen 1', date, time, price: +price, rows: 6, cols: 8 };
  db.shows.push(show); save(db);
  res.status(201).json(show);
});

module.exports = router;
