/**
 * Mesmer Tigrinya - Enhanced Quiz Engine
 * A kid-friendly, reusable quiz system with animations and fun feedback
 */

// Kid-friendly messages and emojis
const MESSAGES = {
  correct: ['ጽቡቕ ስራሕ! 🌟', 'ሰናይ! ⭐', 'ምሉእ! 🎉', 'ከምዚ ቀጽል/ሊ! 🏆', 'ደስ ዝብል!'],
  incorrect: ['ደጊምካ ፈትን! 💪', 'ኣጆኻ! 🚀', 'ትኽእል ኢኻ! 💫', 'ቀሪብካ! 🌟'],
  encouragement: ['ኣዝዩ ዘሐብን!', 'ቀጽሎ!', 'ከኾብ! ⭐', 'ጽቡቅ ኣሳልጦ!']
};

// Sound effects - Uses SoundManager for better control
const SOUNDS = {
  correct: () => window.soundManager?.play('correct') || console.log('🔊 Correct sound'),
  incorrect: () => window.soundManager?.play('incorrect') || console.log('🔊 Incorrect sound'),
  complete: () => window.soundManager?.play('complete') || console.log('🔊 Quiz complete sound'),
  click: () => window.soundManager?.play('click') || console.log('🔊 Click sound')
};

/**
 * Enhanced Quiz App with kid-friendly features
 * @param {Object} config - Quiz configuration
 * @param {Array} config.questions - Array of question objects
 * @param {Object} config.hooks - Custom rendering hooks
 * @param {Object} config.options - Additional options
 */
function quizApp({ questions, hooks, options = {} }) {
  const total = questions.length;
  let index = 0;
  let score = 0;
  let startTime = Date.now();

  // Default options
  const config = {
    showProgress: true,
    enableSounds: true,
    animationDuration: 600,
    feedbackDuration: 1000,
    ...options
  };

  // Get random message from array
  function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Play sound effect
  function playSound(type) {
    if (config.enableSounds && SOUNDS[type]) {
      SOUNDS[type]();
    }
  }

  // Show animated feedback
  function showFeedback(isCorrect, element) {
    const feedbackEl = element.querySelector('.quiz-feedback');
    if (!feedbackEl) return;

    // Clear previous feedback
    feedbackEl.innerHTML = '';
    feedbackEl.className = 'quiz-feedback';

    // Create feedback content
    const icon = document.createElement('div');
    icon.className = `feedback-icon ${isCorrect ? 'correct' : 'incorrect'}`;
    icon.textContent = isCorrect ? '✅' : '❌';

    const message = document.createElement('div');
    message.className = 'feedback-message';
    message.textContent = getRandomMessage(isCorrect ? MESSAGES.correct : MESSAGES.incorrect);

    feedbackEl.appendChild(icon);
    feedbackEl.appendChild(message);
    feedbackEl.classList.add('show');

    // Add animation classes
    if (isCorrect) {
      feedbackEl.classList.add('bounce');
    } else {
      feedbackEl.classList.add('shake');
    }

    // Hide feedback after duration
    setTimeout(() => {
      feedbackEl.classList.remove('show', 'bounce', 'shake');
    }, config.feedbackDuration);
  }

  // Calculate time taken
  function getTimeTaken() {
    const timeMs = Date.now() - startTime;
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    return { minutes, seconds, total: timeMs };
  }

  // Render progress bar
  function renderProgress() {
    if (!config.showProgress) return;
    
    const progressEl = document.querySelector('.quiz-progress');
    if (progressEl) {
      const percentage = ((index + 1) / total) * 100;
      progressEl.style.width = `${percentage}%`;
    }
  }

  // Main render function
  function render() {
    if (hooks.setHeader) {
      hooks.setHeader(index + 1, total);
    }
    
    renderProgress();
    
    const question = questions[index];
    if (hooks.renderPrompt) {
      hooks.renderPrompt(question);
    }
    if (hooks.renderChoices) {
      hooks.renderChoices(question, pick);
    }
  }

  // Handle answer selection
  function pick(choice) {
    const question = questions[index];
    const isCorrect = choice === question.correct;
    
    if (isCorrect) {
      score += 1;
      playSound('correct');
    } else {
      playSound('incorrect');
    }

    // Show feedback
    const quizCard = document.querySelector('#quizCard, .quiz-card');
    if (quizCard) {
      showFeedback(isCorrect, quizCard);
    }

    // Move to next question or finish
    setTimeout(() => {
      index += 1;
      if (index < total) {
        render();
      } else {
        finish();
      }
    }, isCorrect ? config.animationDuration : 0);
  }

  // Show final results
  function finish() {
    playSound('complete');
    const timeTaken = getTimeTaken();
    const percentage = Math.round((score / total) * 100);
    
    if (hooks.finish) {
      hooks.finish(score, total, percentage, timeTaken);
    }
  }

  // Start the quiz
  render();

  // Return public API
  return {
    restart() {
      index = 0;
      score = 0;
      startTime = Date.now();
      render();
    },
    
    getScore() {
      return { score, total, percentage: Math.round((score / total) * 100) };
    },
    
    getProgress() {
      return { current: index + 1, total, percentage: Math.round(((index + 1) / total) * 100) };
    }
  };
}

/**
 * Create a standard quiz page with common elements
 * @param {Object} config - Page configuration
 */
function createQuizPage(config) {
  const {
    title,
    questions,
    renderPrompt,
    renderChoices,
    customStyles = '',
    additionalScript = ''
  } = config;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Mesmer Tigrinya</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <style>
    ${customStyles}
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="../index.html">
        <span class="me-2">●</span>
        <span>መስመር ትግርኛ</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="../index.html">🏠 Home</a></li>
          <li class="nav-item"><a class="nav-link" href="../quizzes.html">🎮 Quizzes</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="py-5" style="background: var(--surface); min-height: calc(100vh - 200px);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-7">
          <!-- Quiz Card -->
          <div class="card shadow quiz-card border-0" id="quizCard">
            <div class="card-body p-4">
              <!-- Header -->
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 m-0 quiz-title">${title}</h1>
                <div class="quiz-meta">
                  <span class="badge bg-primary fs-6">Question <span id="qIndex">1</span>/<span id="qTotal">${questions.length}</span></span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress mb-4" style="height: 8px; border-radius: 10px;">
                <div class="progress-bar quiz-progress" role="progressbar" style="width: 0%; background: linear-gradient(90deg, #ff6b6b, #4ecdc4);"></div>
              </div>

              <!-- Question Area -->
              <div class="quiz-content">
                <div id="questionArea" class="text-center py-3"></div>
                <div id="answers" class="d-grid gap-3 mt-4"></div>
              </div>

              <!-- Feedback Area -->
              <div class="quiz-feedback text-center mt-4" aria-live="polite"></div>
            </div>
          </div>

          <!-- Results Card -->
          <div id="result" class="card shadow result-card border-0 mt-4 d-none">
            <div class="card-body text-center p-5">
              <div class="result-icon mb-3">🏆</div>
              <h2 class="h3 mb-3 result-title">Amazing Work!</h2>
              <p class="result-score mb-3" id="scoreLine">You got 0 out of 0 correct!</p>
              <p class="result-time mb-4" id="timeLine">Time taken: 0 minutes</p>
              <div class="result-actions">
                <a href="../quizzes.html" class="btn btn-primary btn-lg me-2">🎮 Back to Quizzes</a>
                <button id="restartBtn" class="btn btn-outline-primary btn-lg">🔄 Play Again</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-links">
        <a href="#">Contact Us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Use</a>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/quizApp.js"></script>
  <script>
    // Quiz data
    const questions = ${JSON.stringify(questions, null, 2)};

    // DOM elements
    const qIndexEl = document.getElementById('qIndex');
    const qTotalEl = document.getElementById('qTotal');
    const questionArea = document.getElementById('questionArea');
    const answersEl = document.getElementById('answers');
    const resultCard = document.getElementById('result');
    const quizCard = document.getElementById('quizCard');
    const scoreLine = document.getElementById('scoreLine');
    const timeLine = document.getElementById('timeLine');
    const restartBtn = document.getElementById('restartBtn');

    // Initialize quiz
    let appInstance = quizApp({
      questions,
      hooks: {
        setHeader: (idx, total) => {
          qIndexEl.textContent = idx;
        },
        renderPrompt: (q) => {
          ${renderPrompt}
        },
        renderChoices: (q, onPick) => {
          ${renderChoices}
        },
        finish: (score, total, percentage, timeTaken) => {
          quizCard.classList.add('d-none');
          resultCard.classList.remove('d-none');
          
          // Update score
          scoreLine.textContent = \`You got \${score} out of \${total} correct! (\${percentage}%)\`;
          
          // Update time
          const timeText = timeTaken.minutes > 0 
            ? \`\${timeTaken.minutes}m \${timeTaken.seconds}s\`
            : \`\${timeTaken.seconds}s\`;
          timeLine.textContent = \`Time taken: \${timeText}\`;
          
          // Add celebration animation
          resultCard.classList.add('celebrate');
        }
      }
    });

    // Restart functionality
    restartBtn.addEventListener('click', () => {
      quizCard.classList.remove('d-none');
      resultCard.classList.add('d-none');
      resultCard.classList.remove('celebrate');
      appInstance.restart();
    });

    ${additionalScript}
  </script>
</body>
</html>`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { quizApp, createQuizPage, MESSAGES, SOUNDS };
}