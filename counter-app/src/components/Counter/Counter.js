import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Counter.css';

function Counter({ currentUser, onLogout }) {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleIncrement = () => setCount(count + step);
  const handleDecrement = () => setCount(count - step);
  const handleReset = () => setCount(0);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="counter">
      <div className="header">
        <h1>Counter App</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="counter-container">
        <div className="display">
          <h2>Current Count</h2>
          <div className="count-value">{count}</div>
        </div>

        <div className="step-control">
          <label htmlFor="step">Step Size:</label>
          <input
            type="number"
            id="step"
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value))}
            min="1"
          />
        </div>

        <div className="controls">
          <button onClick={handleDecrement} className="btn decrement-btn">
            Decrease
          </button>
          <button onClick={handleReset} className="btn reset-btn">
            Reset
          </button>
          <button onClick={handleIncrement} className="btn increment-btn">
            Increase
          </button>
        </div>

        <div className="history">
          <h3>Quick Actions</h3>
          <div className="quick-buttons">
            <button onClick={() => setCount(0)} className="quick-btn">0</button>
            <button onClick={() => setCount(10)} className="quick-btn">10</button>
            <button onClick={() => setCount(50)} className="quick-btn">50</button>
            <button onClick={() => setCount(100)} className="quick-btn">100</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;
