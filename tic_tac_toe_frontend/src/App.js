import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Modern, minimalistic, and responsive Tic Tac Toe game.
 *
 * Features:
 * - Interactive board with two-player local mode.
 * - Win/draw detection.
 * - Game reset functionality.
 * - Centered layout, responsive and touch-friendly.
 * - Status display above board, reset button below.
 * - Custom colors and accessible design.
 */

// Helper constants for board and player representation
const BOARD_SIZE = 3;
const EMPTY = null;
const PLAYER_X = "X";
const PLAYER_O = "O";

/**
 * Returns the winner ("X" or "O") or "draw" or null if game is ongoing
 */
function calculateWinner(cells) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diags
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], winLine: [a, b, c] };
    }
  }
  if (cells.every((cell) => cell !== EMPTY)) {
    return { winner: "draw", winLine: [] };
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [xIsNext, setXIsNext] = useState(true);
  const [winResult, setWinResult] = useState(null);

  // Reset board and state
  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(Array(9).fill(EMPTY));
    setXIsNext(true);
    setWinResult(null);
  };

  // Handle cell click
  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    if (board[index] !== EMPTY || winResult) return;
    const boardCopy = [...board];
    boardCopy[index] = xIsNext ? PLAYER_X : PLAYER_O;
    const result = calculateWinner(boardCopy);
    setBoard(boardCopy);
    setWinResult(result);
    if (!result) setXIsNext((x) => !x);
  };

  // Compute board status
  let status, statusColor;
  if (winResult) {
    if (winResult.winner === "draw") {
      status = "It's a draw!";
      statusColor = "var(--text-secondary)";
    } else {
      status = `Winner: ${winResult.winner}`;
      statusColor = winResult.winner === "X" ? "var(--primary)" : "var(--accent)";
    }
  } else {
    status = `Next turn: ${xIsNext ? PLAYER_X : PLAYER_O}`;
    statusColor = xIsNext ? "var(--primary)" : "var(--accent)";
  }

  // Styling for cell
  // Returns accent color for win line, else normal
  function getCellClass(i) {
    if (!winResult) return "ttt-cell";
    if (winResult.winLine.includes(i)) return "ttt-cell win";
    return "ttt-cell";
  }

  // Render a single cell
  function renderCell(i) {
    return (
      <button
        className={getCellClass(i)}
        onClick={() => handleCellClick(i)}
        aria-label={`cell ${i} ${board[i] ? board[i] : ""}`}
        key={i}
        tabIndex={0}
        disabled={!!winResult || board[i]}
      >
        {board[i]}
      </button>
    );
  }

  // PUBLIC_INTERFACE
  useEffect(() => {
    document.title = "Tic Tac Toe";
  }, []);

  return (
    <div className="ttt-app-outer">
      <main className="ttt-main-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" style={{ color: statusColor }}>
          {status}
        </div>
        <div
          className="ttt-board"
          role="grid"
          aria-label="Tic Tac Toe board"
        >
          {board.map((cell, idx) => renderCell(idx))}
        </div>
        <button className="ttt-reset-btn" onClick={handleReset}>
          Reset Game
        </button>
        <footer className="ttt-footer">
          <span>
            <a
              href="https://reactjs.org"
              className="ttt-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Made with React
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
