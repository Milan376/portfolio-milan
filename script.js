/* ===== PORTFOLIO SCRIPT ===== */

/* ── Page Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('done');
  }, 1200);
});

/* ── Custom Cursor ── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let ringX = 0, ringY = 0;
  let dotX  = 0, dotY  = 0;

  document.addEventListener('mousemove', e => {
    dotX = e.clientX;
    dotY = e.clientY;
    cursorDot.style.left  = dotX + 'px';
    cursorDot.style.top   = dotY + 'px';
  });

  // Ring follows with lag
  function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover enlargement on interactive elements
  document.querySelectorAll('a, button, .skill-pill, .project-card, .btn-icon').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

/* ── Particle Canvas ── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas?.getContext('2d');

if (canvas && ctx) {
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const PARTICLE_COUNT = 70;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.5 + 0.1);
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.twinkle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinkle += 0.02;
      this.alpha = (Math.sin(this.twinkle) * 0.25 + 0.35);
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw subtle connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.04 * (1 - dist/100)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

/* ── Typed Text Effect ── */
const typedEl = document.getElementById('typedText');
const roles   = [
  'Java Developer.',
  'Backend Engineer.',
  'MERN Learner.',
  'Problem Solver.',
  'DSA Enthusiast.'
];

let rIdx = 0, cIdx = 0, deleting = false, typedPause = false;

function typeLoop() {
  if (typedPause) { setTimeout(typeLoop, 1800); typedPause = false; return; }

  const current = roles[rIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) { deleting = true; typedPause = true; }
    setTimeout(typeLoop, 80);
  } else {
    typedEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    setTimeout(typeLoop, 40);
  }
}

setTimeout(typeLoop, 1400);

/* ── Sticky Header shadow on scroll ── */
const mainHeader = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  mainHeader?.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Mobile Menu ── */
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  const isOpen = navLinks?.classList.contains('open');
  if (spans[0]) spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  if (spans[1]) spans[1].style.opacity   = isOpen ? '0' : '';
  if (spans[2]) spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    const spans = menuToggle?.querySelectorAll('span');
    if (spans) spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Scroll Reveal (Intersection Observer) ── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate project bars when project cards become visible
      if (entry.target.classList.contains('project-card')) {
        const bar = entry.target.querySelector('.project-bar-fill');
        const width = bar?.style.width || '0%';
        if (bar) {
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = width; }, 300);
        }
        entry.target.classList.add('visible');
      }
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Scroll to Top ── */
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
});

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
      if (link) link.style.color = 'var(--accent)';
    }
  });
});

/* ── Contact Form ── */
function handleContactForm() {
  const name    = document.getElementById('nameInput')?.value.trim();
  const email   = document.getElementById('emailInput')?.value.trim();
  const msg     = document.getElementById('msgInput')?.value.trim();
  const status  = document.getElementById('formStatus');
  const btn     = document.getElementById('sendBtn');

  if (!name || !email || !msg) {
    if (status) { status.style.color = '#ff5b7a'; status.textContent = '⚠ Please fill in all fields.'; }
    setTimeout(() => { if (status) status.textContent = ''; }, 3000);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (status) { status.style.color = '#ff5b7a'; status.textContent = '⚠ Please enter a valid email.'; }
    setTimeout(() => { if (status) status.textContent = ''; }, 3000);
    return;
  }

  // Simulate send
  if (btn) { btn.querySelector('span').textContent = 'Sending…'; btn.disabled = true; }

  setTimeout(() => {
    if (status) {
      status.style.color = 'var(--accent)';
      status.textContent = '✓ Message received! Milan will get back to you soon.';
    }
    document.getElementById('nameInput').value  = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('msgInput').value   = '';
    if (btn) { btn.querySelector('span').textContent = 'Send Message'; btn.disabled = false; }
    setTimeout(() => { if (status) status.textContent = ''; }, 4000);
  }, 1000);
}

/* ── Footer Year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Skill pill micro-interaction: random glow on hover ── */
document.querySelectorAll('.skill-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    const hue = Math.floor(Math.random() * 60); // Slight hue variation near cyan
    pill.style.boxShadow = `0 0 20px hsla(${190 + hue}, 100%, 60%, 0.4)`;
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});

/* ── Smooth parallax on hero section ── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('#home .hero-content');
  if (hero) {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.08}px)`;
      hero.style.opacity   = `${1 - scrolled / (window.innerHeight * 0.8)}`;
    }
  }
});

/* ── Project card tilt effect on mouse move ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const rotX   = -(y / rect.height) * 6;
    const rotY   =  (x / rect.width)  * 6;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
