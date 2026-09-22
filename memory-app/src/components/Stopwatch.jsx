import { useState, useEffect } from 'react';
import './Stopwatch.css';

function Stopwatch({ userId }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Load saved times from localStorage
  useEffect(() => {
    const savedTimes = localStorage.getItem(`stopwatch_${userId}`);
    if (savedTimes) {
      setLaps(JSON.parse(savedTimes));
    }
  }, [userId]);

  // Save times to localStorage
  useEffect(() => {
    localStorage.setItem(`stopwatch_${userId}`, JSON.stringify(laps));
  }, [laps, userId]);

  // Timer logic
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
  };

  const handleLap = () => {
    const lap = {
      id: Date.now(),
      time: formatTime(time),
      timestamp: new Date().toLocaleTimeString(),
    };
    setLaps([lap, ...laps]);
  };

  const handleClearLaps = () => {
    setLaps([]);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(ms)}`;
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-card">
        <div className="stopwatch-display">
          <div className="time-display">{formatTime(time)}</div>
        </div>

        <div className="controls">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="btn btn-start"
          >
            ▶️ Start
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="btn btn-stop"
          >
            ⏸️ Stop
          </button>
          <button
            onClick={handleReset}
            className="btn btn-reset"
          >
            🔄 Reset
          </button>
          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="btn btn-lap"
          >
            ⏱️ Lap
          </button>
        </div>
      </div>

      <div className="laps-section">
        <div className="laps-header">
          <h3>Lap Times ({laps.length})</h3>
          {laps.length > 0 && (
            <button
              onClick={handleClearLaps}
              className="clear-btn"
            >
              🗑️ Clear
            </button>
          )}
        </div>

        <div className="laps-list">
          {laps.length === 0 ? (
            <div className="no-laps">No lap times yet. Start the stopwatch and click "Lap" to record times.</div>
          ) : (
            <ul>
              {laps.map((lap, index) => (
                <li key={lap.id} className="lap-item">
                  <span className="lap-number">Lap {laps.length - index}</span>
                  <span className="lap-time">{lap.time}</span>
                  <span className="lap-timestamp">{lap.timestamp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stopwatch;
