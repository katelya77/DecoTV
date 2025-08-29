// Lightweight visual effects for DecoTV (particles + scroll reveal)
(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

  // Particle Background
  function initParticles() {
    if (isReducedMotion) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.id = 'bg-particles';
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '0',
      pointerEvents: 'none',
    });
    document.body.prepend(canvas);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;
    let particles = [];
    const particleCount = Math.max(14, Math.min(48, Math.floor((window.innerWidth * window.innerHeight) / 60000)));
    const count = isLowEnd ? Math.floor(particleCount * 0.5) : particleCount;

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function reset(p) {
      p.x = rand(0, width);
      p.y = rand(0, height);
      p.vx = rand(-0.2, 0.2);
      p.vy = rand(-0.15, 0.15);
      p.r = rand(0.6, 1.8);
      p.alpha = rand(0.15, 0.45);
      p.hue = Math.random() < 0.7 ? 190 : 330; // cyan/pink
    }

    function init() {
      particles = new Array(count).fill(0).map(() => {
        const p = {}; reset(p); return p;
      });
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5 || p.x > width + 5 || p.y < -5 || p.y > height + 5) reset(p);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.alpha})`);
        grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    let raf;
    resize();
    init();
    step();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      resize();
      step();
    }, { passive: true });
  }

  // Scroll Reveal
  function initReveal() {
    if (isReducedMotion) return;
    const candidates = document.querySelectorAll('.reveal-on-scroll');
    if (!candidates.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
    candidates.forEach(el => io.observe(el));
  }

  // Tag key sections automatically
  function tagRevealCandidates() {
    const selectors = [
      '#results .card-hover',
      '#douban-results > *',
      '.history-item',
      '.player-container',
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('reveal-on-scroll'));
    });
  }

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initParticles();
      tagRevealCandidates();
      initReveal();
    });
  } else {
    initParticles();
    tagRevealCandidates();
    initReveal();
  }
})();


