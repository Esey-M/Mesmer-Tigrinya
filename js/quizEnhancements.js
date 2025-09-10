/**
 * Quiz Enhancement Features
 * Additional fun features for the Tigrinya learning quizzes
 */

// Star Rating System
class StarRating {
  constructor() {
    this.totalStars = 0;
    this.loadStars();
  }

  calculateStars(score, total, timeTaken) {
    const percentage = (score / total) * 100;
    const timeBonus = timeTaken < 30000 ? 1 : 0; // Bonus for quick completion
    
    if (percentage >= 100) return 5 + timeBonus;
    if (percentage >= 80) return 4 + timeBonus;
    if (percentage >= 60) return 3;
    if (percentage >= 40) return 2;
    return 1;
  }

  displayStars(container, stars) {
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.textContent = i < stars ? '⭐' : '☆';
      star.style.fontSize = '2rem';
      star.style.margin = '0 5px';
      container.appendChild(star);
    }
  }

  addStars(stars) {
    this.totalStars += stars;
    this.saveStars();
    this.updateHomepageDisplay();
  }

  saveStars() {
    localStorage.setItem('tigrinyaStars', this.totalStars);
  }

  loadStars() {
    this.totalStars = parseInt(localStorage.getItem('tigrinyaStars')) || 0;
  }

  updateHomepageDisplay() {
    const starDisplay = document.querySelector('.total-stars');
    if (starDisplay) {
      starDisplay.textContent = `Total Stars: ${this.totalStars} ⭐`;
    }
  }
}

// Progress Tracking
class ProgressTracker {
  constructor() {
    this.completedQuizzes = new Set();
    this.bestScores = {};
    this.loadProgress();
  }

  markCompleted(quizName, score, timeTaken) {
    this.completedQuizzes.add(quizName);
    this.bestScores[quizName] = {
      score: Math.max(this.bestScores[quizName]?.score || 0, score),
      time: Math.min(this.bestScores[quizName]?.time || Infinity, timeTaken)
    };
    this.saveProgress();
  }

  isCompleted(quizName) {
    return this.completedQuizzes.has(quizName);
  }

  getBestScore(quizName) {
    return this.bestScores[quizName] || { score: 0, time: 0 };
  }

  saveProgress() {
    localStorage.setItem('tigrinyaProgress', JSON.stringify({
      completed: Array.from(this.completedQuizzes),
      bestScores: this.bestScores
    }));
  }

  loadProgress() {
    const saved = localStorage.getItem('tigrinyaProgress');
    if (saved) {
      const data = JSON.parse(saved);
      this.completedQuizzes = new Set(data.completed || []);
      this.bestScores = data.bestScores || {};
    }
  }

  updateQuizCards() {
    document.querySelectorAll('.quiz-card').forEach(card => {
      const link = card.querySelector('a');
      if (link) {
        const quizName = link.href.split('/').pop().replace('.html', '');
        if (this.isCompleted(quizName)) {
          const badge = document.createElement('span');
          badge.className = 'badge bg-success position-absolute top-0 end-0 m-2';
          badge.textContent = '✅ Completed';
          card.style.position = 'relative';
          card.appendChild(badge);
        }
      }
    });
  }
}

// Fun Animations
class FunAnimations {
  static createConfetti(container) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = '50%';
      confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
      
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }
  }

  static bounceElement(element) {
    element.style.animation = 'bounce 0.6s ease-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }

  static shakeElement(element) {
    element.style.animation = 'shake 0.6s ease-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }
}

// Power-ups System
class PowerUps {
  constructor() {
    this.hints = 3;
    this.skips = 2;
    this.doublePoints = 1;
  }

  useHint(choices, correctAnswer) {
    if (this.hints <= 0) return false;
    
    const wrongChoices = choices.filter(choice => choice !== correctAnswer);
    const randomWrong = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
    
    // Remove the wrong choice
    const button = document.querySelector(`[data-choice="${randomWrong}"]`);
    if (button) {
      button.style.opacity = '0.3';
      button.disabled = true;
    }
    
    this.hints--;
    this.updateDisplay();
    return true;
  }

  useSkip() {
    if (this.skips <= 0) return false;
    this.skips--;
    this.updateDisplay();
    return true;
  }

  useDoublePoints() {
    if (this.doublePoints <= 0) return false;
    this.doublePoints--;
    this.updateDisplay();
    return true;
  }

  updateDisplay() {
    const display = document.querySelector('.powerups-display');
    if (display) {
      display.innerHTML = `
        <div class="powerup-item">
          <span>💡</span> ${this.hints}
        </div>
        <div class="powerup-item">
          <span>⏭️</span> ${this.skips}
        </div>
        <div class="powerup-item">
          <span>⭐</span> ${this.doublePoints}
        </div>
      `;
    }
  }
}

// Enhanced Quiz App with new features
function createEnhancedQuizApp(config) {
  const starRating = new StarRating();
  const progressTracker = new ProgressTracker();
  const powerUps = new PowerUps();
  
  // Add power-ups display to quiz card
  const quizCard = document.querySelector('#quizCard');
  if (quizCard) {
    const powerUpsDisplay = document.createElement('div');
    powerUpsDisplay.className = 'powerups-display d-flex gap-3 justify-content-center mb-3';
    powerUpsDisplay.style.fontSize = '1.2rem';
    quizCard.querySelector('.card-body').insertBefore(powerUpsDisplay, quizCard.querySelector('.quiz-content'));
    powerUps.updateDisplay();
  }

  // Enhanced finish function
  const originalFinish = config.hooks.finish;
  config.hooks.finish = function(score, total, percentage, timeTaken) {
    // Calculate stars
    const stars = starRating.calculateStars(score, total, timeTaken);
    
    // Add stars to display
    const starContainer = document.createElement('div');
    starContainer.className = 'text-center mb-3';
    starRating.displayStars(starContainer, stars);
    
    // Add to result card
    const resultCard = document.querySelector('#result .card-body');
    if (resultCard) {
      resultCard.insertBefore(starContainer, resultCard.querySelector('.result-actions'));
    }
    
    // Add confetti for perfect scores
    if (percentage === 100) {
      FunAnimations.createConfetti(document.body);
    }
    
    // Track progress
    const quizName = window.location.pathname.split('/').pop().replace('.html', '');
    progressTracker.markCompleted(quizName, score, timeTaken);
    starRating.addStars(stars);
    
    // Call original finish function
    if (originalFinish) {
      originalFinish(score, total, percentage, timeTaken);
    }
  };

  // Enhanced feedback function
  const originalFeedback = config.hooks.feedback;
  config.hooks.feedback = function(isCorrect) {
    if (isCorrect) {
      FunAnimations.bounceElement(document.querySelector('.quiz-feedback'));
    } else {
      FunAnimations.shakeElement(document.querySelector('.quiz-feedback'));
    }
    
    if (originalFeedback) {
      originalFeedback(isCorrect);
    }
  };

  return quizApp(config);
}

// Add CSS for new features
const enhancementStyles = `
@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.powerups-display {
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 15px;
  border: 2px solid var(--brand);
}

.powerup-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: var(--brand);
}

.total-stars {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 20px;
  font-weight: 600;
  color: var(--brand);
  border: 2px solid var(--brand);
  z-index: 1000;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancementStyles;
document.head.appendChild(styleSheet);

// Initialize global instances
window.starRating = new StarRating();
window.progressTracker = new ProgressTracker();

// Update homepage on load
document.addEventListener('DOMContentLoaded', () => {
  window.starRating.updateHomepageDisplay();
  window.progressTracker.updateQuizCards();
});
