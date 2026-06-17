/* ============================================================
   HAR — PORTFOLIO SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADING OVERLAY ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });
  // Fallback in case the load event already fired or assets are slow
  setTimeout(() => loader.classList.add('is-hidden'), 2500);

  /* ---------- BACKGROUND GRID / PARTICLES ---------- */
  initBackgroundCanvas();

  /* ---------- TYPEWRITER ---------- */
  initTypewriter();

  /* ---------- NAVBAR: scroll state, burger, active link ---------- */
  initNavbar();

  /* ---------- THEME: light / dark toggle ---------- */
  initTheme();

  /* ---------- BACK TO TOP ---------- */
  initBackToTop();

  /* ---------- ACHIEVEMENTS TOGGLE ---------- */
  initAchievementsToggle();

  /* ---------- CONTACT FORM ---------- */
  initContactForm();

  /* ---------- GSAP SCROLL REVEALS ---------- */
  initScrollReveals();

});

/* ============================================================
   BACKGROUND CANVAS — faint drifting grid / particle field
   ============================================================ */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((width * height) / 28000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.4 + 0.1
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#00d6ff';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  if (!reduceMotion) {
    requestAnimationFrame(tick);
  } else {
    tick(); // draw once, static
  }
}

/* ============================================================
   THEME TOGGLE — persist user preference in localStorage
   ============================================================ */
function initTheme() {
  const key = 'site-theme';
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  function applyTheme(theme) {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
      html.classList.add('theme-dark');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
      btn.setAttribute('aria-pressed', 'true');
    } else {
      html.classList.remove('theme-dark');
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  // Initialize from storage or OS preference
  const stored = localStorage.getItem(key);
  if (stored) {
    applyTheme(stored);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('theme-dark');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem(key, theme);
    applyTheme(theme);
  });
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Embedded Systems Developer',
    'Arduino & ESP32 Innovator',
    'AI-Assisted Developer',
    'Graphic Designer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(step, 1800);
        return;
      }
      setTimeout(step, 55);
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(step, 300);
        return;
      }
      setTimeout(step, 30);
    }
  }

  step();
}

/* ============================================================
   NAVBAR — scrolled state, mobile burger, active link highlight
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navlinks = document.querySelectorAll('[data-navlink]');
  const sections = document.querySelectorAll('main section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navlinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  function setActiveLink() {
    let current = sections[0]?.id;
    const offset = 140;
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) current = section.id;
    });
    navlinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   ACHIEVEMENTS — show more / show less
   ============================================================ */
function initAchievementsToggle() {
  const toggle = document.getElementById('achievementsToggle');
  const grid = document.getElementById('achievementsGrid');
  if (!toggle || !grid) return;

  toggle.addEventListener('click', () => {
    const expanded = grid.classList.toggle('is-expanded');
    toggle.classList.toggle('is-expanded', expanded);
    toggle.querySelector('span').textContent = expanded ? 'Show Less' : 'Show More';

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
}

/* ============================================================
   CONTACT FORM — async submit to Formspree
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('contactStatus');
  const submitText = document.getElementById('submitText');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitText.textContent = 'Sending...';
    statusEl.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = "Message sent — I'll get back to you soon.";
        form.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Please try again or email me directly.';
    } finally {
      submitText.textContent = 'Send Message';
    }
  });
}

/* ============================================================
   GSAP SCROLLTRIGGER REVEALS
   ============================================================ */
function initScrollReveals() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // content is visible by default; skip animated reveals

  const defaults = { ease: 'power3.out', duration: 0.9 };

  function revealGroup(selector, fromVars, opts = {}) {
    document.querySelectorAll(selector).forEach((el, i) => {
      gsap.from(el, {
        ...fromVars,
        ...defaults,
        delay: opts.stagger ? (i % (opts.staggerCount || 6)) * opts.stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  revealGroup('.reveal-fade', { opacity: 0, y: 24 });
  revealGroup('.reveal-left', { opacity: 0, x: -40 });
  revealGroup('.reveal-right', { opacity: 0, x: 40 });
  revealGroup('.reveal-scale', { opacity: 0, y: 30, scale: 0.94 }, { stagger: 0.08, staggerCount: 6 });

  // Staggered skill cards within the about grid
  gsap.from('.skill-card', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.about__skills',
      start: 'top 85%'
    }
  });

  // Hero entrance (plays once on load, not scroll-gated)
  gsap.from('.hero__content > *', {
    opacity: 0,
    y: 18,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.3
  });

  gsap.from('.hero__avatar-wrap', {
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: 'power3.out',
    delay: 0.4
  });
}
