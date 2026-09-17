import React, { useState, useEffect } from 'react';
import './Stopwatch.css';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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
  };

  return (
    <div className="stopwatch-container">
      <h1>Stopwatch</h1>
      <div className="display">
        <div className="time">{formatTime(time)}</div>
      </div>
      <div className="controls">
        {!isRunning ? (
          <button className="btn btn-start" onClick={handleStart}>
            Start
          </button>
        ) : (
          <button className="btn btn-stop" onClick={handleStop}>
            Stop
          </button>
        )}
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
