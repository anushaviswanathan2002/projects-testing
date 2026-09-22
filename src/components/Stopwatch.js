import React, { useState, useEffect } from 'react';
import './Stopwatch.css';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
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
      ms: String(ms).padStart(2, '0')
    };
  };

  const { minutes, seconds, ms } = formatTime(time);

  const getLapTime = (lapMs) => {
    const formatted = formatTime(lapMs);
    return `${formatted.minutes}:${formatted.seconds}.${formatted.ms}`;
  };

  const getlapDifference = (index) => {
    if (index === 0) return laps[0];
    return laps[index] - laps[index - 1];
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-card">
        <h2>Stopwatch</h2>
        
        <div className="time-display">
          <span className="time-digits">
            {minutes}:{seconds}
          </span>
          <span className="time-ms">.{ms}</span>
        </div>

        <div className="controls">
          {!isRunning ? (
            <button onClick={handleStart} className="btn btn-start">
              Start
            </button>
          ) : (
            <button onClick={handlePause} className="btn btn-pause">
              Pause
            </button>
          )}
          
          <button onClick={handleLap} className="btn btn-lap" disabled={!isRunning}>
            Lap
          </button>
          
          <button onClick={handleReset} className="btn btn-reset">
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="laps-section">
            <h3>Laps</h3>
            <div className="laps-list">
              {laps.map((lap, index) => (
                <div key={index} className="lap-item">
                  <span className="lap-number">Lap {index + 1}</span>
                  <span className="lap-time">{getLapTime(lap)}</span>
                  <span className="lap-diff">
                    {index === 0 ? '—' : `+${formatTime(getlapDifference(index)).minutes}:${formatTime(getlapDifference(index)).seconds}`}
                  </span>
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
