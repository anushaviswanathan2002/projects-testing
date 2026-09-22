# Memory React App - Authentication & Stopwatch

A full-stack React application featuring user authentication (login/signup) and a fully functional stopwatch.

## Features

### 🔐 User Authentication
- **Sign Up**: Create a new account with username, email, and password
- **Login**: Secure login with email and password validation
- **Password Confirmation**: Password matching validation during signup
- **Logout**: Secure logout with redirect to login page
- **Session Management**: User state persisted during session

### ⏱️ Stopwatch Feature
- **Start/Stop**: Control stopwatch timing
- **Lap Recording**: Record lap times while running
- **Reset**: Clear all data and restart
- **Millisecond Precision**: Display time with millisecond accuracy
- **Lap History**: View all recorded laps with their times

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Styling**: CSS3

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Login.jsx           # Login form component
│   ├── Signup.jsx          # Sign up form component
│   ├── Stopwatch.jsx       # Stopwatch main component
│   ├── Auth.css            # Authentication styles
│   └── Stopwatch.css       # Stopwatch styles
├── store/
│   └── authStore.js        # Zustand authentication store
├── App.jsx                 # Main app with routing
├── App.css                 # Global styles
├── index.css               # Base styles
└── main.jsx                # React entry point
```

## How to Use

### Signing Up
1. Click "Sign up here" on the login page
2. Enter username, email, and password
3. Confirm your password
4. Click "Sign Up"

### Logging In
1. Enter your registered email
2. Enter your password
3. Click "Login"

### Using the Stopwatch
1. After login, you'll be on the stopwatch page
2. Click **Start** to begin timing
3. Click **Lap** while running to record lap times
4. Click **Stop** to pause the stopwatch
5. Click **Reset** to clear everything
6. Click **Logout** to exit and return to login

## Features in Detail

### Form Validation
- Email field validation
- Password length requirement (minimum 6 characters)
- Password confirmation matching
- Required field validation

### Stopwatch Accuracy
- 10ms interval updates
- Displays minutes, seconds, and centiseconds
- Lap times preserved for entire session
- Easy-to-read monospace font for time display

## Future Enhancements
- Persistent user database
- Password encryption with bcrypt
- Email verification
- Lap time statistics (fastest, slowest, average)
- Export lap times
- Dark mode theme
