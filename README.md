# Memory App with Stopwatch

A full-featured React application that combines user authentication with a memory/notes management system and an integrated stopwatch utility.

## Features

### 🔐 User Authentication
- **Sign Up**: Create a new account with email, username, and password
- **Login**: Secure login with form validation
- **Form Validation**:
  - Email format validation
  - Password confirmation on signup
  - Minimum password length requirement (6 characters)
  - Duplicate email prevention

### 📝 Memory Management
- **Create Memories**: Add quick notes and memories with a character limit
- **Manage Memories**: 
  - Set importance levels (Low, Normal, Important)
  - Delete memories
  - View creation timestamps
  - Automatic sorting by importance
- **Persistent Storage**: All memories are saved to browser's localStorage per user

### ⏱️ Stopwatch Feature
- **Start/Stop**: Begin and pause the timer
- **Lap Recording**: Track lap times during timing
- **Reset**: Clear timer and all lap data
- **Display**: Real-time display with minutes, seconds, and milliseconds
- **Lap History**: View all recorded laps in a scrollable list

### 🎨 User Experience
- **Tab Navigation**: Seamless switching between Memories and Stopwatch
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Gradient backgrounds and smooth animations
- **Session Persistence**: User session persists across page refreshes

## Tech Stack

- **Frontend Framework**: React 19.3.0
- **Build Tool**: Vite 8.3.0
- **Styling**: CSS3 with animations
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage

## Project Structure

```
src/
├── App.jsx                 # Main app component
├── App.css                # Global styles
├── pages/
│   ├── AuthPage.jsx       # Login/SignUp page
│   └── Dashboard.jsx      # Main dashboard with tabs
├── components/
│   └── Stopwatch.jsx      # Stopwatch component
├── styles/
│   ├── AuthPage.css       # Auth page styles
│   ├── Dashboard.css      # Dashboard styles
│   └── Stopwatch.css      # Stopwatch styles
└── main.jsx               # React DOM entry point
```

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Usage

### Creating an Account
1. Click "Sign Up" on the login page
2. Enter your username, email, and password (min 6 characters)
3. Confirm your password
4. Click "Sign Up"

### Using the App
1. After logging in, navigate between Memories and Stopwatch tabs
2. **Add Memories**: Type in the input field and click "Add Memory"
3. **Set Importance**: Use the dropdown on each memory card to set priority
4. **Delete Memory**: Click the Delete button on any memory card
5. **Stopwatch**: Click Start to begin timing, use Lap to record intermediate times, and Reset to clear

### Data Storage
- All user accounts are stored in localStorage under the `users` key
- Each user's memories are stored under `memories_{userId}` in localStorage
- Session data is stored under `currentUser` key

## Features Details

### Memory Importance Levels
- **Important** (Red): High priority memories
- **Normal** (Blue): Regular notes - default
- **Low** (Gray): Non-urgent items

Memories are automatically sorted by importance level in the dashboard.

### Stopwatch Features
- Displays time in MM:SS.MS format
- Lap times are recorded with sequential numbering
- All lap times are preserved until reset
- Start button changes to Stop when timer is running
- Lap button is disabled when timer is not running