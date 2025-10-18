import React, { useState, useEffect, useCallback } from 'react';
import './FlappyBird.css';

function FlappyBird() {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GAME_HEIGHT = 500;
  const GAME_WIDTH = 320;

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH);
    }
  }, [gameStarted, gameOver]);

  const resetGame = () => {
    setBirdY(250);
    setBirdVelocity(0);
    setPipes([]);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleInput = (e) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleInput);
    window.addEventListener('touchstart', handleInput);
    window.addEventListener('click', handleInput);
    
    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('click', handleInput);
    };
  }, [jump]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBirdY(y => {
        const newY = y + birdVelocity;
        if (newY < 0 || newY > GAME_HEIGHT - 40) {
          setGameOver(true);
          return y;
        }
        return newY;
      });

      setBirdVelocity(v => v + GRAVITY);

      setPipes(currentPipes => {
        let newPipes = currentPipes.map(pipe => ({ ...pipe, x: pipe.x - 3 }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
          const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
          newPipes.push({ x: GAME_WIDTH, gapY, passed: false });
        }

        // Check collision and score
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x < 50) {
            pipe.passed = true;
            setScore(s => s + 1);
          }

          if (pipe.x < 90 && pipe.x > 10) {
            if (birdY < pipe.gapY || birdY > pipe.gapY + PIPE_GAP - 40) {
              setGameOver(true);
            }
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdVelocity, birdY]);

  return (
    <div className="flappy-bird">
      <h2>🐦 Flappy Bird</h2>
      <div className="score">Điểm: {score}</div>
      
      <div className="game-area" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {!gameStarted && (
          <div className="start-message">
            <p>Chạm để bay!</p>
          </div>
        )}

        {gameOver && (
          <div className="game-over-overlay">
            <h3>Game Over!</h3>
            <p>Điểm: {score}</p>
            <button onClick={resetGame} className="restart-btn">Chơi Lại</button>
          </div>
        )}

        <div className="bird" style={{ top: `${birdY}px` }}>🐦</div>

        {pipes.map((pipe, index) => (
          <div key={index}>
            <div 
              className="pipe pipe-top"
              style={{ 
                left: `${pipe.x}px`,
                height: `${pipe.gapY}px`
              }}
            />
            <div 
              className="pipe pipe-bottom"
              style={{ 
                left: `${pipe.x}px`,
                top: `${pipe.gapY + PIPE_GAP}px`,
                height: `${GAME_HEIGHT - pipe.gapY - PIPE_GAP}px`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlappyBird;