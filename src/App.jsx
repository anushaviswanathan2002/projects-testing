import React, { useState, useEffect } from 'react'
import './App.css'
import MemoryGame from './components/MemoryGame'

export default function App() {
  return (
    <div className="app">
      <MemoryGame />
    </div>
  )
}
