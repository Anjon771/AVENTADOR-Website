import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// API for contact subscription
app.post('/api/contact', (req, res) => {
  const { name, email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  return res.json({
    success: true,
    message: `Thank you ${name || 'car enthusiast'}! Your subscription has been received.`
  });
});

// API for VIP Concierge Reservation
app.post('/api/reserve', (req, res) => {
  const { name, email, model, experience, location } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required for VIP reservation.' });
  }
  const randomSerial = Math.floor(1000 + Math.random() * 9000);
  const serialCode = `AVT-780-${randomSerial}`;
  return res.json({
    success: true,
    serialCode,
    model: model || 'Aventador LP 780-4 Ultimae',
    experience: experience || 'Sant\'Agata Factory Handover',
    location: location || 'Sant\'Agata Bolognese, Italy',
    message: `Reservation confirmed for ${name}. Concierge allocation reference ${serialCode} assigned.`
  });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
