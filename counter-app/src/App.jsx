import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return (
    <div className="app">
      <div className="counter-card">
        <h1>Counter App</h1>
        
        <div className="counter-display">
          <p className="counter-value">{count}</p>
        </div>

        <div className="button-group">
          <button 
            className="btn btn-decrease"
            onClick={decrement}
            aria-label="Decrease count"
          >
            −
          </button>
          
          <button 
            className="btn btn-reset"
            onClick={reset}
            aria-label="Reset count"
          >
            Reset
          </button>
          
          <button 
            className="btn btn-increase"
            onClick={increment}
            aria-label="Increase count"
          >
            +
          </button>
        </div>

        <p className="status">
          {count === 0 && "Count is at zero"}
          {count > 0 && `Count is positive (+${count})`}
          {count < 0 && `Count is negative (${count})`}
        </p>
      </div>
    </div>
  )
}

export default App
