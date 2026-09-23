const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (in production, use a database)
const users = {};
const userScores = {};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Sign Up
app.post('/auth/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (users[username]) {
    return res.status(400).json({ error: 'User already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };
    userScores[username] = { bestScore: 0, gamesPlayed: 0 };

    const token = jwt.sign({ userId: username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = users[username];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/auth/profile', verifyToken, (req, res) => {
  const scores = userScores[req.userId] || { bestScore: 0, gamesPlayed: 0 };
  res.json({ username: req.userId, ...scores });
});

// Save game score
app.post('/scores/save', verifyToken, (req, res) => {
  const { score, moves, time } = req.body;
  const userId = req.userId;

  if (!userScores[userId]) {
    userScores[userId] = { bestScore: 0, gamesPlayed: 0 };
  }

  userScores[userId].gamesPlayed += 1;
  if (score > userScores[userId].bestScore) {
    userScores[userId].bestScore = score;
  }

  userScores[userId].lastScore = score;
  userScores[userId].lastMoves = moves;
  userScores[userId].lastTime = time;

  res.json(userScores[userId]);
});

// Get leaderboard
app.get('/scores/leaderboard', (req, res) => {
  const leaderboard = Object.entries(userScores)
    .map(([username, scores]) => ({ username, bestScore: scores.bestScore }))
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, 10);

  res.json(leaderboard);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
