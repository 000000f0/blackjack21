// BettingArea.js
import React from 'react';

function BettingArea({ bankroll, bet, setBet }) {
  return (
    <div className="betting-area">
      <h2>Betting Area</h2>
      <p>Bankroll: ${bankroll}</p>
      <p>Bet: ${bet}</p>
      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(parseInt(e.target.value))}
      />
    </div>
  );
}

export default BettingArea;
