import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Stopwatch.css';

export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
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
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(ms).padStart(2, '0'),
    };
  };

  const { minutes, seconds, milliseconds } = formatTime(time);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-card">
        <div className="header">
          <h1>Stopwatch App</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>

        <div className="display">
          <div className="time">
            {minutes}:{seconds}.<span className="milliseconds">{milliseconds}</span>
          </div>
        </div>

        <div className="controls">
          {!isRunning ? (
            <button onClick={handleStart} className="btn btn-start">Start</button>
          ) : (
            <button onClick={handleStop} className="btn btn-stop">Stop</button>
          )}
          <button onClick={handleLap} className="btn btn-lap" disabled={!isRunning}>Lap</button>
          <button onClick={handleReset} className="btn btn-reset">Reset</button>
        </div>

        {laps.length > 0 && (
          <div className="laps-section">
            <h2>Laps</h2>
            <div className="laps-list">
              {laps.map((lap, index) => {
                const lapTime = formatTime(lap);
                return (
                  <div key={index} className="lap-item">
                    <span className="lap-number">Lap {index + 1}</span>
                    <span className="lap-time">
                      {lapTime.minutes}:{lapTime.seconds}.<span className="milliseconds">{lapTime.milliseconds}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
