document.addEventListener('DOMContentLoaded', () => {
  // Normalize quiz links/buttons to open in same tab
  document.querySelectorAll('a, button').forEach((el) => {
    const text = (el.textContent || '').trim().toLowerCase();
    if (text === 'start quiz') {
      el.removeAttribute('target');
      el.classList.add('start-quiz');
    }
  });

  // Start quiz buttons: support either anchors or buttons with data-href
  document.querySelectorAll('[data-action="start-quiz"], .start-quiz').forEach((el) => {
    el.addEventListener('click', (e) => {
      const href = el.getAttribute('href') || el.dataset.href;
      if (href) {
        e.preventDefault();
        window.location.assign(href); // open in same tab
      }
    });
  });

  // Simple carousel
  const track = document.querySelector('.carousel-track');
  const slides = track ? Array.from(track.children) : [];
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const dotsWrap = document.querySelector('.dots');

  if (track && slides.length) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      if (idx === 0) dot.setAttribute('aria-current', 'true');
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);
    let index = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => {
        if (i === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
    }

    nextBtn?.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      update();
    });

    prevBtn?.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });

    dots.forEach((d, i) => d.addEventListener('click', () => { index = i; update(); }));

    // Auto-play
    setInterval(() => { index = (index + 1) % slides.length; update(); }, 5000);
  }

  // Scroll reveal animations
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
});

// Reusable quiz app for multiple-choice quizzes
// Usage:
// quizApp({
//   questions: [{ prompt: 'Which sound?', choices: ['ha','la'], correct: 'ha', meta: { letter: 'ሀ' } }],
//   hooks: {
//     setHeader: (idx, total) => {},     // optional
//     renderPrompt: (q) => {},           // render the main prompt area
//     renderChoices: (q, onPick) => {},  // render buttons and call onPick(choice)
//     feedback: (ok) => {},              // show per-question feedback
//     finish: (score, total) => {},      // show final score
//   }
// });
function quizApp({ questions, hooks }) {
  const total = questions.length;
  let index = 0;
  let score = 0;

  function render() {
    if (hooks.setHeader) hooks.setHeader(index + 1, total);
    const q = questions[index];
    hooks.renderPrompt(q);
    hooks.renderChoices(q, pick);
  }

  function pick(choice) {
    const q = questions[index];
    const ok = choice === q.correct;
    if (ok) score += 1;
    if (hooks.feedback) hooks.feedback(ok);
    setTimeout(() => {
      index += 1;
      if (index < total) render(); else hooks.finish(score, total);
    }, ok ? 600 : 0);
  }

  render();

  return {
    restart() {
      index = 0; score = 0; render();
    }
  };
}
