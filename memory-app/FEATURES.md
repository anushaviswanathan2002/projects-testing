# Memory React App - Features & Documentation

## Overview
A full-featured React application with user authentication and a stopwatch tool. The app uses localStorage for persistent data management and provides a modern, responsive user interface.

## Features

### 1. **Authentication System**
- **Sign Up**: Create a new account with name, email, and password
  - Validates password strength (minimum 6 characters)
  - Confirms password match
  - Prevents duplicate email registration
  
- **Login**: Authenticate with email and password
  - Persistent login using localStorage
  - Session restoration on app reload
  
- **Logout**: Securely log out and return to login screen

### 2. **Dashboard**
- **Welcome Header**: Displays the logged-in user's name
- **Navigation Tabs**:
  - **Stopwatch Tab**: Access the stopwatch feature
  - **Profile Tab**: View user profile information
  
### 3. **Stopwatch Feature**
A fully functional stopwatch with the following capabilities:

#### Controls:
- **Start/Pause**: Begin or pause the timer
- **Lap**: Record lap times while the timer is running
- **Reset**: Clear the timer and all lap records

#### Display:
- Large, easy-to-read time display (MM:SS.CS format)
- Real-time updates every 10 milliseconds
- Gradient text effect for visual appeal

#### Lap Tracking:
- Displays all recorded lap times
- Shows individual lap duration (time since last lap)
- Shows total elapsed time for each lap
- Scrollable lap list for many laps
- Lap data persists during the session

### 4. **User Profile**
- Display user's full name
- Display registered email
- Show account creation date

## Technical Stack

### Frontend:
- **React 18+**: UI library
- **Vite**: Build tool for fast development and optimized production builds
- **CSS3**: Modern styling with gradients, flexbox, and grid

### State Management:
- **React Hooks**: useState, useEffect for component state
- **localStorage**: Persistent data storage for user accounts and session

### Data Structure:
```javascript
// User Object
{
  id: timestamp,
  name: string,
  email: string,
  password: string,
  createdAt: ISO timestamp
}

// Lap Object
{
  id: timestamp,
  time: milliseconds
}
```

## User Experience

### Authentication Flow:
1. User visits app
2. Presented with login/signup toggle
3. New users can sign up with validation
4. Existing users log in
5. Session persists across page reloads

### Stopwatch Workflow:
1. User navigates to Stopwatch tab
2. Starts timer by clicking "Start"
3. Can pause at any time with "Pause"
4. Records lap times by clicking "Lap"
5. Resets timer and clears laps with "Reset"

## Design Features

- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Gradient Design**: Modern purple-blue gradient color scheme
- **Intuitive Controls**: Large, color-coded buttons for different actions
- **Visual Feedback**: Hover effects and transitions for better UX
- **Accessible Forms**: Clear labels and error messages

## Security Considerations

- Passwords stored in localStorage (for demo purposes only)
  - **Note**: In production, use secure backend authentication with hashed passwords
- No sensitive data exposed in URLs
- Logout clears user session

## File Structure

```
memory-app/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── Dashboard.jsx
│   │   └── Stopwatch.jsx
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   └── Stopwatch.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── index.html
```

## How to Run

### Development:
```bash
npm install
npm run dev
```

### Production Build:
```bash
npm install
npm run build
npm preview
```

## Future Enhancements

- Backend API integration for secure authentication
- Database for persistent user data
- More timer features (timer countdown, multiple stopwatches)
- User preferences and settings
- Export lap data functionality
- Dark mode toggle
