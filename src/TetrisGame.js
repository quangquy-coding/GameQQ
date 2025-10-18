import React, { useState, useEffect, useCallback } from 'react';
import './TetrisGame.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const PIECES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]], // J
  [[0,1,1],[1,1,0]], // S
  [[1,1,0],[0,1,1]]  // Z
];

function TetrisGame() {
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [piecePos, setPiecePos] = useState({ x: 4, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const createPiece = () => ({
    shape: PIECES[Math.floor(Math.random() * PIECES.length)],
    color: Math.floor(Math.random() * 7) + 1
  });

  const isValidMove = (piece, pos, newBoard = board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || 
              (newY >= 0 && newBoard[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = piecePos.y + y;
          const boardX = piecePos.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }

    // Clear lines
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }

    setScore(s => s + linesCleared * 100);
    setBoard(newBoard);
    
    const newPiece = createPiece();
    const newPos = { x: 4, y: 0 };
    
    if (!isValidMove(newPiece, newPos, newBoard)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setPiecePos(newPos);
    }
  }, [currentPiece, piecePos, board]);

  const movePiece = (dx, dy) => {
    if (!currentPiece || gameOver) return;
    
    const newPos = { x: piecePos.x + dx, y: piecePos.y + dy };
    if (isValidMove(currentPiece, newPos)) {
      setPiecePos(newPos);
    } else if (dy > 0) {
      placePiece();
    }
  };

  const rotatePiece = () => {
    if (!currentPiece || gameOver) return;
    
    const rotated = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, i) => 
        currentPiece.shape.map(row => row[i]).reverse()
      )
    };
    
    if (isValidMove(rotated, piecePos)) {
      setCurrentPiece(rotated);
    }
  };

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(createPiece());
    setPiecePos({ x: 4, y: 0 });
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleTouch = (e) => {
      if (!gameStarted || gameOver) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = e.target.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      
      if (y > height * 0.7) {
        movePiece(0, 1); // Drop
      } else if (x < width * 0.3) {
        movePiece(-1, 0); // Left
      } else if (x > width * 0.7) {
        movePiece(1, 0); // Right
      } else {
        rotatePiece(); // Rotate
      }
    };

    const handleKey = (e) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft': movePiece(-1, 0); break;
        case 'ArrowRight': movePiece(1, 0); break;
        case 'ArrowDown': movePiece(0, 1); break;
        case 'ArrowUp': rotatePiece(); break;
      }
    };

    window.addEventListener('keydown', handleKey);
    document.addEventListener('touchstart', handleTouch);
    
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [gameStarted, gameOver, currentPiece, piecePos]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      movePiece(0, 1);
    }, 500);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, currentPiece, piecePos]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = piecePos.y + y;
            const boardX = piecePos.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div className="tetris-game">
      <h2>🧩 Tetris</h2>
      <div className="score">Điểm: {score}</div>
      
      {!gameStarted && (
        <div className="game-controls">
          <button onClick={startGame} className="start-btn">Bắt Đầu</button>
          <p>Chạm: Trái/Phải/Xoay/Xuống</p>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Điểm: {score}</p>
          <button onClick={startGame} className="restart-btn">Chơi Lại</button>
        </div>
      )}

      <div className="tetris-board">
        {renderBoard().map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`tetris-cell color-${cell}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TetrisGame;