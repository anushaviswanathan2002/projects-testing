import express from 'express';
import cors from 'cors';
import Database from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new Database.Database(join(__dirname, '../memory.db'));
const JWT_SECRET = process.env.JWT_SECRET || 'memory-game-secret-key-change-in-prod';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client build
app.use(express.static(join(__dirname, '../client/build')));

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER,
      moves INTEGER,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Routes

// Sign up
app.post('/api/auth/signup', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'User already exists or invalid data' });
      }
      
      const token = jwt.sign({ id: this.lastID }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ 
        id: this.lastID,
        username,
        email,
        token 
      });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token
    });
  });
});

// Get user profile
app.get('/api/user/profile', verifyToken, (req, res) => {
  db.get('SELECT id, username, email FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Save game result
app.post('/api/games', verifyToken, (req, res) => {
  const { score, moves, completed } = req.body;
  
  db.run(
    'INSERT INTO games (user_id, score, moves, completed) VALUES (?, ?, ?, ?)',
    [req.userId, score ?? 0, moves ?? 0, completed ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save game' });
      }
      res.json({ id: this.lastID, score, moves, completed });
    }
  );
});

// Get user game history
app.get('/api/games', verifyToken, (req, res) => {
  db.all(
    'SELECT * FROM games WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
    [req.userId],
    (err, games) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch games' });
      }
      res.json(games);
    }
  );
});

// Get user stats
app.get('/api/stats', verifyToken, (req, res) => {
  db.get(
    `SELECT
       COUNT(*) as total_games,
       SUM(completed) as games_won,
       MIN(CASE WHEN completed = 1 THEN moves END) as best_moves,
       MAX(CASE WHEN completed = 1 THEN score END) as best_score
     FROM games WHERE user_id = ?`,
    [req.userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }
      res.json({
        total_games: stats.total_games || 0,
        games_won: stats.games_won || 0,
        best_moves: stats.best_moves || null,
        best_score: stats.best_score || null,
      });
    }
  );
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
