const router = require('express').Router();
const { load, save } = require('../db');

router.get('/', (req, res) => {
  const { q } = req.query;
  let movies = load().movies;
  if (q) movies = movies.filter(m => m.title.toLowerCase().includes(String(q).toLowerCase()));
  res.json(movies);
});

router.get('/:id', (req, res) => {
  const m = load().movies.find(x => x.id === +req.params.id);
  m ? res.json(m) : res.status(404).json({ error: 'Movie not found' });
});

router.post('/', (req, res) => {
  const { title, genre, duration, rating, language, description, poster } = req.body || {};
  if (!title || !duration) return res.status(400).json({ error: 'title and duration are required' });
  const db = load();
  const movie = { id: Math.max(0, ...db.movies.map(m => m.id)) + 1, title, genre, duration: +duration,
    rating, language, description, poster: poster || 'https://placehold.co/300x450?text=' + encodeURIComponent(title) };
  db.movies.push(movie); save(db);
  res.status(201).json(movie);
});

router.delete('/:id', (req, res) => {
  const db = load(); const id = +req.params.id;
  if (!db.movies.some(m => m.id === id)) return res.status(404).json({ error: 'Movie not found' });
  db.movies = db.movies.filter(m => m.id !== id);
  db.shows = db.shows.filter(s => s.movieId !== id);
  save(db); res.status(204).end();
});

module.exports = router;
