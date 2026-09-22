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
    } else {
      clearInterval(interval);
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

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleLap = () => {
    if (isRunning || time > 0) {
      const lapTime = {
        id: Date.now(),
        time: formatTime(time),
        milliseconds: time
      };
      setLaps([lapTime, ...laps]);
    }
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  return (
    <div className="stopwatch-container">
      <h2>Stopwatch</h2>
      <div className="stopwatch-display">
        <div className="time-display">{formatTime(time)}</div>
      </div>

      <div className="stopwatch-controls">
        {!isRunning ? (
          <button className="btn-control btn-start" onClick={handleStart}>
            Start
          </button>
        ) : (
          <button className="btn-control btn-pause" onClick={handlePause}>
            Pause
          </button>
        )}
        <button className="btn-control btn-lap" onClick={handleLap}>
          Lap
        </button>
        <button className="btn-control btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-section">
          <h3>Laps</h3>
          <div className="laps-list">
            {laps.map((lap, index) => (
              <div key={lap.id} className="lap-item">
                <span className="lap-number">Lap {laps.length - index}</span>
                <span className="lap-time">{lap.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
