import { useState, useEffect } from 'react';
import './App.css';
import MemoryGame from './components/MemoryGame';

function App() {
  return (
    <div className="app">
      <h1>Memory Game</h1>
      <MemoryGame />
    </div>
  );
}

export default App;
