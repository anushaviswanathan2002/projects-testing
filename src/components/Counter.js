import React from 'react';
import '../styles/Counter.css';

function Counter({ id, value, onIncrement, onDecrement, onReset, onDelete }) {
  return (
    <div className="counter-card">
      <div className="counter-display">
        <h3>Counter</h3>
        <div className="counter-value">{value}</div>
      </div>

      <div className="counter-buttons">
        <button 
          className="btn btn-decrement" 
          onClick={onDecrement}
          title="Decrease counter"
        >
          −
        </button>
        <button 
          className="btn btn-increment" 
          onClick={onIncrement}
          title="Increase counter"
        >
          +
        </button>
      </div>

      <div className="counter-actions">
        <button 
          className="btn btn-reset" 
          onClick={onReset}
          title="Reset counter to 0"
        >
          Reset
        </button>
        <button 
          className="btn btn-delete" 
          onClick={onDelete}
          title="Delete this counter"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Counter;
