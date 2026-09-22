# Memory React App 🎯

A full-featured React application with user authentication and a stopwatch feature. Users can create accounts, log in, and use a professional stopwatch to track their workout times or any timing needs.

## Features

### 🔐 User Authentication
- **Sign Up**: Create a new account with username validation and password confirmation
- **Login**: Secure login with credentials validation
- **Local Storage**: User data persists across browser sessions
- **Logout**: Secure logout functionality

### ⏱️ Stopwatch Features
- **Start/Pause**: Easy control to start and pause the timer
- **Lap Tracking**: Record individual lap times during a workout
- **Reset**: Clear the current session
- **Save Times**: Save completed workout times to your personal history
- **Persistent Memory**: All saved times are stored per user in local storage
- **Time History**: View and manage all your saved workout times
- **Delete Individual Times**: Remove specific saved times from history
- **Clear All**: Clear your entire workout history

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern flexbox and grid
- **LocalStorage API** - Client-side data persistence

## Project Structure

```
memory-app/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login component
│   │   ├── Signup.jsx         # Sign up component
│   │   ├── Stopwatch.jsx      # Stopwatch component
│   │   ├── Auth.css           # Authentication styling
│   │   └── Stopwatch.css      # Stopwatch styling
│   ├── App.jsx                # Main app component
│   ├── App.css                # App styling
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies
└── vite.config.js            # Vite configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Navigate to the project directory:
   ```bash
   cd memory-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided URL (typically `http://localhost:5173`)

## Usage

### Creating an Account
1. Click "Sign up" on the login page
2. Enter a username (minimum 3 characters)
3. Enter a password (minimum 6 characters)
4. Confirm your password
5. Click "Sign Up"

### Logging In
1. Enter your username
2. Enter your password
3. Click "Login"

### Using the Stopwatch
1. **Start a Timer**: Click the "Start" button
2. **Pause**: Click "Pause" to stop the timer (can resume by clicking "Start" again)
3. **Record Laps**: While running, click "Lap" to record individual lap times
4. **Reset**: Click "Reset" to clear the current session
5. **Save Time**: Click "Save" to store the current time in your history
6. **View History**: Saved times appear in the "Saved Times" section below
7. **Delete Individual Times**: Click the ✕ button on any saved time
8. **Clear All Times**: Click "Clear All" to remove all saved times

## Data Storage

- **User Accounts**: Stored in `localStorage` under the key `users`
- **Current User**: Stored in `localStorage` under the key `currentUser`
- **Stopwatch Times**: Stored in `localStorage` under the key `stopwatch_times_[username]`

All data is stored locally in your browser and is not transmitted to any server.

## Security Notes

This is a demo application with client-side authentication. For production use:
- Implement server-side authentication
- Use HTTPS for data transmission
- Hash passwords using a secure algorithm
- Implement proper session management
- Use secure cookies instead of localStorage for sensitive data

## Building for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

## Features Demonstration

### Login/Sign Up
- Beautiful gradient UI with form validation
- Real-time error messages
- Toggle between login and signup forms

### Stopwatch
- High-precision timer with millisecond accuracy
- Responsive design for mobile and desktop
- Color-coded buttons for different actions
- Persistent data storage per user
- Lap tracking with chronological display

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Backend integration with MongoDB/Firebase
- User profile customization
- Multiple stopwatch presets
- Export workout history as CSV
- Dark mode support
- Push notifications for lap records
- Social sharing features

## License

This project is open source and available under the MIT License.
