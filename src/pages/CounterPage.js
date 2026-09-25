import React, { useState, useEffect } from 'react';
import Counter from '../components/Counter';
import '../styles/CounterPage.css';

function CounterPage({ user, onLogout }) {
  const [counters, setCounters] = useState({});

  // Load counters from localStorage on mount
  useEffect(() => {
    const savedCounters = localStorage.getItem(`counters_${user}`);
    if (savedCounters) {
      setCounters(JSON.parse(savedCounters));
    }
  }, [user]);

  // Save counters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`counters_${user}`, JSON.stringify(counters));
  }, [counters, user]);

  const handleIncrement = (counterId) => {
    setCounters(prev => ({
      ...prev,
      [counterId]: (prev[counterId] || 0) + 1
    }));
  };

  const handleDecrement = (counterId) => {
    setCounters(prev => ({
      ...prev,
      [counterId]: (prev[counterId] || 0) - 1
    }));
  };

  const handleReset = (counterId) => {
    setCounters(prev => ({
      ...prev,
      [counterId]: 0
    }));
  };

  const handleAddCounter = () => {
    const newId = Date.now().toString();
    setCounters(prev => ({
      ...prev,
      [newId]: 0
    }));
  };

  const handleDeleteCounter = (counterId) => {
    setCounters(prev => {
      const newCounters = { ...prev };
      delete newCounters[counterId];
      return newCounters;
    });
  };

  return (
    <div className="counter-page">
      <div className="counter-container">
        <div className="header">
          <h1>Counter App</h1>
          <p className="user-info">Welcome, <span>{user}</span></p>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>

        <div className="counters-grid">
          {Object.entries(counters).map(([id, value]) => (
            <Counter
              key={id}
              id={id}
              value={value}
              onIncrement={() => handleIncrement(id)}
              onDecrement={() => handleDecrement(id)}
              onReset={() => handleReset(id)}
              onDelete={() => handleDeleteCounter(id)}
            />
          ))}
        </div>

        <button className="add-counter-btn" onClick={handleAddCounter}>
          + Add Counter
        </button>
      </div>
    </div>
  );
}

export default CounterPage;
