import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <div className="card">
        <h1>Counter</h1>
        <div className="count" data-testid="count">{count}</div>
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
        <p className="hint">Click + or − to change the value. Reset returns it to 0.</p>
      </div>
    </div>
  )
}