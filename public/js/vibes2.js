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
   4. PLACEHOLDER QUE "DUDA" (Con mensajes aleatorios)
   Solo cambia ANTES de que el usuario escriba.
   En cuanto hay foco o input real, se detiene
   y no vuelve a tocar el campo.
   ========================================== */
(function () {
  // 1. Definimos un array con los diferentes mensajes que quieres mostrar
  const DOUBT_TEXTS = [
    '¿estás seguro?',
    '¿estás solo en la habitación?',
    'alguien te mira por la webcam...',
    'no tendrías que estar aquí',
    '¿has oído ese ruido?',
    'ya saben tu nombre',
    'detrás de ti',
    '¿quién hay a tu lado?',
    'te estamos observando',
    'ya es demasiado tarde'
  ];

  // Función auxiliar para obtener un elemento aleatorio del array
  function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * DOUBT_TEXTS.length);
    return DOUBT_TEXTS[randomIndex];
  }

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
        
        // 2. Elegimos un mensaje aleatorio justo antes de mostrarlo
        input.placeholder = getRandomMessage(); 
        
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
   6. KONAMI CODE
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
        if (window.ZM_unlockEgg) window.ZM_unlockEgg('konami');
      }
    } else {
      // Si rompe la secuencia, reiniciamos (salvo que justo reinicie con la primera tecla correcta)
      progress = (e.key === SEQUENCE[0]) ? 1 : 0;
    }
  });
})();


/* ==========================================
   7. HOVER PROLONGADO EN EL LOGO ⊗
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
  
  if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
  if (window.ZM_unlockEgg) window.ZM_unlockEgg('rotar');
})();


/* ==========================================
   8. TECLA OCULTA "F" — frecuencia sincronizada
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
    if (window.ZM_unlockEgg) window.ZM_unlockEgg('frecuencia');
  });
})();

/* ==========================================
   9. EASTER EGG PARANORMAL: CÓDIGO 666 (Screamer PNG + Zoom In)
   ========================================== */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .sc-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      backdrop-filter: blur(2px);
    }

    .sc-overlay.sc-active {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }

    .sc-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      transform: scale(0.3);
    }

    .sc-overlay.sc-active .sc-wrapper {
      animation: sc-zoom-in 0.3s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
    }

    .sc-img {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      animation: sc-shake 0.08s infinite;
    }

    .sc-overlay.sc-fade {
      opacity: 0;
      visibility: hidden;
      transition: opacity 1.5s ease, visibility 1.5s;
    }

    @keyframes sc-zoom-in {
      0% { transform: scale(0.3); }
      100% { transform: scale(2.2); }
    }

    @keyframes sc-shake {
      0% { transform: translate(3px, 2px) rotate(0deg); }
      10% { transform: translate(-2px, -3px) rotate(-1deg); }
      20% { transform: translate(-4px, 0px) rotate(1deg); }
      30% { transform: translate(0px, 3px) rotate(0deg); }
      40% { transform: translate(2px, -2px) rotate(1deg); }
      50% { transform: translate(-2px, 3px) rotate(-1deg); }
      60% { transform: translate(-4px, 2px) rotate(0deg); }
      70% { transform: translate(3px, 2px) rotate(-1deg); }
      80% { transform: translate(-2px, -2px) rotate(1deg); }
      90% { transform: translate(3px, 3px) rotate(0deg); }
      100% { transform: translate(2px, -3px) rotate(-1deg); }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'sc-overlay';
  overlay.innerHTML = `
    <div class="sc-wrapper">
      <img src="/img/screamer.png" class="sc-img" alt="" />
    </div>
  `;
  document.body.appendChild(overlay);

  let inputBuffer = "";
  const SECRET_CODE = "666";

  window.addEventListener('keydown', (e) => {
    // No interferir nunca mientras el usuario escribe en un campo real
    // (formulario de contacto, newsletter, buscador, cualquier input/textarea)
    const tag = (e.target.tagName || '').toLowerCase();
    const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (isEditable) return;

    if (e.key.length === 1) {
      inputBuffer += e.key;
      inputBuffer = inputBuffer.slice(-SECRET_CODE.length);

      if (inputBuffer === SECRET_CODE) {
        inputBuffer = "";
        triggerScreamer();
      }
    }
  });

  let audioUnlocked = false;
  document.addEventListener('click', () => { audioUnlocked = true; }, { once: true });
  document.addEventListener('keydown', () => { audioUnlocked = true; }, { once: true });

  function triggerScreamer() {
    if (audioUnlocked) {
      const screamAudio = new Audio('/audio/screamer.mp3');
      // Volumen moderado: un sobresalto a 1.0 con auriculares puede ser
      // realmente desagradable, no solo "creepy". 0.55 sigue dando el golpe
      // sin arriesgarse a hacer daño a los oídos de quien lo active.
      screamAudio.volume = 0.55;
      screamAudio.play().catch(() => {
        console.warn("[ZONA MUERTA] Audio bloqueado: requiere interacción previa en la página.");
      });
    }

    overlay.classList.remove('sc-fade');
    overlay.classList.add('sc-active');

    if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
    if (window.ZM_unlockEgg) window.ZM_unlockEgg('bestia');

    setTimeout(() => {
      overlay.classList.add('sc-fade');
      setTimeout(() => {
        overlay.classList.remove('sc-active');
      }, 1500);
    }, 1200);
  }
})();

/* ==========================================================================
   10. EASTER EGG PARANORMAL: CÓDIGO sangre
   ========================================================================== */
(function () {
  if (document.getElementById('zm-blood-style')) return;

  const style = document.createElement('style');
  style.id = 'zm-blood-style';
  style.textContent = `
    .blood-container {
      position: fixed;
      inset: 0;
      z-index: 9990;
      pointer-events: none;
      overflow: hidden;
    }

    .blood-container.fade-out {
      opacity: 0;
      transition: opacity 1.8s ease;
    }

    .blood-drop {
      position: absolute;
      top: -40px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      animation-name: zm-drip;
      animation-timing-function: cubic-bezier(0.94, 0, 0.86, 0.46);
      animation-fill-mode: forwards;
    }

    .blood-drop::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -1.1em;
      width: 0;
      height: 0;
      border-left: 0.5em solid transparent;
      border-right: 0.5em solid transparent;
      border-bottom: 1.5em solid currentColor;
      transform: translateX(-50%);
    }

    .blood-ripple {
      position: absolute;
      opacity: 0;
      width: 2px;
      height: 1px;
      border: currentColor 4px solid;
      border-radius: 300px / 150px;
      animation-name: zm-ripple;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
    }

    .blood-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    @keyframes zm-drip {
      0%   { top: -40px; opacity: 1; }
      92%  { opacity: 1; }
      100% { top: var(--zm-fall-to); opacity: 0; }
    }

    @keyframes zm-ripple {
      from { opacity: 0.8; width: 2px; height: 1px; border-width: 4px; }
      to   { opacity: 0; width: 90px; height: 40px; border-width: 1px; }
    }
  `;
  document.head.appendChild(style);

  let buffer = '';
  let isActive = false;
  const SECRET = 'sangre';

  window.addEventListener('keydown', (e) => {
    if (isActive) return;

    const tag = (e.target.tagName || '').toLowerCase();
    const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (isEditable) return;

    if (e.key.length === 1) {
      buffer += e.key.toLowerCase();
      buffer = buffer.slice(-SECRET.length);
      if (buffer === SECRET) {
        buffer = '';
        isActive = true;
        triggerBloodRain();
      }
    }
  });

  function bloodColor(hue) {
    return `hsl(${hue}, 78%, 38%)`;
  }

  function spawnParticles(container, x, y, hue) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'blood-particle';

      const size = Math.random() * 5 + 3;
      p.style.width  = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${x}px`;
      p.style.top  = `${y}px`;
      p.style.background = bloodColor(hue + (Math.random() * 8 - 4));

      container.appendChild(p);

      // Física parabólica: salen disparadas hacia los lados/arriba y caen
      const angle = (Math.random() * 140 + 20) * (Math.PI / 180); // 20°–160°
      const force = Math.random() * 55 + 25;
      const vx = Math.cos(angle) * force;
      const vy = -Math.sin(angle) * force;

      p.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${vx * 0.6}px, ${vy}px) scale(0.85)`, opacity: 1, offset: 0.35 },
          { transform: `translate(${vx}px, ${vy * -0.15}px) scale(0.15)`, opacity: 0 }
        ],
        { duration: 450 + Math.random() * 250, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
      );

      setTimeout(() => p.remove(), 750);
    }
  }

  function triggerBloodRain() {
    const container = document.createElement('div');
    container.className = 'blood-container';
    document.body.appendChild(container);

    const totalDrops = 666;
    const vh = window.innerHeight;
    const rainDuration = 3600; // ms que dura la "lluvia" generando gotas nuevas
    let stop = false;

    function spawnDrop() {
      if (stop) return;

      const drop = document.createElement('div');
      drop.className = 'blood-drop';

      const left   = Math.random() * 100;
      const size   = Math.random() * 10 + 12;       // 12–22px
      const hue    = 350 + Math.random() * 15;
      const fallTo = vh - 20 + Math.random() * 40;   // cae hasta cerca del fondo
      const duration = Math.random() * 0.5 + 0.45;   // 0.45–0.95s, caída rápida real

      drop.style.left = `${left}%`;
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      drop.style.fontSize = `${size}px`;            // el triángulo (en em) escala con esto
      drop.style.color = bloodColor(hue);           // currentColor -> body+triángulo
      drop.style.background = bloodColor(hue);
      drop.style.setProperty('--zm-fall-to', `${fallTo}px`);
      drop.style.animationDuration = `${duration}s`;

      container.appendChild(drop);

      setTimeout(() => {
        // Splash: anillo de impacto + partículas que saltan del punto de contacto
        const ripple = document.createElement('div');
        ripple.className = 'blood-ripple';
        ripple.style.left = `${left}%`;
        ripple.style.top  = `${fallTo}px`;
        ripple.style.color = bloodColor(hue);
        ripple.style.borderColor = bloodColor(hue);
        ripple.style.animationDuration = '0.6s';
        container.appendChild(ripple);

        const impactX = (left / 100) * window.innerWidth;
        spawnParticles(container, impactX, fallTo, hue);

        drop.remove();
        setTimeout(() => ripple.remove(), 650);
      }, duration * 1000);
    }

    // Generamos gotas a intervalos cortos durante rainDuration,
    // así no aparecen todas a la vez ni se ve un patrón repetido.
    const spawnInterval = setInterval(spawnDrop, rainDuration / totalDrops);

    if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
    if (window.ZM_unlockEgg) window.ZM_unlockEgg('sangre');

    setTimeout(() => {
      stop = true;
      clearInterval(spawnInterval);
    }, rainDuration);

    setTimeout(() => {
      container.classList.add('fade-out');
      setTimeout(() => {
        container.remove();
        isActive = false;
      }, 1900);
    }, rainDuration + 1200);
  }
})();