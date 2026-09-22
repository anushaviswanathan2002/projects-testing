# Memory App - React Stopwatch & User Authentication

A modern React application featuring user authentication and a fully functional stopwatch with lap tracking capabilities.

## Features

### 🔐 User Authentication
- **Sign Up**: Create a new account with username, email, and password
- **Login**: Secure login with credentials validation
- **Session Management**: User sessions persist using localStorage
- **User Profile**: View your profile information and member details

### ⏱️ Stopwatch Features
- **Start/Stop/Reset**: Full control over stopwatch timing
- **Lap Recording**: Record lap times while the stopwatch is running
- **Lap History**: View all recorded laps with timestamps
- **Persistent Storage**: Lap times are saved per user in localStorage
- **Clear Laps**: Remove all recorded lap times

## Demo Credentials

For quick testing, use these credentials:
- **Username**: `demo`
- **Password**: `demo123`

## Project Structure

```
src/
├── components/
│   ├── Auth.jsx          # Login/Sign Up component
│   ├── Auth.css
│   ├── Dashboard.jsx     # Main dashboard with tabs
│   ├── Dashboard.css
│   ├── Stopwatch.jsx     # Stopwatch feature
│   └── Stopwatch.css
├── App.jsx               # Main app component
├── App.css
├── main.jsx              # Entry point
└── index.css
```

## Technical Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations
- **localStorage** - Data persistence

## User Data Storage

The app uses browser localStorage to store:
- **User accounts**: Username, email, password (in users array)
- **Current session**: Currently logged-in user
- **Lap times**: Per-user stopwatch lap history

> ⚠️ **Note**: This is a demo app. In production, never store passwords in plain text. Use proper authentication with hashed passwords and secure backends.

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features in Detail

### Stopwatch
- High-precision time tracking with centisecond accuracy
- Displays time in MM:SS.ms or HH:MM:SS.ms format
- Lap times automatically saved with timestamps
- Disable certain buttons based on stopwatch state

### Profile
- Displays user information
- Shows account creation date
- Clean, organized layout

## Responsive Design

The app is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## Future Enhancements

- Backend API integration
- Secure password hashing
- User profile customization
- Export lap times to CSV
- Dark mode toggle
- Multiple stopwatch presets
