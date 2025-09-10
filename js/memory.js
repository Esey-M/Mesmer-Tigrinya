/**
 * Memory Game Engine
 * Specialized engine for memory matching games
 */

function createMemoryGame(config) {
  const {
    pairs,
    containerId,
    onComplete
  } = config;

  let tiles = [];
  let first = null;
  let second = null;
  let matches = 0;
  let startTime = Date.now();

  // DOM elements
  const container = document.getElementById(containerId);
  const grid = document.getElementById('grid');
  const gameCard = document.getElementById('gameCard');
  const resultCard = document.getElementById('result');
  const scoreLine = document.getElementById('scoreLine');
  const timeLine = document.getElementById('timeLine');
  const restartBtn = document.getElementById('restartBtn');

  // Start the game
  function start() {
    tiles = [];
    first = null;
    second = null;
    matches = 0;
    startTime = Date.now();
    grid.innerHTML = '';
    
    // Create deck with pairs
    const deck = [];
    pairs.forEach(pair => {
      deck.push({ type: 'word', val: pair.word, pair: pair });
      deck.push({ type: 'pic', val: pair.pic, pair: pair });
    });
    
    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    
    // Create tiles
    deck.forEach((card, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'card-tile';
      tile.dataset.index = i;
      tile.textContent = '?';
      tile.addEventListener('click', () => flip(i, tile, card));
      grid.appendChild(tile);
      
      tiles.push({
        el: tile,
        card: card,
        flipped: false,
        matched: false
      });
    });
  }

  // Flip a tile
  function flip(index, element, card) {
    const tile = tiles[index];
    
    // Don't flip if already flipped or matched
    if (tile.matched || tile.flipped) return;
    
    // Don't flip if two tiles are already showing
    if (first && second) return;
    
    tile.flipped = true;
    element.textContent = card.val;
    element.style.background = 'white';
    element.style.color = '#2c3e50';
    
    // Add flip animation
    element.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
      element.style.transform = 'rotateY(0deg)';
    }, 150);
    
    if (!first) {
      first = tile;
    } else {
      second = tile;
      setTimeout(() => checkMatch(), 300);
    }
  }

  // Check if two flipped tiles match
  function checkMatch() {
    if (!first || !second) return;
    
    const a = first.card;
    const b = second.card;
    
    // Check if they're a matching pair
    const isPair = (a.type === 'word' && b.type === 'pic' && a.pair === b.pair) ||
                   (a.type === 'pic' && b.type === 'word' && a.pair === b.pair);
    
    if (isPair) {
      // Match found!
      first.matched = true;
      second.matched = true;
      first.el.classList.add('matched');
      second.el.classList.add('matched');
      matches++;
      
      // Show success feedback
      showFeedback(true);
      
      // Check if game is complete
      if (matches === pairs.length) {
        setTimeout(() => finish(), 1000);
      } else {
        setTimeout(() => resetFlip(), 500);
      }
    } else {
      // No match
      showFeedback(false);
      setTimeout(() => {
        first.flipped = false;
        second.flipped = false;
        first.el.textContent = '?';
        second.el.style.background = '';
        second.el.style.color = '';
        second.el.textContent = '?';
        resetFlip();
      }, 1000);
    }
  }

  // Show feedback
  function showFeedback(isCorrect) {
    const feedbackEl = document.querySelector('.quiz-feedback');
    if (!feedbackEl) return;

    feedbackEl.innerHTML = '';
    feedbackEl.className = 'quiz-feedback';

    const icon = document.createElement('div');
    icon.className = `feedback-icon ${isCorrect ? 'correct' : 'incorrect'}`;
    icon.textContent = isCorrect ? '✅' : '❌';

    const message = document.createElement('div');
    message.className = 'feedback-message';
    message.textContent = isCorrect ? 'Great match! 🌟' : 'Try again! 💪';

    feedbackEl.appendChild(icon);
    feedbackEl.appendChild(message);
    feedbackEl.classList.add('show');

    if (isCorrect) {
      feedbackEl.classList.add('bounce');
    } else {
      feedbackEl.classList.add('shake');
    }

    setTimeout(() => {
      feedbackEl.classList.remove('show', 'bounce', 'shake');
    }, 1000);
  }

  // Reset flip state
  function resetFlip() {
    first = null;
    second = null;
  }

  // Finish game
  function finish() {
    const timeTaken = Date.now() - startTime;
    const minutes = Math.floor(timeTaken / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);
    
    gameCard.classList.add('d-none');
    resultCard.classList.remove('d-none');
    
    scoreLine.textContent = `You matched ${matches} pairs!`;
    timeLine.textContent = `Time taken: ${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}`;
    
    resultCard.classList.add('celebrate');
    
    if (onComplete) {
      onComplete(matches, pairs.length);
    }
  }

  // Restart game
  function restart() {
    gameCard.classList.remove('d-none');
    resultCard.classList.add('d-none');
    resultCard.classList.remove('celebrate');
    start();
  }

  // Set up restart button
  restartBtn.addEventListener('click', restart);

  // Start the game
  start();

  // Return public API
  return {
    restart,
    getScore: () => ({ matches, total: pairs.length }),
    getProgress: () => ({ current: matches, total: pairs.length })
  };
}
