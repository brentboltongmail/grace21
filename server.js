import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'wishes_db.json');

app.use(cors());
app.use(express.json());

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function getWishes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading wishes DB:", err);
    return [];
  }
}

function saveWishes(wishes) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2));
  } catch (err) {
    console.error("Error saving wishes DB:", err);
  }
}

// API Routes
app.get('/api/wishes', (req, res) => {
  res.json(getWishes());
});

app.post('/api/wishes', (req, res) => {
  const { name, gift, msg } = req.body;
  if (!name || !msg) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const wishes = getWishes();
  const newWish = {
    name,
    gift: gift || '👑 Golden Crown',
    msg,
    date: new Date().toISOString()
  };

  wishes.unshift(newWish);
  saveWishes(wishes);
  res.json(wishes);
});

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ Grace 21 Birthday Server running on port ${PORT}`);
});
