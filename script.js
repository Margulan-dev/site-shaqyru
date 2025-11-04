const COUNTDOWN_TARGET = new Date('2025-12-06T14:00:00+06:00');
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

function initPage() {
  initCountdown();
  initScrollAnimations();
  initAudioPlayer();
  initRsvpForm();
}

document.addEventListener('DOMContentLoaded', initPage);
