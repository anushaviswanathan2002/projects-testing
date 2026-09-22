import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Stopwatch.css';

function Stopwatch({ currentUser, onLogout }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="stopwatch">
      <div className="header">
        <h1>Stopwatch</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate('/memory')} className="nav-btn">Go to Memory Game</button>
      </div>

      <div className="stopwatch-container">
        <div className="display">
          <h2>{formatTime(time)}</h2>
        </div>

        <div className="controls">
          <button onClick={handleStart} disabled={isRunning} className="btn start-btn">Start</button>
          <button onClick={handleStop} disabled={!isRunning} className="btn stop-btn">Stop</button>
          <button onClick={handleLap} disabled={!isRunning} className="btn lap-btn">Lap</button>
          <button onClick={handleReset} className="btn reset-btn">Reset</button>
        </div>

        <div className="laps">
          <h3>Laps:</h3>
          <div className="laps-list">
            {laps.length === 0 ? (
              <p className="no-laps">No laps yet</p>
            ) : (
              laps.map((lap, index) => (
                <div key={index} className="lap-item">
                  <span>Lap {index + 1}:</span>
                  <span>{formatTime(lap)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stopwatch;
