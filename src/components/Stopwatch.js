import React, { useState, useEffect } from 'react';
import '../styles/Stopwatch.css';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

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
      setLaps([...laps, { time, id: Date.now() }]);
    }
  };

  const handleClearLaps = () => {
    setLaps([]);
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-box">
        <h2>Stopwatch</h2>
        <div className="stopwatch-display">
          {formatTime(time)}
        </div>
        <div className="stopwatch-controls">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="btn-start"
          >
            Start
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="btn-stop"
          >
            Stop
          </button>
          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="btn-lap"
          >
            Lap
          </button>
          <button
            onClick={handleReset}
            className="btn-reset"
          >
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="laps-section">
            <div className="laps-header">
              <h3>Laps</h3>
              <button
                onClick={handleClearLaps}
                className="btn-clear-laps"
              >
                Clear Laps
              </button>
            </div>
            <div className="laps-list">
              {laps.map((lap, index) => (
                <div key={lap.id} className="lap-item">
                  <span className="lap-number">Lap {index + 1}</span>
                  <span className="lap-time">{formatTime(lap.time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stopwatch;
