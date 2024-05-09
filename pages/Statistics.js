// Statistics.js
import React from 'react';

function Statistics({ gameStats }) {
  return (
    <div className="statistics">
      <h2>Game Statistics</h2>
      <p>Wins: {gameStats.wins}</p>
      <p>Losses: {gameStats.losses}</p>
      <p>Pushes: {gameStats.pushes}</p>
    </div>
  );
}

export default Statistics;
