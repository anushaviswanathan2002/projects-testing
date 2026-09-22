import React, { useState, useEffect } from 'react';

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
    setLaps([...laps, time]);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  const formatLapTime = (lapTime, index) => {
    const lapDuration = index === 0 ? lapTime : lapTime - laps[index - 1];
    return formatTime(lapDuration);
  };

  return (
    <div className="stopwatch-container">
      <h2>⏱️ Stopwatch</h2>
      <div className="stopwatch-display">{formatTime(time)}</div>

      <div className="stopwatch-buttons">
        <button
          className="start-stopwatch"
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="pause-stopwatch"
          onClick={handlePause}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button className="reset-stopwatch" onClick={handleReset}>
          Reset
        </button>
        <button
          className="start-stopwatch"
          onClick={handleLap}
          disabled={!isRunning && time === 0}
        >
          Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-list">
          <h3>Laps</h3>
          {laps.map((lap, index) => (
            <div key={index} className="lap-item">
              <span>Lap {index + 1}</span>
              <span>{formatLapTime(lap, index)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
