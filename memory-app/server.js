import http from 'http';
import url from 'url';

// Simple in-memory database
const users = new Map();
const sessions = new Map();

// Helper function to generate session token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

// Create server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  try {
    // Sign Up
    if (pathname === '/api/signup' && req.method === 'POST') {
      const { email, password, name } = await parseBody(req);

      if (!email || !password || !name) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
      }

      if (users.has(email)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'User already exists' }));
        return;
      }

      const token = generateToken();
      users.set(email, { email, password, name, score: 0 });
      sessions.set(token, email);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        token,
        user: { email, name, score: 0 }
      }));
      return;
    }

    // Login
    if (pathname === '/api/login' && req.method === 'POST') {
      const { email, password } = await parseBody(req);

      if (!email || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
      }

      const user = users.get(email);
      if (!user || user.password !== password) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Invalid credentials' }));
        return;
      }

      const token = generateToken();
      sessions.set(token, email);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        token,
        user: { email, name: user.name, score: user.score }
      }));
      return;
    }

    // Verify session
    if (pathname === '/api/verify' && req.method === 'POST') {
      const { token } = await parseBody(req);

      if (!token) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'No token provided' }));
        return;
      }

      const email = sessions.get(token);
      if (!email) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Invalid token' }));
        return;
      }

      const user = users.get(email);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        user: { email, name: user.name, score: user.score }
      }));
      return;
    }

    // Update score
    if (pathname === '/api/score' && req.method === 'POST') {
      const { token, score } = await parseBody(req);

      if (!token) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'No token provided' }));
        return;
      }

      const email = sessions.get(token);
      if (!email) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Invalid token' }));
        return;
      }

      const user = users.get(email);
      if (score < user.score || user.score === 0) {
        user.score = score;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        score: user.score
      }));
      return;
    }

    // Logout
    if (pathname === '/api/logout' && req.method === 'POST') {
      const { token } = await parseBody(req);
      if (token) {
        sessions.delete(token);
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // Not found
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
