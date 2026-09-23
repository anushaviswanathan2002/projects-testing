# 🎮 Memory Game with User Authentication

A full-stack memory matching game application built with React, Express.js, and SQLite.

## Features

- ✅ **User Authentication**: Secure signup and login with password hashing (bcryptjs)
- ✅ **Memory Game**: Classic matching pairs game with emoji symbols
- ✅ **Game Statistics**: Track game history, best moves, and win rate
- ✅ **User Profile**: View personal stats and game history
- ✅ **JWT Authentication**: Secure API endpoints with token-based auth
- ✅ **Responsive Design**: Modern UI with gradient styling
- ✅ **Real-time Gameplay**: Smooth card flipping and match detection

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite3** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18** with React Router
- **Axios** for API requests
- **CSS3** with modern gradients and animations

## Project Structure

```
.
├── server/
│   └── index.js              # Express server with API endpoints
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           # Main app component with routing
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Game.js      # Memory game component
│   │   │   └── Profile.js   # User stats page
│   │   └── styles/
│   │       ├── Auth.css
│   │       ├── Game.css
│   │       └── Profile.css
│   └── package.json
├── memory.db                 # SQLite database
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login existing user

### User
- `GET /api/user/profile` - Get user profile (requires auth)

### Games
- `POST /api/games` - Save game result (requires auth)
- `GET /api/games` - Get user's game history (requires auth)
- `GET /api/stats` - Get user statistics (requires auth)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Games Table
```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  score INTEGER,
  moves INTEGER,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client && npm install && cd ..
```

3. Build the client:
```bash
cd client && npm run build && cd ..
```

### Running the Application

Start the server (which also serves the built React app):
```bash
npm start
# or
node server/index.js
```

The app will be available at `http://localhost:3001`

For development with hot reload, run the client separately:
```bash
# Terminal 1: Start the server
node server/index.js

# Terminal 2: Start the React dev server
cd client && npm start
```

## Game Rules

1. **Objective**: Match all pairs of cards in the fewest moves
2. **Gameplay**: Click cards to reveal emoji symbols
3. **Matching**: When two cards match, they stay revealed
4. **Scoring**: Score = 100 - number of moves
5. **Win**: Successfully match all 12 pairs

## Features Explained

### Authentication Flow
1. New users sign up with username, email, and password
2. Passwords are hashed using bcryptjs
3. On login, user receives a JWT token valid for 7 days
4. Token is stored in localStorage and sent with API requests

### Game Flow
1. User logs in or signs up
2. Redirected to game page
3. Click cards to reveal and match pairs
4. When all pairs matched, game is saved to database
5. View game history and stats in profile

### Statistics Tracking
- Total games played
- Games won
- Best score (fewest moves)
- Win rate percentage
- Last 10 game results with timestamps

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Protected API endpoints with token verification
- ✅ CORS enabled for safe cross-origin requests
- ✅ No sensitive data in localStorage (only token)

## Future Enhancements

- [ ] Leaderboard with top players
- [ ] Difficulty levels (easy, medium, hard)
- [ ] Time-based challenges
- [ ] Multiplayer gameplay
- [ ] User profile customization
- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] Social sharing of scores

## License

MIT
