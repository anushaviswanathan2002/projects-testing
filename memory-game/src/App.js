import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 Memory Game</h1>
        <p>Match pairs of cards!</p>
      </header>
      <main>
        <GameBoard />
      </main>
    </div>
  );
}

export default App;
