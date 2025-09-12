/**
 * Drag & Drop Quiz Engine
 * Specialized engine for drag and drop letter/word building games
 */

function createDragDropQuiz(config) {
  const {
    questions,
    containerId,
    onComplete
  } = config;

  let currentIndex = 0;
  let score = 0;
  let startTime = Date.now();

  // DOM elements
  const container = document.getElementById(containerId);
  const qIndexEl = document.getElementById('qIndex');
  const qTotalEl = document.getElementById('qTotal');
  const targetEl = document.getElementById('targetWord');
  const drop = document.getElementById('drop');
  const bank = document.getElementById('bank');
  const checkBtn = document.getElementById('checkBtn');
  const quizCard = document.getElementById('quizCard');
  const resultCard = document.getElementById('result');
  const scoreLine = document.getElementById('scoreLine');
  const timeLine = document.getElementById('timeLine');
  const restartBtn = document.getElementById('restartBtn');

  // Initialize
  qTotalEl.textContent = questions.length;

  // Render current question
  function render() {
    const question = questions[currentIndex];
    qIndexEl.textContent = currentIndex + 1;
    targetEl.textContent = question.word;
    
    // Clear previous content
    drop.innerHTML = '';
    bank.innerHTML = '';
    
    // Create letter tiles - shuffle the correct letters to make it challenging
    const letters = [...question.tiles];
    
    // Shuffle the letters so they're not in the correct order
    letters.sort(() => Math.random() - 0.5);
    
    // Create tiles from shuffled letters
    letters.forEach(letter => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.draggable = true;
      tile.textContent = letter;
      tile.addEventListener('dragstart', handleDragStart);
      tile.addEventListener('dragend', handleDragEnd);
      bank.appendChild(tile);
    });

    // Reset drop zone style
    drop.style.borderColor = '#99b';
  }

  // Handle drag start
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.setData('source', e.target.parentElement.id);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
    e.target.classList.add('dragging');
  }

  // Handle drag end
  function handleDragEnd(e) {
    e.target.style.opacity = '1';
    e.target.classList.remove('dragging');
  }

  // Handle drag over
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.target.closest('.drop, .bank').classList.add('drag-over');
  }

  // Handle drag leave
  function handleDragLeave(e) {
    if (!e.target.closest('.drop, .bank').contains(e.relatedTarget)) {
      e.target.closest('.drop, .bank').classList.remove('drag-over');
    }
  }

  // Handle drop
  function handleDrop(e) {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    const sourceId = e.dataTransfer.getData('source');
    const targetId = e.target.closest('.drop, .bank').id;
    
    // Remove drag-over class
    e.target.closest('.drop, .bank').classList.remove('drag-over');
    
    // Find the dragged element
    const draggedElement = document.querySelector('.dragging');
    if (!draggedElement) return;
    
    // If dropping in the same container, allow reordering
    if (sourceId === targetId) {
      const afterElement = getDragAfterElement(e.target.closest('.drop, .bank'), e.clientY);
      if (afterElement == null) {
        e.target.closest('.drop, .bank').appendChild(draggedElement);
      } else {
        e.target.closest('.drop, .bank').insertBefore(draggedElement, afterElement);
      }
      return;
    }
    
    // Moving between containers
    if (sourceId === 'bank' && targetId === 'drop') {
      // Moving from bank to drop zone
      drop.appendChild(draggedElement);
    } else if (sourceId === 'drop' && targetId === 'bank') {
      // Moving from drop zone back to bank
      bank.appendChild(draggedElement);
    }
  }

  // Helper function to determine where to insert dragged element
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.tile:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Check answer
  function checkAnswer() {
    const attempt = Array.from(drop.children).map(tile => tile.textContent).join('');
    const correct = questions[currentIndex].word;
    
    if (attempt === correct) {
      score++;
      showFeedback(true);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      showFeedback(false);
      // Shake animation
      drop.style.borderColor = '#ef4444';
      drop.style.animation = 'shake 0.6s ease-out';
      setTimeout(() => {
        drop.style.borderColor = '#99b';
        drop.style.animation = '';
      }, 600);
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
    message.textContent = isCorrect ? 'Great job! 🌟' : 'Try again! 💪';

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

  // Move to next question
  function nextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
      render();
    } else {
      finish();
    }
  }

  // Finish quiz
  function finish() {
    const timeTaken = Date.now() - startTime;
    const minutes = Math.floor(timeTaken / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);
    
    quizCard.classList.add('d-none');
    resultCard.classList.remove('d-none');
    
    scoreLine.textContent = `You got ${score} out of ${questions.length} correct!`;
    timeLine.textContent = `Time taken: ${minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}`;
    
    resultCard.classList.add('celebrate');
    
    if (onComplete) {
      onComplete(score, questions.length);
    }
  }

  // Restart quiz
  function restart() {
    currentIndex = 0;
    score = 0;
    startTime = Date.now();
    quizCard.classList.remove('d-none');
    resultCard.classList.add('d-none');
    resultCard.classList.remove('celebrate');
    render();
  }

  // Set up event listeners
  drop.addEventListener('dragover', handleDragOver);
  drop.addEventListener('drop', handleDrop);
  drop.addEventListener('dragleave', handleDragLeave);
  bank.addEventListener('dragover', handleDragOver);
  bank.addEventListener('drop', handleDrop);
  bank.addEventListener('dragleave', handleDragLeave);
  checkBtn.addEventListener('click', checkAnswer);
  restartBtn.addEventListener('click', restart);

  // Start the quiz
  render();

  // Return public API
  return {
    restart,
    getScore: () => ({ score, total: questions.length }),
    getProgress: () => ({ current: currentIndex + 1, total: questions.length })
  };
}
