import React, { useState, useEffect } from 'react'
import '../styles/Stopwatch.css'

function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)

    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      ms: String(ms).padStart(2, '0')
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [...prev, { id: Date.now(), time }])
    }
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
    setLaps([])
  }

  const { minutes, seconds, ms } = formatTime(time)

  return (
    <div className="stopwatch-container">
      <h2>Stopwatch</h2>
      <div className="stopwatch-display">
        <div className="time-display">
          {minutes}:{seconds}
          <span className="milliseconds">.{ms}</span>
        </div>
      </div>

      <div className="stopwatch-controls">
        {!isRunning ? (
          <button className="btn btn-start" onClick={handleStart}>
            Start
          </button>
        ) : (
          <button className="btn btn-stop" onClick={handleStop}>
            Stop
          </button>
        )}
        <button className="btn btn-lap" onClick={handleLap} disabled={!isRunning}>
          Lap
        </button>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-section">
          <h3>Laps</h3>
          <div className="laps-list">
            {laps.map((lap, index) => {
              const { minutes: m, seconds: s, ms: ms_val } = formatTime(lap.time)
              return (
                <div key={lap.id} className="lap-item">
                  <span className="lap-number">Lap {index + 1}</span>
                  <span className="lap-time">
                    {m}:{s}.{ms_val}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Stopwatch
