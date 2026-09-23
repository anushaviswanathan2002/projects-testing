# Memory App

A full-stack web application for storing and managing personal memories with user authentication.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Create Memories**: Add new memories with title and content
- **View Memories**: Display all your memories in a beautiful grid layout
- **Edit Memories**: Update existing memories
- **Delete Memories**: Remove memories you no longer need
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
memory-app/
├── backend/          # Node.js/Express API server
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── pages/    # Page components (Login, Signup, Dashboard)
│   │   ├── components/ # Reusable components (MemoryForm, MemoryCard, etc.)
│   │   └── App.js    # Main app component
│   └── package.json  # Frontend dependencies
└── README.md
```

## Technology Stack

### Backend
- **Node.js & Express**: RESTful API server
- **SQLite**: Database for storing users and memories
- **JWT**: Secure user authentication
- **bcryptjs**: Password hashing and security

### Frontend
- **React 18**: UI library
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests
- **CSS3**: Styling with modern design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install all dependencies:
```bash
npm install
```

This will install dependencies for both backend and frontend due to workspace configuration.

### Running the Application

#### Option 1: Run backend and frontend separately (Recommended for development)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
The API server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
The React app will open on `http://localhost:3000`

#### Option 2: Run both simultaneously
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login to existing account

### Memories
- `GET /api/memories` - Get all memories for logged-in user
- `POST /api/memories` - Create a new memory
- `PUT /api/memories/:id` - Update a memory
- `DELETE /api/memories/:id` - Delete a memory

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Log in with your credentials
3. **Create Memory**: Click "Add Memory" and fill in the title and content
4. **View Memories**: All your memories are displayed in the dashboard
5. **Edit Memory**: Click "Edit" on any memory card to update it
6. **Delete Memory**: Click "Delete" to remove a memory (confirmation required)
7. **Logout**: Click "Logout" to end your session

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens are used for secure API authentication
- User memories are isolated per user (token-based authorization)
- Token expires after 7 days
- CORS enabled for secure cross-origin requests

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Memories Table
```sql
CREATE TABLE memories (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

Change `JWT_SECRET` to a secure random string in production.

## Customization

### Change JWT Secret
Edit `backend/.env` and replace the `JWT_SECRET` value with a secure random string.

### Change API Port
Modify `PORT` in `backend/.env` (default is 5000).

### Update Frontend API URL
If the backend runs on a different port/URL, update the proxy in `frontend/package.json`.

## Troubleshooting

**Issue**: Backend fails to start
- Ensure port 5000 is not in use: `lsof -i :5000` (macOS/Linux)
- Check Node.js version: `node --version`

**Issue**: Frontend can't connect to API
- Verify backend is running: Check `http://localhost:5000/api/memories`
- Check CORS settings in `backend/server.js`
- Clear browser cache and refresh

**Issue**: Database file won't create
- Ensure backend directory has write permissions
- Check if `memories.db` file exists in the backend directory

## Future Enhancements

- Add memory search and filtering
- Add tags/categories for memories
- Add export memories to PDF/JSON
- Add image support for memories
- Add sharing memories with other users
- Add dark mode toggle
- Add password reset functionality

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
