/* ZONA MUERTA — main.js v2 */

/* =====================
   INTRO ESTÁTICA (The Ring)
   ===================== */
(function() {
  const intro   = document.getElementById('static-intro');
  const site    = document.getElementById('main-site');
  const canvas  = document.getElementById('static-canvas');
  if (!intro || !canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let frameCount = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Ruido + líneas de interferencia
  function drawNoise() {
    const w = canvas.width, h = canvas.height;
    const img = ctx.createImageData(w, h);
    const d   = img.data;

    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = d[i+1] = d[i+2] = v;
      d[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    // Líneas horizontales de interferencia
    if (frameCount % 6 === 0) {
      const lines = Math.floor(Math.random() * 4) + 1;
      for (let l = 0; l < lines; l++) {
        const y = Math.random() * h;
        const lineH = Math.random() * 4 + 1;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
        ctx.fillRect(0, y, w, lineH);
      }
    }

    frameCount++;
  }

  function loop() {
    drawNoise();
    animId = requestAnimationFrame(loop);
  }

  function endIntro() {
    cancelAnimationFrame(animId);
    intro.style.opacity = '0';
    intro.style.transition = 'opacity 0.7s ease';
    site.classList.remove('hidden');
    setTimeout(() => { intro.style.display = 'none'; }, 800);
  }

  window.skipIntro = endIntro;

  window.addEventListener('resize', resize);
  resize();
  loop();

  // La intro dura 2.8 segundos
  setTimeout(endIntro, 2800);
})();


/* =====================
   GLITCH en el logo (aleatorio)
   ===================== */
(function() {
  const el = document.querySelector('.logo-name');
  if (!el) return;
  const orig = el.textContent;
  const chars = '▓░█▒╳╬╪╫╢╟╞╝╜';

  function glitch() {
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = orig.split('').map((c, j) =>
        c === ' ' ? ' ' : j < i * 1.5 ? orig[j] : chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      i++;
      if (i > 10) { clearInterval(iv); el.textContent = orig; }
    }, 45);
  }

  // Cada 15-25 segundos
  function schedule() {
    setTimeout(() => { glitch(); schedule(); }, 15000 + Math.random() * 10000);
  }
  schedule();

  if (el) el.addEventListener('mouseenter', glitch);
})();


/* =====================
   BÚSQUEDA TOGGLE
   ===================== */
window.toggleSearch = function() {
  const bar = document.getElementById('search-bar');
  if (!bar) return;
  bar.classList.toggle('hidden');
  if (!bar.classList.contains('hidden')) {
    bar.querySelector('input').focus();
  }
};


/* =====================
   FADE IN AL HACER SCROLL
   ===================== */
const fadeEls = document.querySelectorAll('.post-row, .sidebar-block');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    obs.observe(el);
  });
}


/* =====================
   NEWSLETTER SIDEBAR (A TRAVÉS DE NUESTRA API)
   ===================== */
window.handleSub = async function(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const inp = e.target.querySelector('input');
  const email = inp.value;

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    // Llamamos a nuestro propio archivo de Astro de forma segura
    const response = await fetch('/api/subscribe.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    const data = await response.json();

    if (response.ok) {
      btn.textContent = '✓ Transmisión Establecida';
      btn.style.background = '#c0392b'; // Rojo Zona Muerta
      inp.value = '';
    } else {
      btn.textContent = data.message || 'Error';
      btn.style.background = '#7f8c8d';
    }
  } catch (error) {
    btn.textContent = 'Error de Red';
    btn.style.background = '#7f8c8d';
  }

  setTimeout(() => {
    btn.textContent = 'Suscribirse';
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
};


/* Easter egg en consola */
console.log('%c⊗ ZONA MUERTA', 'color:#c0392b;font-size:18px;font-family:monospace;font-weight:bold');
console.log('%c// Si estás leyendo esto, ya es demasiado tarde.', 'color:#5a1a13;font-family:monospace;font-size:11px');
