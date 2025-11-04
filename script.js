const COUNTDOWN_TARGET = new Date('2026-01-04T14:00:00+06:00');
const COUNTDOWN_INTERVAL = 1000;

const countdownElements = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

function padWithZero(value) {
  return value.toString().padStart(2, '0');
}

function updateCountdown() {
  const now = new Date();
  const diff = COUNTDOWN_TARGET.getTime() - now.getTime();

  if (diff <= 0) {
    countdownElements.days.textContent = '00';
    countdownElements.hours.textContent = '00';
    countdownElements.minutes.textContent = '00';
    countdownElements.seconds.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownElements.days.textContent = padWithZero(days);
  countdownElements.hours.textContent = padWithZero(hours);
  countdownElements.minutes.textContent = padWithZero(minutes);
  countdownElements.seconds.textContent = padWithZero(seconds);
}

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, COUNTDOWN_INTERVAL);
}

// Anime.js powered scroll animations
function initScrollAnimations() {
  const animatedSections = document.querySelectorAll('.animate-on-scroll');
  if (!animatedSections.length) return;

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion?.matches) {
    animatedSections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  if (typeof anime === 'undefined') {
    animatedSections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-visible');

          anime({
            targets: el,
            translateY: [26, 0],
            opacity: [0, 1],
            duration: 650,
            easing: 'easeOutCubic'
          });

          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedSections.forEach((section) => observer.observe(section));
}

// Audio controls
function initAudioPlayer() {
  const audioElement = document.getElementById('party-audio');
  const playButton = document.getElementById('play-btn');
  const pauseButton = document.getElementById('pause-btn');

  if (!audioElement || !playButton || !pauseButton) return;

  playButton.addEventListener('click', () => {
    audioElement.play().catch((error) => {
      console.warn('Audio playback failed:', error);
    });
  });

  pauseButton.addEventListener('click', () => {
    audioElement.pause();
  });

  if (audioElement.paused) {
    pauseButton.classList.add('is-active');
  }

  audioElement.addEventListener('play', () => {
    playButton.classList.add('is-active');
    pauseButton.classList.remove('is-active');
  });

  audioElement.addEventListener('pause', () => {
    pauseButton.classList.add('is-active');
    playButton.classList.remove('is-active');
  });
}

function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const messageElement = document.getElementById('form-message');

  if (!form || !messageElement) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.elements['guest-name']?.value.trim();
    const attendance = form.elements['attendance']?.value;

    if (!name || !attendance) {
      messageElement.textContent = 'Өтінеміз, барлық міндетті жолдарды толтырыңыз.';
      messageElement.classList.add('form-message--visible');
      return;
    }

    const messages = {
      coming: `${name}, сізді күтеміз! Керемет той болсын!`,
      'with-partner': `${name}, екі адамға орын сақтаймыз!`,
      'not-coming': `${name}, жауап бергеніңізге рахмет. Келесі кездескенше!`
    };

    messageElement.textContent = messages[attendance] || 'Жауабыңыз үшін рахмет!';
    messageElement.classList.add('form-message--visible');
    form.reset();
  });
}

function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[data-scroll]');
  if (!scrollLinks.length) return;

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetSelector = link.getAttribute('href');
      if (!targetSelector || !targetSelector.startsWith('#')) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initConfetti() {
  const container = document.getElementById('confetti');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion?.matches) {
    container.remove();
    return;
  }

  const colors = ['#d7a938', '#c4ccd8', '#1b2b3f', '#101a2c'];
  const amount = window.innerWidth < 600 ? 60 : 110;

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty('--confetti-duration', `${5.5 + Math.random() * 3.5}s`);
    piece.style.setProperty('--confetti-delay', `${Math.random() * 0.8}s`);
    piece.style.setProperty('--confetti-shift', `${(Math.random() * 28 - 14).toFixed(2)}vw`);
    piece.style.setProperty('--start-rotate', `${Math.random() * 360}deg`);
    piece.style.setProperty('--end-rotate-x', `${180 + Math.random() * 360}deg`);
    piece.style.setProperty('--end-rotate-y', `${180 + Math.random() * 360}deg`);
    piece.style.setProperty('--end-rotate-z', `${Math.random() * 360}deg`);
    piece.style.background = colors[i % colors.length];
    piece.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
    container.appendChild(piece);
  }

  window.setTimeout(() => {
    container.classList.add('confetti--fade');
    window.setTimeout(() => {
      container.innerHTML = '';
      container.classList.remove('confetti--fade');
    }, 1000);
  }, 6500);
}

function initPage() {
  initCountdown();
  initScrollAnimations();
  initAudioPlayer();
  initRsvpForm();
  initSmoothScroll();
  requestAnimationFrame(initConfetti);
}

document.addEventListener('DOMContentLoaded', initPage);
