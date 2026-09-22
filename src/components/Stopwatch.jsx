import { useState, useEffect } from 'react'

export default function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
  }

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time])
    }
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
    setLaps([])
  }

  return (
    <>
      <div className="stopwatch-display">
        {formatTime(time)}
      </div>

      <div className="stopwatch-buttons">
        <button onClick={handleStartStop}>
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button onClick={handleLap} disabled={!isRunning}>
          📍 Lap
        </button>
        <button className="reset-btn" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-list">
          <h3>Lap Times</h3>
          {laps.map((lap, index) => (
            <div key={index} className="lap-item">
              <span className="lap-number">Lap {index + 1}</span>
              <span>{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
