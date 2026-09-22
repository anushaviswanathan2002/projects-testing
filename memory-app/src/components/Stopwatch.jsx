import { useState, useEffect } from 'react'
import './Stopwatch.css'

function Stopwatch({ username }) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const [savedTimes, setSavedTimes] = useState([])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime(t => t + 10)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    // Load saved times from localStorage
    const key = `stopwatch_times_${username}`
    const saved = JSON.parse(localStorage.getItem(key) || '[]')
    setSavedTimes(saved)
  }, [username])

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleLap = () => {
    if (time > 0) {
      setLaps([...laps, time])
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const handleSave = () => {
    if (time > 0) {
      const newSavedTimes = [...savedTimes, { time, date: new Date().toLocaleString() }]
      setSavedTimes(newSavedTimes)
      const key = `stopwatch_times_${username}`
      localStorage.setItem(key, JSON.stringify(newSavedTimes))
      handleReset()
    }
  }

  const handleDeleteSavedTime = (index) => {
    const newSavedTimes = savedTimes.filter((_, i) => i !== index)
    setSavedTimes(newSavedTimes)
    const key = `stopwatch_times_${username}`
    localStorage.setItem(key, JSON.stringify(newSavedTimes))
  }

  const handleClearAll = () => {
    setSavedTimes([])
    const key = `stopwatch_times_${username}`
    localStorage.removeItem(key)
  }

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-card">
        <h2>⏱️ Stopwatch</h2>
        
        <div className="timer-display">
          <div className="time">{formatTime(time)}</div>
        </div>

        <div className="controls">
          {!isRunning ? (
            <button className="btn btn-start" onClick={handleStart}>
              Start
            </button>
          ) : (
            <button className="btn btn-pause" onClick={handlePause}>
              Pause
            </button>
          )}
          <button className="btn btn-lap" onClick={handleLap} disabled={!isRunning}>
            Lap
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-save" onClick={handleSave}>
            Save
          </button>
        </div>

        {laps.length > 0 && (
          <div className="laps-section">
            <h3>Current Laps</h3>
            <div className="laps-list">
              {laps.map((lap, index) => (
                <div key={index} className="lap-item">
                  <span>Lap {index + 1}</span>
                  <span>{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {savedTimes.length > 0 && (
        <div className="saved-times-card">
          <div className="saved-header">
            <h2>📝 Saved Times</h2>
            <button className="btn btn-clear-all" onClick={handleClearAll}>
              Clear All
            </button>
          </div>
          <div className="saved-list">
            {savedTimes.map((item, index) => (
              <div key={index} className="saved-item">
                <div className="saved-info">
                  <div className="saved-time">{formatTime(item.time)}</div>
                  <div className="saved-date">{item.date}</div>
                </div>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDeleteSavedTime(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Stopwatch
