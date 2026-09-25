import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <div className="card">
        <h1>Counter</h1>
        <div className="count" aria-live="polite">{count}</div>
        <div className="buttons">
          <button
            className="btn decrement"
            onClick={() => setCount((c) => c - 1)}
            aria-label="Decrement"
          >
            −
          </button>
          <button
            className="btn reset"
            onClick={() => setCount(0)}
            aria-label="Reset"
          >
            Reset
          </button>
          <button
            className="btn increment"
            onClick={() => setCount((c) => c + 1)}
            aria-label="Increment"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
