/**
 * ════════════════════════════════════════════════════════════
 * TIJESUNIMI — A Royal Celebration  |  script.js
 * ════════════════════════════════════════════════════════════
 */

/* ════════════════════════════════════════════════════════════
   1. PRELOADER
   ════════════════════════════════════════════════════════════ */
(function initPreloader() {
  const loader  = document.getElementById('preloader');
  const bar     = document.getElementById('preloaderBar');
  const name    = document.getElementById('preloaderName');

  if (!loader) return;

  let progress = 0;
  const total  = 3000; // ms total display time
  const step   = 40;   // tick every 40ms

  /* Animate name letter-by-letter */
  const text = 'TIJESUNIMI';
  name.textContent = '';
  let i = 0;
  const typeInterval = setInterval(() => {
    name.textContent += text[i++];
    if (i >= text.length) clearInterval(typeInterval);
  }, 120);

  /* Progress bar */
  const barInterval = setInterval(() => {
    progress = Math.min(progress + (step / total) * 100, 100);
    bar.style.width = progress + '%';
    if (progress >= 100) clearInterval(barInterval);
  }, step);

  /* Hide after 3 seconds */
  setTimeout(() => {
    loader.classList.add('done');
    document.body.style.overflow = '';
    triggerReveal();
    startMusic();   // ← make sure this line is here
}, total);

  /* Prevent scroll during preloader */
  document.body.style.overflow = 'hidden';
})();

/* ════════════════════════════════════════════════════════════
   2. HERO PARTICLE SYSTEM
   ════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(random) {
      this.x     = Math.random() * W;
      this.y     = random ? Math.random() * H : H + 10;
      this.vy    = -(0.15 + Math.random() * 0.4);
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.size  = Math.random() * 1.8 + 0.3;
      this.maxLife = 200 + Math.random() * 150;
      this.life  = random ? Math.floor(Math.random() * this.maxLife) : 0;
      const gold = Math.random() > 0.3;
      this.r = gold ? 210 + Math.random() * 45 : 200 + Math.random() * 55;
      this.g = gold ? 160 + Math.random() * 40 : 80  + Math.random() * 60;
      this.b = gold ? 20  + Math.random() * 20 : 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const p = this.life / this.maxLife;
      const a = Math.sin(p * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${a})`;
      ctx.fill();
      /* glow halo */
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*5);
      g.addColorStop(0, `rgba(${this.r},${this.g},${this.b},${a*0.25})`);
      g.addColorStop(1, `rgba(${this.r},${this.g},${this.b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size*5, 0, Math.PI*2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  const COUNT = window.innerWidth < 600 ? 70 : 150;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ════════════════════════════════════════════════════════════
   3. SCROLL REVEAL (Intersection Observer)
   ════════════════════════════════════════════════════════════ */
function triggerReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', triggerReveal);

/* ════════════════════════════════════════════════════════════
   4. SMOOTH ANCHOR SCROLL
   ════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ════════════════════════════════════════════════════════════
   5. HERO PARALLAX (mouse)
   ════════════════════════════════════════════════════════════ */
(function initParallax() {
  const hero    = document.getElementById('hero');
  const orbs    = document.querySelectorAll('.orb');
  const content = document.querySelector('.hero__content');
  if (!hero || window.innerWidth < 768) return;

  let mx=0, my=0, cx=0, cy=0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  function tick() {
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;
    orbs.forEach((o, i) => {
      const d = (i + 1) * 12;
      o.style.transform = `translate(${cx*d}px,${cy*d}px)`;
    });
    if (content) content.style.transform = `translate(${cx*5}px,${cy*4}px)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ════════════════════════════════════════════════════════════
   6. BANK CARD — holographic tilt
   ════════════════════════════════════════════════════════════ */
(function initCardTilt() {
  const card  = document.getElementById('bankCard');
  const shine = document.getElementById('bankShine');
  if (!card) return;

  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const x    = (e.clientX - r.left) / r.width;
    const y    = (e.clientY - r.top)  / r.height;
    const rx   = (y - 0.5) * -14;
    const ry   = (x - 0.5) *  14;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    if (shine) shine.style.background =
      `linear-gradient(${115 + ry*2}deg, transparent 30%, rgba(255,255,255,${0.03 + x*0.05}) 50%, transparent 70%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.15s'; });
})();

/* ════════════════════════════════════════════════════════════
   7. COPY TO CLIPBOARD + SPARKLE CONFETTI
   ════════════════════════════════════════════════════════════ */
function copyAccount() {
  const accNum = document.getElementById('accNum');
  const toast  = document.getElementById('copyToast');
  if (!accNum) return;

  navigator.clipboard.writeText(accNum.textContent.trim())
    .then(() => {
      toast.classList.add('show');
      launchSparkles();
      setTimeout(() => toast.classList.remove('show'), 4000);
    })
    .catch(() => {
      /* Fallback */
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(accNum);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      toast.classList.add('show');
      launchSparkles();
      setTimeout(() => toast.classList.remove('show'), 4000);
    });
}

/* Attach copy button */
document.addEventListener('DOMContentLoaded', () => {
  
  // Sliders
  buildSlider({ sliderId:'imgSlider',  prevId:'imgPrev',  nextId:'imgNext',  dotsId:'imgDots' });
  buildSlider({ sliderId:'wishSlider', prevId:'wishPrev', nextId:'wishNext', dotsId:'wishDots' });

  // Copy button
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) copyBtn.addEventListener('click', copyAccount);

  // Download buttons
  document.querySelectorAll('.dl-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const name = this.dataset.name || 'photo';
      const card = this.closest('.img-card');
      const img  = card ? card.querySelector('img') : null;
      if (img && img.src && !img.src.startsWith('data')) {
        const a  = document.createElement('a');
        a.href   = img.src;
        a.download = name + '.jpg';
        a.click();
      } else {
        const orig = this.textContent;
        this.textContent = '✓ Ready when photos are added';
        this.disabled = true;
        setTimeout(() => { this.textContent = orig; this.disabled = false; }, 2500);
      }
    });
  });

  // Video pauses music, music resumes after video
  const video = document.querySelector('.bdvideo');
  if (video && audioEl) {
    video.addEventListener('play', () => {
      audioEl.pause();
      musicPlaying = false;
      syncMusicUI();
    });
    video.addEventListener('pause', () => {
      setTimeout(() => {
        if (!video.ended && video.paused) {
          audioEl.play().catch(() => {});
          musicPlaying = true;
          syncMusicUI();
        }
      }, 2000);
    });
    video.addEventListener('ended', () => {
      setTimeout(() => {
        audioEl.play().catch(() => {});
        musicPlaying = true;
        syncMusicUI();
      }, 3000);
    });
  }

});

/* ── Sparkle / Confetti burst ── */
function launchSparkles() {
  const canvas = document.getElementById('sparkleCanvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width;
  canvas.height = rect.height;

  /* Origin = center of canvas */
  const ox = canvas.width  / 2;
  const oy = canvas.height / 2;

  const COLORS = ['#f5d06b','#d4af37','#ff8c00','#ffffff','#a8880f','#faecc0'];
  const sparks = [];

  for (let i = 0; i < 80; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const speed  = 2 + Math.random() * 5;
    const size   = 3 + Math.random() * 6;
    const type   = Math.random() > 0.5 ? 'circle' : 'rect';
    sparks.push({
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 2,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: 60 + Math.random() * 40,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.3,
      type,
      gravity: 0.12 + Math.random() * 0.1
    });
  }

  function drawSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    sparks.forEach(s => {
      s.life++;
      s.vx *= 0.98;
      s.vy += s.gravity;
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.rotV;
      const a = Math.max(0, 1 - s.life / s.maxLife);
      if (a > 0) {
        alive = true;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = a;
        ctx.fillStyle = s.color;
        if (s.type === 'rect') {
          ctx.fillRect(-s.size/2, -s.size/4, s.size, s.size/2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, s.size/2, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(drawSparks);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  drawSparks();
}

/* ════════════════════════════════════════════════════════════
   8. SLIDER FACTORY
   ════════════════════════════════════════════════════════════ */
function buildSlider({ sliderId, prevId, nextId, dotsId, autoplay = false }) {
  const slider = document.getElementById(sliderId);
  const prev   = document.getElementById(prevId);
  const next   = document.getElementById(nextId);
  const dotsEl = document.getElementById(dotsId);
  if (!slider) return;

  const items = slider.children;
  let   current = 0;
  let   autoTimer;

  /* Build dots */
  const dots = [];
  for (let i = 0; i < items.length; i++) {
    const d = document.createElement('button');
    d.className = 'sl-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i+1}`);
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
    dots.push(d);
  }

  function goTo(idx) {
    current = (idx + items.length) % items.length;
    items[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    /* scrollIntoView on slider child via the slider container */
    const itemWidth = items[current].offsetWidth + 24; /* gap = 1.5rem ≈ 24px */
    slider.scrollTo({ left: current * itemWidth, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  /* Use scroll position to determine active dot */
  slider.addEventListener('scroll', () => {
    const itemWidth = items[0] ? items[0].offsetWidth + 24 : 1;
    const idx = Math.round(slider.scrollLeft / itemWidth);
    if (idx !== current) {
      current = Math.max(0, Math.min(idx, items.length - 1));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }, { passive: true });

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); });

  /* Autoplay */
  if (autoplay) {
    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), autoplay);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }
    /* Pause on hover */
    slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.parentElement.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  /* Swipe support */
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  buildSlider({ sliderId:'imgSlider',  prevId:'imgPrev',  nextId:'imgNext',  dotsId:'imgDots' });
  buildSlider({ sliderId:'wishSlider', prevId:'wishPrev', nextId:'wishNext', dotsId:'wishDots' });
});

/* ════════════════════════════════════════════════════════════
   9. IMAGE DOWNLOAD BUTTONS
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dl-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const name  = this.dataset.name || 'photo';
      /* Try to find an <img> in the same card */
      const card  = this.closest('.img-card');
      const img   = card ? card.querySelector('img') : null;

      if (img && img.src && !img.src.startsWith('data')) {
        /* Real image present — trigger download */
        const a  = document.createElement('a');
        a.href   = img.src;
        a.download = name + '.jpg';
        a.click();
      } else {
        /* Placeholder — show subtle feedback */
        const orig = this.textContent;
        this.textContent = '✓ Ready when photos are added';
        this.disabled = true;
        setTimeout(() => { this.textContent = orig; this.disabled = false; }, 2500);
      }
    });
  });
});

/* ════════════════════════════════════════════════════════════
   10. MUSIC PLAYER
   ════════════════════════════════════════════════════════════ */
let musicPlaying = false;
const audioEl    = document.getElementById('bgMusic');
const musicBtn   = document.getElementById('musicToggle');
const iconOn     = document.getElementById('iconOn');
const iconOff    = document.getElementById('iconOff');

function startMusic() {
  if (!audioEl) return;
  audioEl.volume = 0.35;
  
  audioEl.play().then(() => {
    musicPlaying = true;
    syncMusicUI();
  }).catch(() => {
    /* Browser blocked autoplay — start on first tap */
    document.addEventListener('touchstart', function playOnTouch() {
      audioEl.play().then(() => {
        musicPlaying = true;
        syncMusicUI();
      }).catch(() => {});
      document.removeEventListener('touchstart', playOnTouch);
    }, { once: true });
  });
}

function syncMusicUI() {
  if (!musicBtn) return;
  musicBtn.classList.toggle('playing', musicPlaying);
  if (iconOn)  iconOn.style.display  = musicPlaying ? '' : 'none';
  if (iconOff) iconOff.style.display = musicPlaying ? 'none' : '';
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!audioEl) return;
    if (musicPlaying) {
      audioEl.pause();
      musicPlaying = false;
    } else {
      audioEl.play().catch(() => {});
      musicPlaying = true;
    }
    syncMusicUI();
  });
}

/* ════════════════════════════════════════════════════════════
   11. NAV SCROLL SHADOW (minimal, sticky)
   ════════════════════════════════════════════════════════════ */
/* (No nav bar in this design — music button handles the fixed element) */

/* ════════════════════════════════════════════════════════════
   12. SECTION BACKGROUND SUBTLE ANIMATIONS (IntersectionObserver)
   ════════════════════════════════════════════════════════════ */
(function initSectionEntrance() {
  const sections = document.querySelectorAll('section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });
  sections.forEach(s => obs.observe(s));
})();
