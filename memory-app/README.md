# Memory App

A React application featuring user authentication and a stopwatch utility.

## Features

- **User Authentication**
  - Sign up with email and password
  - Login to existing account
  - Logout functionality
  - Local storage persistence

- **Stopwatch**
  - Start, pause, and reset timer
  - Record lap times
  - Display formatted time in MM:SS.MS format
  - View lap history

- **User Profile**
  - View account information
  - Display user email and account ID

## Getting Started

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

The app will open in your browser at http://localhost:3000

## Authentication

### Sign Up
1. Click "Sign Up" on the auth page
2. Enter email and password (minimum 6 characters)
3. Confirm password matches
4. Account is created and stored in local storage

### Login
1. Enter your registered email and password
2. Successfully logged in users can access the dashboard

### Logout
Click "Logout" button in the dashboard to logout

## Stopwatch Usage

1. Click "Start" to begin timing
2. Click "Pause" to temporarily stop the timer
3. Click "Lap" to record a lap time
4. Click "Reset" to clear the timer and all laps

## Data Storage

- User credentials are stored in browser's localStorage
- Logout clears the current session but preserves user accounts
