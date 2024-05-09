// GameControls.js
import React from 'react';

function GameControls({ startNewGame }) {
  return (
    <div className="game-controls">
      <h2>Game Controls</h2>
      <button onClick={startNewGame}>Start New Game</button>
    </div>
  );
}

export default GameControls;
