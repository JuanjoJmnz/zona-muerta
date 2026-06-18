/* ==========================================================================
   ZONA MUERTA — vibes2.js
   Segunda tanda de efectos de atmósfera.
   Pensado para cargar DESPUÉS de vibes.js (no lo sustituye).
   ========================================================================== */


/* ==========================================
   1. MANCHAS / QUEMADURAS EN IMÁGENES
   Inyecta un overlay decorativo sobre cada
   placeholder de imagen. Puramente visual,
   no afecta al layout (position: absolute).
   ========================================== */
(function () {
  const SELECTORS = [
    '.img-urbex', '.img-xchan', '.img-leyenda', '.img-game',
    '.img-folklore', '.img-media', '.img-bunker',
    '.featured-img', '.post-row-thumb', '.recent-thumb', '.art-cover'
  ];

  function applyDecay() {
    document.querySelectorAll(SELECTORS.join(',')).forEach(el => {
      if (el.querySelector('.zm-decay-overlay')) return; // ya tiene
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      const overlay = document.createElement('div');
      overlay.className = 'zm-decay-overlay';
      // Variación sutil por elemento para que no se repitan idénticas
      overlay.style.opacity = (0.35 + Math.random() * 0.35).toFixed(2);
      el.appendChild(overlay);
    });
  }

  // La exponemos para que contenido renderizado dinámicamente DESPUÉS
  // de DOMContentLoaded (por ejemplo, los resultados del buscador) pueda
  // pedir que se le aplique el mismo efecto.
  window.ZM_applyDecay = applyDecay;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDecay);
  } else {
    applyDecay();
  }
})();


/* ==========================================
   2. INDICADOR DE FRECUENCIA en el footer
   Fluctúa lentamente, nunca se queda fijo
   ========================================== */
(function () {
  const el = document.createElement('div');
  el.className = 'zm-freq';
  el.innerHTML = `<span class="freq-dot"></span><span class="freq-val">87.4 MHz</span>`;

  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) footerBottom.appendChild(el);

  const valEl = el.querySelector('.freq-val');
  let current = 87.4;

  function drift() {
    // Pequeño paso aleatorio, con límites para que no se vaya muy lejos
    const step = (Math.random() - 0.5) * 0.6;
    current += step;
    if (current < 86.0) current = 86.0;
    if (current > 108.0) current = 108.0;
    valEl.textContent = `${current.toFixed(1)} MHz`;

    setTimeout(drift, 1800 + Math.random() * 2200);
  }
  drift();
})();


/* ==========================================
   3. SOMBRA DESPLAZADA DEL LOGO
   Se fija una vez por carga de página (no cambia
   en bucle, solo al recargar)
   ========================================== */
(function () {
  const logo = document.querySelector('.logo-sym');
  if (!logo) return;

  const x = (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 10);
  
  const y = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 7);

  logo.style.setProperty('--zm-shadow-x', `${x.toFixed(1)}px`);
  logo.style.setProperty('--zm-shadow-y', `${y.toFixed(1)}px`);
})();


/* ==========================================
   4. PLACEHOLDER QUE "DUDA"
   Solo cambia ANTES de que el usuario escriba.
   En cuanto hay foco o input real, se detiene
   y no vuelve a tocar el campo.
   ========================================== */
(function () {
  const DOUBT_TEXT = '¿estás seguro?';

  function attachDoubt(input) {
    if (input._zmDoubtAttached) return;
    input._zmDoubtAttached = true;

    const original = input.placeholder;
    let timer;
    let stopped = false;

    function loop() {
      if (stopped) return;
      timer = setTimeout(() => {
        if (stopped) return;
        input.placeholder = DOUBT_TEXT;
        timer = setTimeout(() => {
          if (stopped) return;
          input.placeholder = original;
          loop();
        }, 900);
      }, 4000 + Math.random() * 4000);
    }

    function stop() {
      stopped = true;
      clearTimeout(timer);
      input.placeholder = original; // siempre restauramos el real
    }

    // En cuanto el usuario interactúa de cualquier forma, paramos para siempre
    input.addEventListener('focus', stop, { once: true });
    input.addEventListener('input', stop, { once: true });

    loop();
  }

  function init() {
    document.querySelectorAll('.sub-input, .newsletter-input, input[type="email"]').forEach(attachDoubt);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ==========================================
   5. CONTADOR DE "ANOMALÍAS DETECTADAS"
   Sube cuando se activa cualquier easter egg.
   Exponemos window.ZM_registerAnomaly() para
   que otros efectos lo llamen.
   ========================================== */
(function () {
  const key = 'zm_anomaly_count';
  let count = 0;
  try { count = parseInt(localStorage.getItem(key) || '0'); } catch (e) {}

  const el = document.createElement('div');
  el.className = 'zm-anomaly-counter';

  function render() {
    el.innerHTML = `ANOMALÍAS DETECTADAS: <strong>${String(count).padStart(2, '0')}</strong>`;
  }
  render();

  const headerInner = document.querySelector('.header-inner');
  if (headerInner) headerInner.appendChild(el);

  window.ZM_registerAnomaly = function () {
    count++;
    try { localStorage.setItem(key, count); } catch (e) {}
    render();
  };
})();


/* ==========================================
   8. KONAMI CODE
   ↑ ↑ ↓ ↓ ← → ← → — invierte colores 3s
   ========================================== */
(function () {
  const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
  let progress = 0;

  const msg = document.createElement('div');
  msg.className = 'zm-floating-msg';
  msg.textContent = '// secuencia reconocida';
  document.body.appendChild(msg);

  function showMsg() {
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2200);
  }

  document.addEventListener('keydown', e => {
    // No interferir si el foco está en un campo de texto
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    if (e.key === SEQUENCE[progress]) {
      progress++;
      if (progress === SEQUENCE.length) {
        progress = 0;
        const site = document.getElementById('main-site');
        if (site) {
          site.classList.add('zm-inverted');
          setTimeout(() => site.classList.remove('zm-inverted'), 3000);
        }
        showMsg();
        if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
      }
    } else {
      // Si rompe la secuencia, reiniciamos (salvo que justo reinicie con la primera tecla correcta)
      progress = (e.key === SEQUENCE[0]) ? 1 : 0;
    }
  });
})();


/* ==========================================
   9. HOVER PROLONGADO EN EL LOGO ⊗
   3s quieto encima → empieza a rotar despacio
   ========================================== */
(function () {
  const logo = document.querySelector('.logo-sym');
  if (!logo) return;

  let hoverTimer;

  logo.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
      logo.classList.add('zm-rotating');
    }, 3000);
  });

  logo.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    logo.classList.remove('zm-rotating');
  });
})();


/* ==========================================
   10. TECLA OCULTA "F" — frecuencia sincronizada
   Solo si el foco no está en un campo de texto
   ========================================== */
(function () {
  const msg = document.createElement('div');
  msg.className = 'zm-floating-msg';
  msg.textContent = '// frecuencia sincronizada';
  document.body.appendChild(msg);

  let cooldown = false;

  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() !== 'f') return;

    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (cooldown) return;

    cooldown = true;
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 1800);
    setTimeout(() => { cooldown = false; }, 2000);

    if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
  });
})();