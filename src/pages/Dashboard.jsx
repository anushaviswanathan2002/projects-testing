import { useState } from 'react'
import Stopwatch from '../components/Stopwatch'

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="container">
      <button className="logout-btn" onClick={onLogout}>Logout</button>
      
      <div className="user-info">
        <h2>Welcome, <strong>{user.name}</strong>!</h2>
        <p>Email: {user.email}</p>
      </div>

      <div className="stopwatch-container">
        <h2>⏱️ Stopwatch</h2>
        <Stopwatch />
      </div>
    </div>
  )
}
