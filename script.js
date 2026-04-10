// ── CURSOR GLOW ONLY (default browser cursor is used)
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // ── COUNTDOWN
  (function() {
    const KEY_END  = 'sc_end';
    const KEY_LAST = 'sc_last';
    const DURATION  = 3 * 3600000;
    const MAX_AWAY  = 1 * 3600000;

    const now      = Date.now();
    const lastSeen = parseInt(localStorage.getItem(KEY_LAST) || '0');
    const storedEnd = parseInt(localStorage.getItem(KEY_END) || '0');
    const awayMs   = now - lastSeen;

    let endTime;
    if (!storedEnd || awayMs > MAX_AWAY) {
      endTime = now + DURATION;
      localStorage.setItem(KEY_END, endTime);
    } else {
      endTime = storedEnd;
    }

    localStorage.setItem(KEY_LAST, now);

    function tick() {
      const diff = endTime - Date.now();
      const el = document.getElementById('countdown');
      if (diff <= 0) { el.textContent = '00:00:00'; return; }
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
      const s = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s;
    }
    tick();
    setInterval(tick, 1000);
  })();

  // ── FADE IN
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));

  // ── MOBILE STICKY CTA
  // Shows only when the hero "Get Access" button has scrolled out of view.
  // Hides again when the join section (pricing) becomes visible.
  (function() {
    const heroCta   = document.querySelector('.hero-cta-main');
    const joinSection = document.getElementById('join');
    const mobileCta = document.getElementById('mobile-cta');
    if (!mobileCta) return;

    let heroVisible = true;   // hero button starts on screen
    let joinVisible = false;

    function update() {
      if (!heroVisible && !joinVisible) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }

    if (heroCta) {
      const heroObs = new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
        update();
      }, { threshold: 0.5 });
      heroObs.observe(heroCta);
    }

    if (joinSection) {
      const joinObs = new IntersectionObserver(entries => {
        joinVisible = entries[0].isIntersecting;
        update();
      }, { threshold: 0.15 });
      joinObs.observe(joinSection);
    }
  })();
