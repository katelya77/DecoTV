// Enhanced visual effects for DecoTV (neon particles + advanced animations)
(function () {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

  // Enhanced Particle Background with Neon Effects
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
    let connections = [];
    const particleCount = Math.max(20, Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 50000)));
    const count = isLowEnd ? Math.floor(particleCount * 0.6) : particleCount;

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
      p.vx = rand(-0.3, 0.3);
      p.vy = rand(-0.2, 0.2);
      p.r = rand(0.8, 2.2);
      p.alpha = rand(0.2, 0.6);
      p.pulseSpeed = rand(0.02, 0.05);
      p.pulse = 0;
      // Neon colors: cyan, magenta, yellow
      const colors = [
        { h: 180, s: 100, l: 50 }, // cyan
        { h: 320, s: 100, l: 50 }, // magenta
        { h: 60, s: 100, l: 50 },  // yellow
        { h: 270, s: 100, l: 60 }  // purple
      ];
      p.color = colors[Math.floor(Math.random() * colors.length)];
    }

    function init() {
      particles = new Array(count).fill(0).map(() => {
        const p = {}; reset(p); return p;
      });
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        
        // Reset particle if out of bounds
        if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) {
          reset(p);
        }
        
        // Enhanced neon glow effect
        const pulseFactor = 1 + Math.sin(p.pulse) * 0.3;
        const currentAlpha = p.alpha * pulseFactor;
        
        // Create neon glow gradient
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grad.addColorStop(0, `hsla(${p.color.h}, ${p.color.s}%, ${p.color.l}%, ${currentAlpha})`);
        grad.addColorStop(0.3, `hsla(${p.color.h}, ${p.color.s}%, ${p.color.l}%, ${currentAlpha * 0.6})`);
        grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6 * pulseFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Core bright spot
        ctx.fillStyle = `hsla(${p.color.h}, ${p.color.s}%, 90%, ${currentAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulseFactor, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw connections between nearby particles
      if (!isLowEnd) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              const opacity = (150 - distance) / 150 * 0.1;
              ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
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

  // Enhanced Scroll Reveal with staggered animations
  function initReveal() {
    if (isReducedMotion) return;
    const candidates = document.querySelectorAll('.reveal-on-scroll');
    if (!candidates.length) return;
    
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, index) => {
        if (e.isIntersecting) {
          // Staggered animation delay
          setTimeout(() => {
            e.target.classList.add('reveal-visible');
            e.target.style.animation = 'slideInUp 0.6s ease-out forwards';
          }, index * 100);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
    
    candidates.forEach(el => {
      // Initial hidden state
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      io.observe(el);
    });
  }

  // Enhanced tag system for reveal candidates
  function tagRevealCandidates() {
    const selectors = [
      '#results .video-card',
      '#douban-results > *',
      '.history-item',
      '.player-container',
      '.glass-card',
      '.neon-btn'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
        }
      });
    });
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .reveal-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // Auto-refresh reveal candidates when DOM changes
  let refreshTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      tagRevealCandidates();
      initReveal();
    }, 100);
  });

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initParticles();
      tagRevealCandidates();
      initReveal();
      
      // Start observing DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  } else {
    initParticles();
    tagRevealCandidates();
    initReveal();
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();


