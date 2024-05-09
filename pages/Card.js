import React from 'react';

function Card({ value, darkMode }) {
  const displayValue = value === 11 ? 'A' : value; // Display 'A' for Ace

  // Define suits using Unicode characters
  const suits = ['\u2660', '\u2665', '\u2666', '\u2663']; // Spade, Heart, Diamond, Club

  // Choose a random suit for each card
  const suitIndex = Math.floor(Math.random() * suits.length);
  const suit = suits[suitIndex];
return (
  <div className={`card ${darkMode ? 'dark-mode' : ''}`}>
    <div className="card-value" >{displayValue}</div>
    <div className="card-suit">{suit}</div>
  </div>
);

}

export default Card;
