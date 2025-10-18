import React, { useState, useEffect, useCallback } from 'react';
import './PongGame.css';

function PongGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [ball, setBall] = useState({ x: 160, y: 200, dx: 3, dy: 3 });
  const [playerY, setPlayerY] = useState(175);
  const [aiY, setAiY] = useState(175);
  const [touchY, setTouchY] = useState(null);

  const GAME_WIDTH = 320;
  const GAME_HEIGHT = 400;
  const PADDLE_HEIGHT = 50;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;

  const resetBall = () => {
    setBall({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      dx: Math.random() > 0.5 ? 3 : -3,
      dy: Math.random() > 0.5 ? 3 : -3
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore({ player: 0, ai: 0 });
    resetBall();
  };

  const handleTouch = useCallback((e) => {
    if (!gameStarted) return;
    e.preventDefault();
    
    const rect = e.target.getBoundingClientRect();
    const y = e.touches[0].clientY - rect.top;
    setTouchY(y);
    setPlayerY(Math.max(0, Math.min(y - PADDLE_HEIGHT/2, GAME_HEIGHT - PADDLE_HEIGHT)));
  }, [gameStarted]);

  useEffect(() => {
    const gameArea = document.querySelector('.pong-game-area');
    if (gameArea) {
      gameArea.addEventListener('touchmove', handleTouch);
      gameArea.addEventListener('touchstart', handleTouch);
      
      return () => {
        gameArea.removeEventListener('touchmove', handleTouch);
        gameArea.removeEventListener('touchstart', handleTouch);
      };
    }
  }, [handleTouch]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBall(currentBall => {
        let newBall = { ...currentBall };
        
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Top/bottom collision
        if (newBall.y <= 0 || newBall.y >= GAME_HEIGHT - BALL_SIZE) {
          newBall.dy = -newBall.dy;
        }

        // Player paddle collision
        if (newBall.x <= PADDLE_WIDTH && 
            newBall.y >= playerY && 
            newBall.y <= playerY + PADDLE_HEIGHT) {
          newBall.dx = -newBall.dx;
          newBall.x = PADDLE_WIDTH;
        }

        // AI paddle collision
        if (newBall.x >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && 
            newBall.y >= aiY && 
            newBall.y <= aiY + PADDLE_HEIGHT) {
          newBall.dx = -newBall.dx;
          newBall.x = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE;
        }

        // Score
        if (newBall.x < 0) {
          setScore(s => ({ ...s, ai: s.ai + 1 }));
          setTimeout(resetBall, 1000);
          return { x: GAME_WIDTH/2, y: GAME_HEIGHT/2, dx: 0, dy: 0 };
        }
        
        if (newBall.x > GAME_WIDTH) {
          setScore(s => ({ ...s, player: s.player + 1 }));
          setTimeout(resetBall, 1000);
          return { x: GAME_WIDTH/2, y: GAME_HEIGHT/2, dx: 0, dy: 0 };
        }

        return newBall;
      });

      // AI movement
      setAiY(currentAiY => {
        const ballCenter = ball.y + BALL_SIZE/2;
        const paddleCenter = currentAiY + PADDLE_HEIGHT/2;
        const diff = ballCenter - paddleCenter;
        
        if (Math.abs(diff) > 2) {
          const move = diff > 0 ? 2 : -2;
          return Math.max(0, Math.min(currentAiY + move, GAME_HEIGHT - PADDLE_HEIGHT));
        }
        return currentAiY;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, ball, playerY, aiY]);

  return (
    <div className="pong-game">
      <h2>🏓 Pong</h2>
      <div className="pong-score">
        Bạn: {score.player} - AI: {score.ai}
      </div>
      
      {!gameStarted && (
        <div className="game-controls">
          <button onClick={startGame} className="start-btn">Bắt Đầu</button>
          <p>Chạm và kéo để di chuyển paddle</p>
        </div>
      )}

      <div className="pong-game-area" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {/* Player paddle */}
        <div 
          className="paddle player-paddle"
          style={{ 
            left: '0px',
            top: `${playerY}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`
          }}
        />
        
        {/* AI paddle */}
        <div 
          className="paddle ai-paddle"
          style={{ 
            right: '0px',
            top: `${aiY}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`
          }}
        />
        
        {/* Ball */}
        <div 
          className="ball"
          style={{ 
            left: `${ball.x}px`,
            top: `${ball.y}px`,
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`
          }}
        />
        
        {/* Center line */}
        <div className="center-line" />
      </div>
    </div>
  );
}

export default PongGame;