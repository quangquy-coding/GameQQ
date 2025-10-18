import React, { useState } from 'react';
import SnakeGame from './SnakeGame';
import TRexGame from './TRexGame';
import './App.css';

function App() {
  const [currentGame, setCurrentGame] = useState('menu');

  return (
    <div className="App">
      <h1>🎮 Game Vui</h1>
      
      {currentGame === 'menu' && (
        <div className="menu">
          <button onClick={() => setCurrentGame('snake')} className="game-btn">
            🐍 Game Rắn
          </button>
          <button onClick={() => setCurrentGame('trex')} className="game-btn">
            🦕 Game Khủng Long
          </button>
        </div>
      )}

      {currentGame === 'snake' && (
        <div>
          <button onClick={() => setCurrentGame('menu')} className="back-btn">
            ← Về Menu
          </button>
          <SnakeGame />
        </div>
      )}

      {currentGame === 'trex' && (
        <div>
          <button onClick={() => setCurrentGame('menu')} className="back-btn">
            ← Về Menu
          </button>
          <TRexGame />
        </div>
      )}
    </div>
  );
}

export default App;