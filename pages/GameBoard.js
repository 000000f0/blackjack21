import React, { useState, useEffect } from 'react';
import Card from './Card';

function GameBoard({ simulationRunning, onSimulationEnd, isDarkMode }) {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameResult, setGameResult] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    if (simulationRunning) {
      setLoading(true);
      startSimulation();
    }
  }, [simulationRunning]);

  useEffect(() => {
    if (simulation) {
      simulation.onResultUpdate((result) => {
        setGameResult(result);
        onSimulationEnd();
      });
      simulation.simulate();
    }
  }, [simulation]);

  const startSimulation = () => {
    setGameResult('');
    setPlayerHand([getRandomCard(), getRandomCard()]);
    setDealerHand([getRandomCard()]);
    setLoading(false);
  };

  const getRandomCard = () => {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    return cards[Math.floor(Math.random() * cards.length)];
  };

  const calculateHandScore = (hand) => {
    let score = hand.reduce((sum, card) => sum + card, 0);
    let aceCount = hand.filter((card) => card === 11).length;
    while (aceCount > 0 && score > 21) {
      score -= 10;
      aceCount--;
    }
    return score;
  };

  const handleHit = () => {
    const newCard = getRandomCard();
    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);
    const newScore = calculateHandScore(newPlayerHand);
    setPlayerScore(newScore);

    if (newScore > 21) {
      setGameResult('Player busts!');
      onSimulationEnd();
    } else {
      // Check if the player should stand based on basic strategy
      const shouldStand = shouldPlayerStand(newScore, dealerHand[0]);
      if (shouldStand) {
        handleStand();
      }
    }
  };

  const handleStand = () => {
    // Implement logic for the dealer's turn
    // Dealer hits until their score is at least 17
    let dealerHandCopy = [...dealerHand];
    let dealerScore = calculateHandScore(dealerHandCopy);
    
    while (dealerScore < 17) {
      const newCard = getRandomCard();
      dealerHandCopy.push(newCard);
      dealerScore = calculateHandScore(dealerHandCopy);
    }
  
    setDealerHand(dealerHandCopy);
    setDealerScore(dealerScore);
  
    // Determine the game result
    determineGameResult();
    onSimulationEnd();
  };
  

  const shouldPlayerStand = (playerScore, dealerUpCard) => {
    // Define basic strategy rules here
    // Example rules: stand on hard 17 or higher
    return playerScore >= 17;
  };

  const determineGameResult = () => {
    const playerScore = calculateHandScore(playerHand);
    const dealerScore = calculateHandScore(dealerHand);

    if (playerScore > 21) {
      setGameResult('Player busts!');
    } else if (dealerScore > 21 || dealerScore < playerScore) {
      setGameResult('Player wins!');
    } else if (dealerScore > playerScore) {
      setGameResult('Dealer wins!');
    } else {
      setGameResult('Push!');
    }
  };

  return (
    <div className={`game-board ${isDarkMode ? 'dark-mode' : ''}`}>
      {loading ? (
        <div className="loading">
          {/* Placeholder for loading state */}
        </div>
      ) : (
        <div>
          <table>
            <tbody>
              <tr>
                {dealerHand.map((value, index) => (
                  <td key={`dealer-${index}`} style={{   }}>D<Card value={value} /></td>
                ))}
              </tr>
              <tr>
                {playerHand.map((value, index) => (
                  <td key={`player-${index}`} style={{  }}>P<Card value={value} /></td>
                ))}
              </tr>
              <tr>
                <td colSpan="2" style={{ border: '1px solid black' }}><h2>Player Score: {playerScore}</h2></td>
              </tr>
              <tr>
                <td colSpan="2" style={{ border: '1px solid black' }}><h2>Dealer Score: {dealerScore}</h2></td>
              </tr>
              {gameResult && (
                <tr>
                  <td colSpan="2" style={{ border: '1px solid black' }}><h2>Result: {gameResult}</h2></td>
                </tr>
              )}
            </tbody>
          </table>
          {!gameResult && (
            <div>
              <button onClick={handleHit}>Hit</button>
              <button onClick={handleStand}>Stand</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GameBoard;
