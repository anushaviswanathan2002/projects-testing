import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory user storage (in production, use a real database)
let users = [];
let memories = []; // Global memories array

// File path for persisting users
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFile = path.join(__dirname, 'users.json');
const memoriesFile = path.join(__dirname, 'memories.json');

// Load users from file
function loadUsers() {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf-8');
      users = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading users:', err);
    users = [];
  }
}

// Save users to file
function saveUsers() {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users:', err);
  }
}

// Load memories from file
function loadMemories() {
  try {
    if (fs.existsSync(memoriesFile)) {
      const data = fs.readFileSync(memoriesFile, 'utf-8');
      memories = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading memories:', err);
    memories = [];
  }
}

// Save memories to file
function saveMemories() {
  try {
    fs.writeFileSync(memoriesFile, JSON.stringify(memories, null, 2));
  } catch (err) {
    console.error('Error saving memories:', err);
  }
}

// Load users and memories on startup
loadUsers();
loadMemories();

// Routes

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if user exists
  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // In production, hash this!
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers();

  res.json({ 
    message: 'User created successfully',
    user: { id: newUser.id, username: newUser.username, email: newUser.email }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    message: 'Login successful',
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// Get user by ID (to verify user is logged in)
app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user: { id: user.id, username: user.username, email: user.email } });
});

// Memory Routes

// Get all memories for a user
app.get('/api/memories', (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userMemories = memories.filter(m => m.userId === userId);
  res.json({ memories: userMemories });
});

// Create a new memory
app.post('/api/memories', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { title, content, category } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newMemory = {
    id: Date.now().toString(),
    userId,
    title,
    content,
    category: category || 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  memories.push(newMemory);
  saveMemories();

  res.json({ 
    message: 'Memory created successfully',
    memory: newMemory 
  });
});

// Update a memory
app.put('/api/memories/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { id } = req.params;
  const { title, content, category } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const memory = memories.find(m => m.id === id && m.userId === userId);
  if (!memory) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  if (title) memory.title = title;
  if (content) memory.content = content;
  if (category) memory.category = category;
  memory.updatedAt = new Date().toISOString();

  saveMemories();

  res.json({ 
    message: 'Memory updated successfully',
    memory 
  });
});

// Delete a memory
app.delete('/api/memories/:id', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const index = memories.findIndex(m => m.id === id && m.userId === userId);
  if (index === -1) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  memories.splice(index, 1);
  saveMemories();

  res.json({ message: 'Memory deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
