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
    Object.values(countdownElements).forEach((el) => {
      if (el) {
        el.textContent = '00';
      }
    });
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (countdownElements.days) countdownElements.days.textContent = padWithZero(days);
  if (countdownElements.hours) countdownElements.hours.textContent = padWithZero(hours);
  if (countdownElements.minutes) countdownElements.minutes.textContent = padWithZero(minutes);
  if (countdownElements.seconds) countdownElements.seconds.textContent = padWithZero(seconds);
}

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, COUNTDOWN_INTERVAL);
}

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
            translateY: [34, 0],
            opacity: [0, 1],
            duration: 700,
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

  audioElement.addEventListener('play', () => {
    playButton.classList.add('is-active');
    pauseButton.classList.remove('is-active');
  });

  audioElement.addEventListener('pause', () => {
    pauseButton.classList.add('is-active');
    playButton.classList.remove('is-active');
  });

  if (audioElement.paused) {
    pauseButton.classList.add('is-active');
  }
}



function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[data-scroll]');
  if (!scrollLinks.length) return;

  const nav = document.getElementById('primary-nav');
  const toggle = document.getElementById('nav-toggle');

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetSelector = link.getAttribute('href');
      if (!targetSelector || !targetSelector.startsWith('#')) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (nav?.classList.contains('is-open')) {
        nav.classList.remove('is-open');
      }

      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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

  const colors = ['#f6c66e', '#f2b04a', '#f7dca8', '#fdecd1'];
  const amount = window.innerWidth < 640 ? 70 : 120;

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.setProperty('--confetti-duration', `${5 + Math.random() * 3.5}s`);
    piece.style.setProperty('--confetti-delay', `${Math.random() * 1}s`);
    piece.style.setProperty('--confetti-shift', `${(Math.random() * 24 - 12).toFixed(2)}vw`);
    piece.style.setProperty('--rotate-start', `${Math.random() * 360}deg`);
    piece.style.setProperty('--rotate-end-x', `${180 + Math.random() * 360}deg`);
    piece.style.setProperty('--rotate-end-y', `${180 + Math.random() * 360}deg`);
    piece.style.setProperty('--rotate-end-z', `${Math.random() * 360}deg`);
    piece.style.background = colors[i % colors.length];
    piece.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
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
function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const messageElement = document.getElementById('form-message');

  if (!form || !messageElement) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.elements['guest-name'].value.trim();
    const guestCount = form.elements['guest-count'].value;
    const message = form.elements['guest-message'].value.trim();

    if (!name || !guestCount) {
      messageElement.textContent = 'Өтінеміз, аты-жөніңіз бен қонақтар санын көрсетіңіз.';
      messageElement.classList.add('form-message--visible');
      return;
    }

    const data = {
      name: name,
      guests: guestCount,
      message: message
    };

    fetch('https://script.google.com/macros/s/AKfycbzfNR2scltC3UAoNJboAo8N5VfAQDJ0QrIKKEVHOu7REUvG-tGF-sUsTB4ptSiEODChXA/exec', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {
      messageElement.textContent = `${data.name}, рақмет! Күтеміз!`;
      messageElement.classList.add('form-message--visible');
      form.reset();
    })
    .catch(err => {
      messageElement.textContent = 'Қате орын алды, қайта көріңіз.';
      messageElement.classList.add('form-message--visible');
      console.error(err);
    });
  });
}

function initPage() {
  initCountdown();
  initScrollAnimations();
  initAudioPlayer();
  initRsvpForm();
  initSmoothScroll();
  initNavToggle();
  requestAnimationFrame(initConfetti);
}

document.addEventListener('DOMContentLoaded', initPage);
