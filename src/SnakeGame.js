import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setDirection({ x: 1, y: 0 });
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    const handleTouch = (e) => {
      if (!gameStarted) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = e.target.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) setDirection({ x: 1, y: 0 });
        if (deltaX < 0 && direction.x === 0) setDirection({ x: -1, y: 0 });
      } else {
        if (deltaY > 0 && direction.y === 0) setDirection({ x: 0, y: 1 });
        if (deltaY < 0 && direction.y === 0) setDirection({ x: 0, y: -1 });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [direction, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        
        head.x += direction.x;
        head.y += direction.y;

        // Kiểm tra va chạm tường
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true);
          return currentSnake;
        }

        // Kiểm tra va chạm thân
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return currentSnake;
        }

        newSnake.unshift(head);

        // Kiểm tra ăn thức ăn
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameStarted, gameOver, generateFood]);

  return (
    <div className="snake-game">
      <h2>🐍 Game Rắn</h2>
      <div className="score">Điểm: {score}</div>
      
      {!gameStarted && !gameOver && (
        <div className="game-controls">
          <button onClick={startGame} className="start-btn">Bắt Đầu</button>
          <p>Phím mũi tên hoặc chạm màn hình</p>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Điểm của bạn: {score}</p>
          <button onClick={resetGame} className="restart-btn">Chơi Lại</button>
        </div>
      )}

      <div className="game-board">
        {Array.from({ length: BOARD_SIZE }, (_, y) =>
          Array.from({ length: BOARD_SIZE }, (_, x) => {
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
            
            return (
              <div
                key={`${x}-${y}`}
                className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''} ${isHead ? 'head' : ''}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default SnakeGame;