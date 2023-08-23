// Define the deck and initial game state
let deck = [];
let dealerHand = [];
let playerHand = [];
let wins = 0;
let losses = 0;
let ties = 0;


// Function to create a deck of cards
function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

// Function to shuffle the deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap the elements
  }
}

// Function to deal a card
function dealCard(hand) {
  hand.push(deck.pop());
}

// Function to calculate the value of a hand
function calculateHandValue(hand) {
  let value = 0;
  let aceCount = 0;
  for (let card of hand) {
    if (card.value === 'Ace') {
      aceCount++;
      value += 11;
    } else if (['King', 'Queen', 'Jack'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  // Handle Aces as 1 or 11
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}
// Event listeners for the buttons
document.querySelector('.button-85:nth-child(1)').addEventListener('click', deal); // Deal button
document.querySelector('.button-85:nth-child(2)').addEventListener('click', hit);  // Hit button
document.querySelector('.button-85:nth-child(3)').addEventListener('click', stand); // Stand button


// Function to render a hand
function renderHand(hand, elementId, reveal) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
    for (let i = 0; i < hand.length; i++) {
      const cardElement = document.createElement('img');
      cardElement.className = 'card';
  
      // If it's the dealer's hand and the reveal flag is false, show the back of the first card
      if (elementId === 'dealer-cards' && i === 0 && !reveal) {
        cardElement.src = 'cards/back.png'; // Path to a card back image
      } else {
        let value = hand[i].value === 'Jack' ? 'J' : hand[i].value === 'Queen' ? 'Q' : hand[i].value === 'King' ? 'K' : hand[i].value === 'Ace' ? 'A' : hand[i].value;
        let suit = hand[i].suit.charAt(0).toUpperCase();
        cardElement.src = `cards/${value}-${suit}.png`;
      }
  
      handElement.appendChild(cardElement);
    }
  }
  

// Function to update the user interface
function updateUI(revealDealerHand = false) {
  renderHand(dealerHand, 'dealer-cards', revealDealerHand);
  renderHand(playerHand, 'player-cards', true);
}


// Function to handle the "Deal" button
// Function to handle the "Deal" button
function deal() {
    // Reset hands and shuffle deck
    dealerHand = [];
    playerHand = [];
    document.getElementById('status').textContent = '';
    document.getElementById('hit').disabled = false; // Re-enable the "Hit" button
    document.getElementById('stand').disabled = false; // Re-enable the "Stand" button
    createDeck();
    shuffleDeck();
  
    // Deal initial cards
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);
  
    // Update the UI
    updateUI();
  }
  

// Function to handle the "Hit" button
// Function to handle the "Hit" button
function hit() {
    // Deal an additional card to the player
    dealCard(playerHand);
  
    // Update the UI to show the new card
    updateUI();
  
    // Check for bust
    if (calculateHandValue(playerHand) > 21) {
      // Reveal the dealer's hand
      updateUI(true);
      endGame('You busted! Dealer wins.');
    }
  }
  

// Function to handle the "Stand" button
function stand() {
  // Dealer's turn: hit until at least 17
  while (calculateHandValue(dealerHand) < 17) {
    dealCard(dealerHand);
  }

  // Reveal the dealer's hand
  updateUI(true);

  // Determine the winner
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  if (dealerValue > 21 || playerValue > dealerValue) {
    endGame('You win!');
  } else if (dealerValue === playerValue) {
    endGame('It\'s a tie!');
  } else {
    endGame('Dealer wins!');
  }
}

// Event listeners for the buttons
document.getElementById('deal').addEventListener('click', deal);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);


// Function to end the game and display the result
function endGame(message) {
  document.getElementById('status').textContent = message;
  document.getElementById('hit').disabled = true;
  document.getElementById('stand').disabled = true;

  if (message === 'You win!') {
      wins++;
      document.getElementById('wins').textContent = wins;
  } else if (message === 'Dealer wins!') {
      losses++;
      document.getElementById('losses').textContent = losses;
  } else if (message === 'It\'s a tie!') {
      ties++;
      document.getElementById('ties').textContent = ties;
  }else if(message =="You busted! Dealer wins."){
      losses++;
      document.getElementById('losses').textContent = losses;
  }
}

// Initialize the game
createDeck();
shuffleDeck();
