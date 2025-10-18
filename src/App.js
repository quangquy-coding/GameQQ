import React, { useState } from 'react';
import SnakeGame from './SnakeGame';
import TRexGame from './TRexGame';
import FlappyBird from './FlappyBird';
import TetrisGame from './TetrisGame';
import PongGame from './PongGame';
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
          <button onClick={() => setCurrentGame('flappy')} className="game-btn">
            🐦 Flappy Bird
          </button>
          <button onClick={() => setCurrentGame('tetris')} className="game-btn">
            🧩 Tetris
          </button>
          <button onClick={() => setCurrentGame('pong')} className="game-btn">
            🏓 Pong
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

      {currentGame === 'flappy' && (
        <div>
          <button onClick={() => setCurrentGame('menu')} className="back-btn">
            ← Về Menu
          </button>
          <FlappyBird />
        </div>
      )}

      {currentGame === 'tetris' && (
        <div>
          <button onClick={() => setCurrentGame('menu')} className="back-btn">
            ← Về Menu
          </button>
          <TetrisGame />
        </div>
      )}

      {currentGame === 'pong' && (
        <div>
          <button onClick={() => setCurrentGame('menu')} className="back-btn">
            ← Về Menu
          </button>
          <PongGame />
        </div>
      )}
    </div>
  );
}

export default App;