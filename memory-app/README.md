# 🎮 Memory Game App

A full-stack memory matching game with user authentication, score tracking, and a live leaderboard.

## 🎯 Features

- **User Authentication**
  - Sign up with username and password
  - Secure login with JWT tokens
  - Password hashing with bcryptjs
  - Session management

- **Memory Game**
  - 4x4 grid with 8 emoji pairs
  - Flip cards to find matching pairs
  - Score calculation: 100 - moves
  - Real-time game statistics
  - Game completion detection

- **User Features**
  - User profile with game statistics
  - Best score tracking
  - Games played counter
  - Last game score display

- **Leaderboard**
  - Top 10 players by best score
  - Real-time ranking updates
  - Highlight current player

- **UI/UX**
  - Beautiful gradient design
  - Smooth card flip animations
  - Responsive layout (desktop & mobile)
  - Intuitive navigation

## 📁 Project Structure

```
memory-app/
├── backend/
│   ├── server.js          # Express server with routes
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main app component
    │   ├── main.jsx       # React entry point
    │   ├── pages/         # Page components
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   └── GamePage.jsx
    │   ├── components/    # UI components
    │   │   ├── MemoryGame.jsx
    │   │   ├── Card.jsx
    │   │   └── UserProfile.jsx
    │   └── styles/        # CSS files
    ├── index.html         # HTML entry point
    ├── vite.config.js     # Vite configuration
    └── package.json       # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd memory-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to frontend directory:
```bash
cd memory-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available on `http://localhost:3001` (or the next available port)

## 📚 API Endpoints

### Authentication

- `POST /auth/signup` - Create new user
  ```json
  { "username": "user", "password": "pass" }
  ```

- `POST /auth/login` - Login user
  ```json
  { "username": "user", "password": "pass" }
  ```

- `GET /auth/profile` - Get user profile (requires token)

### Scores

- `POST /scores/save` - Save game score (requires token)
  ```json
  { "score": 85, "moves": 20, "time": 45 }
  ```

- `GET /scores/leaderboard` - Get top 10 scores

## 🎮 How to Play

1. **Sign Up or Login**
   - Create a new account or login with existing credentials
   - Passwords are securely hashed

2. **Play the Game**
   - Click on cards to reveal emojis
   - Find matching pairs
   - Complete the game with minimum moves for best score

3. **View Stats**
   - Check your profile for best score and games played
   - View the live leaderboard to see how you rank

4. **Play Again**
   - Click "Play Again" after completing a game
   - Try to beat your best score!

## 🎨 Technologies Used

### Backend
- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **CSS3** - Styling with animations
- **Fetch API** - HTTP requests

## 🔐 Security Features

- JWT token-based authentication
- Bcrypt password hashing (10 rounds)
- CORS enabled for cross-origin requests
- Token expiration (7 days)
- Secure password validation

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎯 Game Scoring

- Base score: 100
- Deduction: 1 point per move
- Example: If you complete the game in 20 moves, your score is 80
- Best score is saved to leaderboard

## 🚀 Performance

- Lightweight bundle with Vite
- Optimized card flip animations
- Efficient state management with React hooks
- In-memory user storage (ready for database migration)

## 📝 Example Users

After starting the app, you can create new accounts. Here's an example:
- Username: `testuser`
- Password: `password123`

## 🔄 State Management

- Frontend: React hooks (useState, useEffect)
- Backend: In-memory storage (easily replaceable with a database)
- Authentication: JWT tokens with localStorage

## 📊 Leaderboard Calculation

The leaderboard shows:
- Player rank
- Username
- Best score (highest score achieved)

Rankings are sorted in descending order by best score.

## 🎓 Learning Points

This project demonstrates:
- Full-stack web development
- JWT authentication
- Password security with bcrypt
- React component composition
- API integration
- Responsive CSS design
- Game logic implementation
- Score/leaderboard management

## 🛠️ Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Difficulty levels (3x3, 4x4, 5x5 grids)
- Sound effects and animations
- User avatars
- Achievement badges
- Email verification
- Password reset
- Social sharing
- Mobile app version
- Real-time multiplayer

## 📄 License

ISC

---

Enjoy the game! 🎮✨
