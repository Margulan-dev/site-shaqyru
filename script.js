const COUNTDOWN_TARGET = new Date('2026-01-04T14:00:00+06:00');
const COUNTDOWN_INTERVAL = 1000;
const CONFETTI_DURATION = 9000; // milliseconds

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

function initSmoothScroll() {
  const rsvpButton = document.getElementById('rsvp-button');
  const rsvpSection = document.getElementById('rsvp');

  if (!rsvpButton || !rsvpSection) return;

  rsvpButton.addEventListener('click', () => {
    rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Anime.js powered scroll animations
function initScrollAnimations() {
  const animatedSections = document.querySelectorAll('.animate-on-scroll');
  if (!animatedSections.length) return;

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
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 1400,
            easing: 'easeOutExpo'
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

// Confetti animation
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const colors = ['#ffffff', '#ffdc73', '#f39f86', '#9be7ff', '#f4b942'];
  const confettiPieces = [];
  const confettiCount = 180;
  let animationFrame;
  let isActive = true;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createPiece(overrides = {}) {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      size: Math.random() * 8 + 6,
      rotation: Math.random() * 360,
      speed: Math.random() * 3 + 3,
      tilt: Math.random() * 12 - 6,
      tiltAngleIncrement: Math.random() * 0.07 + 0.02,
      tiltAngle: Math.random() * Math.PI,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.5,
      ...overrides
    };
  }

  function populateConfetti() {
    for (let i = 0; i < confettiCount; i += 1) {
      confettiPieces.push(createPiece({ y: Math.random() * window.innerHeight }));
    }
  }

  function drawPiece(piece) {
    ctx.beginPath();
    ctx.lineWidth = piece.size;
    ctx.strokeStyle = piece.color;
    ctx.globalAlpha = piece.opacity;
    const x = piece.x + piece.tilt;
    ctx.moveTo(x + piece.size / 2, piece.y);
    ctx.lineTo(x, piece.y + piece.tilt + piece.size);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function updatePieces() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i -= 1) {
      const piece = confettiPieces[i];
      piece.tiltAngle += piece.tiltAngleIncrement;
      piece.y += (Math.cos(piece.tiltAngle) + piece.speed) * 0.5;
      piece.x += Math.sin(piece.tiltAngle);
      piece.tilt = Math.sin(piece.tiltAngle) * 15;

      drawPiece(piece);

      if (piece.y > window.innerHeight + 20 || piece.x < -20 || piece.x > window.innerWidth + 20) {
        if (isActive) {
          confettiPieces[i] = createPiece({ x: Math.random() * window.innerWidth, y: -10 });
        } else {
          confettiPieces.splice(i, 1);
        }
      }
    }

    if (confettiPieces.length && (isActive || confettiPieces.length > 0)) {
      animationFrame = requestAnimationFrame(updatePieces);
    }
  }

  function start() {
    resizeCanvas();
    populateConfetti();
    updatePieces();
    setTimeout(() => {
      isActive = false;
    }, CONFETTI_DURATION);
  }

  start();

  window.addEventListener('resize', resizeCanvas);

  return () => {
    isActive = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };
}

function initPage() {
  initCountdown();
  initSmoothScroll();
  initScrollAnimations();
  initAudioPlayer();
  initConfetti();
}

document.addEventListener('DOMContentLoaded', initPage);
