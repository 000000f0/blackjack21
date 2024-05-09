class BlackjackSimulation {
    constructor(numDecks = 6, penetration = 5 / 6) {
        this.numDecks = numDecks;
        this.penetration = penetration;
        this.cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
        this.deck = this.generateDeck();
        this.runningCount = 0;
        this.trueCount = 0;
        this.trueCounts = [];
        this.playerBankroll = 10000;
        this.minBet = 50;
        this.bet = this.minBet;
        this.stats = { wins: 0, losses: 0, pushes: 0, totalWon: 0, decksShuffled: 0 };
        this.results = [];
        this.bankrollProgression = [];

        this.shuffleDeck();
    }

    generateDeck() {
        const deck = [];
        for (let i = 0; i < this.numDecks; i++) {
            deck.push(...this.cardValues);
        }
        return deck;
    }

    shuffleDeck() {
        this.deck = this.generateDeck().sort(() => Math.random() - 0.5);
        this.runningCount = 0;
        this.updateTrueCount();
        this.stats.decksShuffled++;
    }

    dealCard() {
        if (this.deck.length === 0) {
            this.shuffleDeck();
        }
        const card = this.deck.pop();
        if (card >= 10) {
            this.runningCount--;
        } else if (card <= 6) {
            this.runningCount++;
        }
        return card;
    }

    updateTrueCount() {
        const remainingDecks = Math.max(1, this.deck.length / this.cardValues.length);
        this.trueCount = this.runningCount / remainingDecks;
        this.trueCounts.push(this.trueCount);
    }

    placeBet() {
        if (this.trueCount >= 2) {
            this.bet = 50 * (2 * this.trueCount);
        }
    }

    basicStrategy(playerHand, dealerCard) {
        const playerScore = playerHand.reduce((acc, card) => acc + card, 0);
        if (playerScore <= 11) {
            return 'hit';
        } else if (playerScore >= 17) {
            return 'stand';
        } else if (playerScore === 12) {
            return dealerCard <= 3 ? 'hit' : 'stand';
        } else if (playerScore >= 13 && playerScore <= 16) {
            return dealerCard >= 7 ? 'hit' : 'stand';
        }
    }

    playHand() {
        if (this.checkShuffle()) {
            this.shuffleDeck();
        }

        const playerHand = [this.dealCard(), this.dealCard()];
        const dealerHand = [this.dealCard(), this.dealCard()];

        // Check for natural blackjack
        if (playerHand.reduce((acc, card) => acc + card, 0) === 21 && dealerHand.reduce((acc, card) => acc + card, 0) !== 21) {
            this.stats.wins++;
            this.stats.totalWon += this.bet * 1.5;
            this.playerBankroll += this.bet * 1.5;
            this.results.push('win');
            return 'Player wins with a natural blackjack!';
        }

        // Player's turn
        while (true) {
            const action = this.basicStrategy(playerHand, dealerHand[0]);

            if (action === 'stand') {
                break;
            } else if (action === 'hit') {
                playerHand.push(this.dealCard());
            }

            const playerScore = playerHand.reduce((acc, card) => acc + card, 0);
            if (playerScore > 21) {
                this.stats.losses++;
                this.playerBankroll -= this.bet;
                this.results.push('loss');
                return 'Player busts!';
            }
        }

        // Dealer's turn
        while (dealerHand.reduce((acc, card) => acc + card, 0) < 17) {
            dealerHand.push(this.dealCard());
        }

        const playerScore = playerHand.reduce((acc, card) => acc + card, 0);
        const dealerScore = dealerHand.reduce((acc, card) => acc + card, 0);

        if (dealerScore > 21 || playerScore > dealerScore) {
            this.stats.wins++;
            this.stats.totalWon += this.bet;
            this.playerBankroll += this.bet;
            this.results.push('win');
            return 'Player wins!';
        } else if (playerScore === dealerScore) {
            this.stats.pushes++;
            this.results.push('push');
            return 'Push!';
        } else {
            this.stats.losses++;
            this.playerBankroll -= this.bet;
            this.results.push('loss');
            return 'Dealer wins!';
        }

        this.bankrollProgression.push(this.playerBankroll);

        if ((this.stats.wins + this.stats.losses + this.stats.pushes) % 5 === 0) {
            const remainingDecks = this.deck.length / this.cardValues.length;
            console.log(`Running Count: ${this.runningCount}`);
            console.log(`Remaining Decks: ${remainingDecks.toFixed(2)}`);
        }
    }

    checkShuffle() {
        const remainingCards = this.deck.length;
        const cardsNeededBeforeShuffle = this.cardValues.length * this.numDecks * (1 - this.penetration);
        return remainingCards <= cardsNeededBeforeShuffle;
    }
}

module.exports = BlackjackSimulation;
