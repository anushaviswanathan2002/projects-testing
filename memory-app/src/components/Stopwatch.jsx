import { useState, useEffect } from 'react';
import '../styles/Stopwatch.css';

function Stopwatch() {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setMilliseconds(prevMs => prevMs + 10);
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleLap = () => {
    if (isRunning || milliseconds > 0) {
      setLaps([...laps, { id: Date.now(), time: milliseconds }]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setMilliseconds(0);
    setLaps([]);
  };

  const getLapTime = (lapIndex) => {
    if (lapIndex === 0) {
      return laps[0].time;
    }
    return laps[lapIndex].time - laps[lapIndex - 1].time;
  };

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-display">
        <div className="time-display">
          {formatTime(milliseconds)}
        </div>
        
        <div className="stopwatch-controls">
          {!isRunning ? (
            <button className="control-btn start-btn" onClick={handleStart}>
              Start
            </button>
          ) : (
            <button className="control-btn pause-btn" onClick={handlePause}>
              Pause
            </button>
          )}
          
          <button className="control-btn lap-btn" onClick={handleLap}>
            Lap
          </button>
          
          <button className="control-btn reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="laps-section">
          <h3>Lap Times</h3>
          <div className="laps-list">
            {laps.map((lap, index) => (
              <div key={lap.id} className="lap-item">
                <span className="lap-number">Lap {index + 1}</span>
                <span className="lap-time">{formatTime(getLapTime(index))}</span>
                <span className="total-time">{formatTime(lap.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
