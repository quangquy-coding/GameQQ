import React, { useState, useEffect, useCallback } from 'react';
import './TRexGame.css';

function TRexGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(3);

  const DINO_HEIGHT = 60;
  const OBSTACLE_WIDTH = 20;
  const GAME_WIDTH = 800;
  const GROUND_HEIGHT = 150;

  const jump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      setDinoY(100);
      
      setTimeout(() => {
        setDinoY(0);
        setIsJumping(false);
      }, 600);
    }
  }, [isJumping, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setGameSpeed(3);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setDinoY(0);
    setIsJumping(false);
    setObstacles([]);
    setGameSpeed(3);
  };

  // Xử lý phím nhấn
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };

    const handleClick = () => {
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [gameStarted, jump]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Tăng điểm
      setScore(s => s + 1);
      
      // Tăng tốc độ game
      setGameSpeed(speed => Math.min(speed + 0.005, 8));

      // Di chuyển và tạo chướng ngại vật
      setObstacles(currentObstacles => {
        let newObstacles = currentObstacles
          .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
          .filter(obs => obs.x > -OBSTACLE_WIDTH);

        // Tạo chướng ngại vật mới
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < GAME_WIDTH - 200) {
          if (Math.random() < 0.02) {
            newObstacles.push({
              x: GAME_WIDTH,
              y: 0,
              width: OBSTACLE_WIDTH,
              height: Math.random() > 0.5 ? 40 : 60
            });
          }
        }

        // Kiểm tra va chạm
        const dinoLeft = 50;
        const dinoRight = dinoLeft + 40;
        const dinoTop = GROUND_HEIGHT - DINO_HEIGHT - dinoY;
        const dinoBottom = GROUND_HEIGHT - dinoY;

        for (let obs of newObstacles) {
          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;
          const obsTop = GROUND_HEIGHT - obs.height;
          const obsBottom = GROUND_HEIGHT;

          if (dinoRight > obsLeft && dinoLeft < obsRight && 
              dinoBottom > obsTop && dinoTop < obsBottom) {
            setGameOver(true);
            break;
          }
        }

        return newObstacles;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, gameSpeed, dinoY]);

  return (
    <div className="trex-game">
      <h2>🦕 Game Khủng Long</h2>
      <div className="score">Điểm: {Math.floor(score / 10)}</div>
      
      {!gameStarted && (
        <div className="game-instructions">
          <p>Nhấn SPACE hoặc click để nhảy!</p>
          <button onClick={startGame} className="start-btn">Bắt Đầu</button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Điểm của bạn: {Math.floor(score / 10)}</p>
          <button onClick={resetGame} className="restart-btn">Chơi Lại</button>
        </div>
      )}

      <div className="game-container" style={{ width: GAME_WIDTH, height: 200 }}>
        {/* Khủng long */}
        <div 
          className={`dino ${isJumping ? 'jumping' : ''}`}
          style={{ 
            bottom: `${dinoY}px`,
            left: '50px'
          }}
        >
          🦕
        </div>

        {/* Chướng ngại vật */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
            style={{
              left: `${obstacle.x}px`,
              bottom: '0px',
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`
            }}
          />
        ))}

        {/* Mặt đất */}
        <div className="ground" />
      </div>
    </div>
  );
}

export default TRexGame;