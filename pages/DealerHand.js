// DealerHand.js
import React from 'react';

function DealerHand({ cards }) {
  return (
    <div className="dealer-hand">
      <h2>Dealer's Hand</h2>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>{card}</li>
        ))}
      </ul>
    </div>
  );
}

export default DealerHand;
