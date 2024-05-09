// PlayerHand.js
import React from 'react';

function PlayerHand({ cards }) {
  return (
    <div className="player-hand">
      <h2>Player's Hand</h2>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>{card}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerHand;
