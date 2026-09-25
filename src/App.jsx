import { useState } from 'react'
import './App.css'

const STEP = 1

function App() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((c) => c + STEP)
  const decrement = () => setCount((c) => c - STEP)
  const reset = () => setCount(0)

  return (
    <main className="app">
      <section className="counter-card">
        <h1 className="title">Counter</h1>
        <p className="count" aria-live="polite" aria-label={`Current count is ${count}`}>
          {count}
        </p>
        <div className="controls">
          <button
            type="button"
            className="btn btn-decrement"
            onClick={decrement}
            aria-label="Decrement"
          >
            −
          </button>
          <button
            type="button"
            className="btn btn-reset"
            onClick={reset}
            aria-label="Reset"
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-increment"
            onClick={increment}
            aria-label="Increment"
          >
            +
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
