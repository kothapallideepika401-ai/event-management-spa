const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());          // allow Angular (localhost:4200) to call this API
app.use(express.json());  // parse JSON request bodies

// ---- In-memory data (RESETS when the server restarts) ----
const CATEGORIES = ['Technical', 'Cultural', 'Workshop', 'Sports'];
const DEFAULT_EMOJI = { Technical: '💻', Cultural: '🎭', Workshop: '🛠️', Sports: '🏆' };

let events = [
  { id: 1, name: 'CodeSprint Hackathon', date: '2026-11-15', location: 'Main Auditorium', category: 'Technical', emoji: '💻',
    description: 'A 24-hour coding challenge where teams build innovative solutions to real-world problems.' },
  { id: 2, name: 'Cultural Fest 2026', date: '2026-11-22', location: 'Open Air Theatre', category: 'Cultural', emoji: '🎭',
    description: 'Dance, music and drama performances by students from every department.' },
  { id: 3, name: 'Web Development Workshop', date: '2026-11-28', location: 'Computer Lab 3', category: 'Workshop', emoji: '🛠️',
    description: 'Hands-on session covering HTML, CSS and Angular basics for beginners.' },
  { id: 4, name: 'Inter-College Cricket Cup', date: '2026-12-05', location: 'College Ground', category: 'Sports', emoji: '🏏',
    description: 'Knockout cricket tournament featuring teams from nearby colleges.' },
  { id: 5, name: 'AI & Machine Learning Seminar', date: '2026-12-10', location: 'Seminar Hall', category: 'Technical', emoji: '🤖',
    description: 'Industry experts talk about the latest trends in AI and career opportunities.' }
];
let registrations = [];
let nextEventId = 6;
let nextRegId = 1;

// ---- Helpers ----
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s) => /^[0-9]{10}$/.test(s);
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

// ---- Event routes ----
app.get('/api/events', (req, res) => res.json(events));

app.get('/api/events/:id', (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

app.post('/api/events', (req, res) => {
  const name = clean(req.body.name);
  const date = clean(req.body.date);
  const location = clean(req.body.location);
  const description = clean(req.body.description);
  const category = clean(req.body.category);
  const emoji = clean(req.body.emoji) || DEFAULT_EMOJI[category] || '🎉';

  const errors = [];
  if (name.length < 3) errors.push('Name must be at least 3 characters');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Date is required (YYYY-MM-DD)');
  if (!location) errors.push('Location is required');
  if (description.length < 10) errors.push('Description must be at least 10 characters');
  if (!CATEGORIES.includes(category)) errors.push('Category must be one of: ' + CATEGORIES.join(', '));
  if (errors.length) return res.status(400).json({ message: errors.join('. '), errors });

  const event = { id: nextEventId++, name, date, location, category, emoji, description };
  events.push(event);
  res.status(201).json(event);
});

app.delete('/api/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  events.splice(index, 1);
  registrations = registrations.filter((r) => r.eventId !== id); // remove its registrations too
  res.json({ message: 'Event deleted' });
});

// ---- Registration routes ----
app.get('/api/registrations', (req, res) => {
  if (req.query.eventId) {
    return res.json(registrations.filter((r) => r.eventId === Number(req.query.eventId)));
  }
  res.json(registrations);
});

app.post('/api/registrations', (req, res) => {
  const eventId = Number(req.body.eventId);
  const name = clean(req.body.name);
  const email = clean(req.body.email).toLowerCase();
  const phone = clean(req.body.phone);

  const errors = [];
  if (name.length < 2) errors.push('Name is required (min 2 characters)');
  if (!isEmail(email)) errors.push('A valid email is required');
  if (!isPhone(phone)) errors.push('Phone must be exactly 10 digits');
  if (errors.length) return res.status(400).json({ message: errors.join('. '), errors });

  if (!events.find((e) => e.id === eventId)) {
    return res.status(404).json({ message: 'Event not found' });
  }
  if (registrations.find((r) => r.eventId === eventId && r.email === email)) {
    return res.status(409).json({ message: 'This email is already registered for this event' });
  }

  const registration = { id: nextRegId++, eventId, name, email, phone };
  registrations.push(registration);
  res.status(201).json(registration);
});

app.listen(PORT, () => console.log('Backend running at http://localhost:' + PORT));
