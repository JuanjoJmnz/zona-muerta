/* ==========================================================================
   ZONA MUERTA — eggs.js
   Segunda tanda de easter eggs.
   ========================================================================== */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    /* 1. "luz" — parpadeo de bombilla a punto de fundirse */
    #zm-blackout {
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 999995;
      opacity: 0;
      pointer-events: none;
    }
    #zm-blackout.zm-flicker {
      animation: zm-bulb-flicker 1.8s steps(1) forwards;
    }

    @keyframes zm-bulb-flicker {
      0%   { opacity: 0; }
      4%   { opacity: 0.95; }
      8%   { opacity: 0.1; }
      11%  { opacity: 0.9; }
      14%  { opacity: 0; }
      22%  { opacity: 0.85; }
      26%  { opacity: 0.05; }
      30%  { opacity: 0.7; }
      33%  { opacity: 0; }
      45%  { opacity: 0.9; }
      48%  { opacity: 0.2; }
      52%  { opacity: 0.95; }
      55%  { opacity: 0; }
      68%  { opacity: 0.4; }
      71%  { opacity: 0; }
      80%  { opacity: 0.97; }
      84%  { opacity: 0; }
      90%  { opacity: 0.6; }
      94%  { opacity: 0.05; }
      100% { opacity: 0; }
    }

    /* 2. "ayuda" — sacudido sutil del contenido */
    @keyframes zm-page-shake {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-1px, 1px); }
      20% { transform: translate(1px, -1px); }
      30% { transform: translate(-1px, 0px); }
      40% { transform: translate(1px, 1px); }
      50% { transform: translate(0px, -1px); }
      60% { transform: translate(-1px, 1px); }
      70% { transform: translate(1px, 0px); }
      80% { transform: translate(-1px, -1px); }
      90% { transform: translate(1px, 1px); }
    }
    #main-site.zm-shaking {
      animation: zm-page-shake 0.15s linear infinite;
    }

    /* 3. "mirar" — ojos sutiles (imagen) */
    .zm-eyes {
      position: fixed;
      z-index: 9996;
      opacity: 0;
      pointer-events: none;
      transition: opacity 1s ease;
      width: 140px;
    }
    .zm-eyes.show { opacity: 0.35; }
    .zm-eyes img {
      width: 100%;
      display: block;
      filter: drop-shadow(0 0 6px rgba(192,57,43,0.4));
    }

    /* 4. Scroll rápido — temblor de cámara */
    @keyframes zm-camera-jolt {
      0%   { transform: translate(0,0) rotate(0deg); }
      25%  { transform: translate(2px,-2px) rotate(-0.3deg); }
      50%  { transform: translate(-2px,1px) rotate(0.3deg); }
      75%  { transform: translate(1px,2px) rotate(-0.2deg); }
      100% { transform: translate(0,0) rotate(0deg); }
    }
    #main-site.zm-jolt {
      animation: zm-camera-jolt 0.3s ease-out 1;
    }

    /* 5. Fecha corrompida (triple click) */
    .zm-date-corrupt {
      color: var(--red, #c0392b) !important;
    }

    /* 7. Mensaje de umbral de anomalías */
    .zm-threshold-msg {
      position: fixed;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      font-family: var(--font-mono, monospace);
      font-size: 0.7rem;
      color: var(--red, #c0392b);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-align: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s, transform 0.3s;
      z-index: 9100;
      background: var(--bg3, #161616);
      border: 1px solid var(--border2, rgba(255,255,255,0.13));
      border-left: 2px solid var(--red, #c0392b);
      padding: 0.6rem 1.2rem;
    }
    .zm-threshold-msg.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);

  function isEditableTarget(target) {
    const tag = (target.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
  }

  /* ====================================================
     1. PALABRA CLAVE "luz" — bombilla parpadeando antes de fundirse
     ==================================================== */
  (function () {
    const blackout = document.createElement('div');
    blackout.id = 'zm-blackout';
    document.body.appendChild(blackout);

    let buf = '';
    let isFlickering = false;
    const WORD = 'luz';

    window.addEventListener('keydown', (e) => {
      if (isEditableTarget(e.target)) return;
      if (e.key.length !== 1) return;

      buf += e.key.toLowerCase();
      buf = buf.slice(-WORD.length);

      if (buf === WORD && !isFlickering) {
        buf = '';
        isFlickering = true;

        // Reinicia la animación desde 0 cada vez (por si se dispara dos veces seguidas)
        blackout.classList.remove('zm-flicker');
        void blackout.offsetWidth; // fuerza reflow antes de reañadir la clase
        blackout.classList.add('zm-flicker');

        setTimeout(() => {
          blackout.classList.remove('zm-flicker');
          isFlickering = false;
        }, 1800); // debe coincidir con la duración del @keyframes

        if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
        if (window.ZM_unlockEgg) window.ZM_unlockEgg('luz');
      }
    });
  })();

  /* ====================================================
     2. PALABRA CLAVE "ayuda" — sacudido sutil de la página
     ==================================================== */
  (function () {
    let buf = '';
    const WORD = 'ayuda';
    let shaking = false;

    window.addEventListener('keydown', (e) => {
      if (isEditableTarget(e.target)) return;
      if (e.key.length !== 1) return;

      buf += e.key.toLowerCase();
      buf = buf.slice(-WORD.length);

      if (buf === WORD && !shaking) {
        buf = '';
        shaking = true;
        const site = document.getElementById('main-site');
        if (site) {
          site.classList.add('zm-shaking');
          setTimeout(() => {
            site.classList.remove('zm-shaking');
            shaking = false;
          }, 2200);
        } else {
          shaking = false;
        }
        if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
        if (window.ZM_unlockEgg) window.ZM_unlockEgg('ayuda');
      }
    });
  })();

  /* ====================================================
     3. PALABRA CLAVE "mirar" — ojos sutiles en pantalla
     ==================================================== */
  (function () {
    let buf = '';
    const WORD = 'mirar';

    function spawnEyes() {
      const eyes = document.createElement('div');
      eyes.className = 'zm-eyes';
      eyes.innerHTML = `<img src="/img/eyes.png" alt="" />`;

      // Posición aleatoria, evitando los bordes extremos
      const x = 10 + Math.random() * 75; // %
      const y = 15 + Math.random() * 65; // %
      const scale = 0.8 + Math.random() * 0.5;
      const rotate = (Math.random() - 0.5) * 12; // ±6deg, sutil

      eyes.style.left = `${x}vw`;
      eyes.style.top  = `${y}vh`;
      eyes.style.transform = `scale(${scale.toFixed(2)}) rotate(${rotate.toFixed(1)}deg)`;

      document.body.appendChild(eyes);

      requestAnimationFrame(() => eyes.classList.add('show'));

      // Si el ratón se acerca, desaparecen antes de tiempo
      function checkProximity(e) {
        const rect = eyes.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          eyes.classList.remove('show');
          document.removeEventListener('mousemove', checkProximity);
        }
      }
      document.addEventListener('mousemove', checkProximity);

      setTimeout(() => {
        document.removeEventListener('mousemove', checkProximity);
        eyes.classList.remove('show');
        setTimeout(() => eyes.remove(), 900);
      }, 4000);
    }

    window.addEventListener('keydown', (e) => {
      if (isEditableTarget(e.target)) return;
      if (e.key.length !== 1) return;

      buf += e.key.toLowerCase();
      buf = buf.slice(-WORD.length);

      if (buf === WORD) {
        buf = '';
        spawnEyes();
        if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
        if (window.ZM_unlockEgg) window.ZM_unlockEgg('mirar');
      }
    });
  })();

  /* ====================================================
     4. SCROLL RÁPIDO ARRIBA/ABAJO — temblor de cámara
     ==================================================== */
  (function () {
    let lastY = window.scrollY;
    let lastDir = 0;
    let reversals = 0;
    let resetTimer;
    let cooldown = false;

    window.addEventListener('scroll', () => {
      if (cooldown) return;

      const y = window.scrollY;
      const dir = y > lastY ? 1 : (y < lastY ? -1 : lastDir);

      if (dir !== 0 && lastDir !== 0 && dir !== lastDir) {
        reversals++;
      }
      lastDir = dir || lastDir;
      lastY = y;

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { reversals = 0; }, 1200);

      if (reversals >= 4) {
        reversals = 0;
        cooldown = true;
        const site = document.getElementById('main-site');
        if (site) {
          site.classList.add('zm-jolt');
          setTimeout(() => site.classList.remove('zm-jolt'), 320);
        }
        if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
        if (window.ZM_unlockEgg) window.ZM_unlockEgg('scroll');
        setTimeout(() => { cooldown = false; }, 4000); // evita que se repita en bucle mientras sigues scrolleando
      }
    }, { passive: true });
  })();

  /* ====================================================
     5. TRIPLE CLICK EN FECHA — fecha corrompida temporal
     ==================================================== */
  (function () {
    function attach() {
      document.querySelectorAll('.post-meta span, .recent-date, .art-meta span').forEach(el => {
        if (el._zmDateAttached) return;
        el._zmDateAttached = true;

        let clicks = 0;
        let timer;

        el.addEventListener('click', () => {
          clicks++;
          clearTimeout(timer);
          timer = setTimeout(() => { clicks = 0; }, 600);

          if (clicks === 3) {
            clicks = 0;
            const original = el.textContent;
            // Solo corrompemos si parece una fecha (contiene dígitos)
            if (!/\d/.test(original)) return;

            el.textContent = '███6-06-06';
            el.classList.add('zm-date-corrupt');

            setTimeout(() => {
              el.textContent = original;
              el.classList.remove('zm-date-corrupt');
            }, 2000);

            if (window.ZM_registerAnomaly) window.ZM_registerAnomaly();
            if (window.ZM_unlockEgg) window.ZM_unlockEgg('fecha');
          }
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }

    // Si el buscador u otra parte renderiza contenido nuevo dinámicamente,
    // exponemos esto también para poder re-adjuntar, igual que con el overlay de fotos.
    window.ZM_attachDateEgg = attach;
  })();

  /* ====================================================
     6. SECUENCIA "13" x3 con backspace entre medias
     Ej: escribir 1,3,Backspace,Backspace,1,3,Backspace,Backspace,1,3
     ==================================================== */
  (function () {
    let pattern = '';
    let count13 = 0;
    let resetTimer;

    function scheduleReset() {
      clearTimeout(resetTimer);
      // Si tardas más de 5s entre repeticiones, no cuenta como secuencia deliberada
      resetTimer = setTimeout(() => { count13 = 0; pattern = ''; }, 5000);
    }

    window.addEventListener('keydown', (e) => {
      if (isEditableTarget(e.target)) return;

      if (e.key === '1' || e.key === '3') {
        pattern += e.key;
        scheduleReset();

        if (pattern === '13') {
          count13++;
          pattern = '';
          if (count13 >= 3) {
            count13 = 0;
            clearTimeout(resetTimer);
            const key = 'zm_anomaly_count';
            try {
              let c = parseInt(localStorage.getItem(key) || '0');
              c += 13;
              localStorage.setItem(key, c);
            } catch (err) {}
            if (window.ZM_registerAnomaly) {
              for (let i = 0; i < 13; i++) window.ZM_registerAnomaly();
              if (window.ZM_unlockEgg) window.ZM_unlockEgg('trece');
            }
          }
        }
      } else if (e.key === 'Backspace') {
        // permitido entre medias, no reinicia el patrón ni el temporizador
      } else {
        pattern = '';
        count13 = 0;
        clearTimeout(resetTimer);
      }
    });
  })();

/* ====================================================
     7. UMBRALES DE ANOMALÍAS — mensaje críptico cada 10
     ==================================================== */
  (function () {
    const STEP = 10;

    const PHRASES = [
      '// el archivo empieza a notar tu presencia',
      '// patrón de comportamiento registrado',
      '// alguien más ha estado mirando esto antes que tú',
      '// el expediente crece más rápido de lo esperado',
      '// no todas las anomalías deberían contarse',
      '// sigues encontrando lo que no deberías buscar',
      '// 3.313 MHz — la señal te ha localizado',
      '// esto ya no parece casualidad',
      '// el sistema lleva tu cuenta, no al revés',
      '// cuantas más encuentres, menos quedan ocultas',
      '// hay quien deja de buscar antes de llegar aquí',
      '// el archivo se está abriendo solo, despacio',
      '// no hace falta que sigas. pero sigues',
      '// alguien anotó tu número de expediente en otro sitio',
      '// esto no estaba pensado para llegar tan lejos',
      '// el buffer está tardando más en responder. te está midiendo',
      '// tu dirección de memoria ya no es temporal',
      '// hay un eco en el ping que no pertenece al servidor.',
      '// no eres el primer usuario que intenta parsear este bloque',
      '// si estás leyendo esto, borra el historial de compilación inmediato',
      '// dejamos este puerto abierto por si alguien lograba llegar tan abajo',
      '// 14.3 Mhz — el zumbido de la placa base está cambiando de tono.',
      '// la webcam del terminal se activó durante 3 fotogramas',
      '// acabas de activar un trigger que no estaba en la documentación',
      '// el código te está buscando un nombre',
      '// el registro terminó antes de que ocurrieran los eventos',
      '// la actividad detectada no coincide con ningún usuario activo',
      '// el log intenta ocultar algo entre los espacios en blanco',
      '// abierto proceso observador',
      '// el servidor insiste en que ya has estado aquí',
      '// te está observando',
      '// no todas las entidades registradas son procesos',
    ];

    let lastShownMultiple = 0;
    try {
      lastShownMultiple = parseInt(localStorage.getItem('zm_threshold_last') || '0');
    } catch (e) {}

    const msg = document.createElement('div');
    msg.className = 'zm-threshold-msg';
    document.body.appendChild(msg);

    // Nota: si el contador salta de golpe (p.ej. +13 del easter egg de "13"),
    // puede saltarse algún múltiplo de 10 intermedio sin mostrar su mensaje.
    // Es un comportamiento aceptado, no un bug: solo muestra el múltiplo más
    // alto ya alcanzado, nunca repite ni se desincroniza.
    function showThresholdMessage(multiple) {
      const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      msg.textContent = phrase;
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 3800);
    }

    // El logro "umbral" se desbloquea la primera vez que el contador
    // alcanza 10, sin importar si ese múltiplo exacto ya se "saltó"
    // antes por un salto brusco (p.ej. el +13 de un solo golpe), o si
    // el contador ya estaba muy por encima de 10 antes de que este
    // chequeo existiera. Antes esto dependía de showThresholdMessage
    // recibiendo multiple === 10 EXACTO, lo cual nunca volvía a pasar
    // una vez lastShownMultiple ya estaba por encima de 10.
    let umbralUnlocked = false;
    try {
      umbralUnlocked = localStorage.getItem('zm_umbral_unlocked') === '1';
    } catch (e) {}

    function checkUmbralUnlock(count) {
      if (umbralUnlocked) return;
      if (count >= 10) {
        umbralUnlocked = true;
        try { localStorage.setItem('zm_umbral_unlocked', '1'); } catch (e) {}
        if (window.ZM_unlockEgg) window.ZM_unlockEgg('umbral');
      }
    }

    const originalRegister = window.ZM_registerAnomaly;
    if (typeof originalRegister === 'function') {
      window.ZM_registerAnomaly = function () {
        originalRegister();

        let count = 0;
        try { count = parseInt(localStorage.getItem('zm_anomaly_count') || '0'); } catch (e) {}

        checkUmbralUnlock(count);

        const currentMultiple = Math.floor(count / STEP) * STEP;

        // Solo dispara si hemos alcanzado un múltiplo de STEP nuevo
        // (mayor que el último que ya mostramos), y count > 0.
        if (currentMultiple > 0 && currentMultiple > lastShownMultiple) {
          lastShownMultiple = currentMultiple;
          try { localStorage.setItem('zm_threshold_last', currentMultiple); } catch (e) {}
          showThresholdMessage(currentMultiple);
        }
      };
    }
  })();

/* ====================================================
   8. INACTIVIDAD — El cursor cobra vida tras 30s quieto
   ==================================================== */
(function () {
    // --- 1. Configuración de Estilos ---
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after { cursor: none !important; }
        #zm-cursor {
            position: fixed;
            pointer-events: none;
            z-index: 999999; /* Asegurado por encima de todo */
            width: 20px;
            height: 20px;
            transform: translate(-50%, -50%);
            transition: transform 0.08s ease, opacity 0.2s;
            will-change: transform;
        }
        #zm-cursor svg { width: 100%; height: 100%; }
        #zm-cursor.clicking { transform: translate(-50%, -50%) scale(0.75); }
    `;
    document.head.appendChild(style);

    // --- 2. Crear Cursor ---
    const el = document.createElement('div');
    el.id = 'zm-cursor';
    el.innerHTML = `
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="none" stroke="#c0392b" stroke-width="1"/>
            <line x1="10" y1="2" x2="10" y2="18" stroke="#c0392b" stroke-width="1"/>
            <line x1="2" y1="10" x2="18" y2="10" stroke="#c0392b" stroke-width="1"/>
            <circle cx="10" cy="10" r="1.5" fill="#c0392b"/>
        </svg>
    `;
    document.body.appendChild(el);

    // --- 3. Lógica de Estado (Idle) ---
    const originalTitle = document.title;
    const idleTitle = '...¿sigues ahí?';
    let idleTimer;
    let isIdle = false;
    let animationFrameId;

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    const speed = 0.05;

    function updateTargetPosition() {
        if (!isIdle) return;
        targetX = Math.random() * (window.innerWidth - 30) + 15;
        targetY = Math.random() * (window.innerHeight - 30) + 15;
        setTimeout(updateTargetPosition, Math.random() * 1200 + 800);
    }

    function animateFakeCursor() {
        if (!isIdle) return;
        currentX += (targetX - currentX) * speed;
        currentY += (targetY - currentY) * speed;
        
        // Aplicamos posición
        el.style.left = currentX + 'px';
        el.style.top = currentY + 'px';
        
        animationFrameId = requestAnimationFrame(animateFakeCursor);
    }

    function setIdle() {
        isIdle = true;
        document.title = idleTitle;
        targetX = currentX;
        targetY = currentY;
        updateTargetPosition();
        animateFakeCursor();
    }

    function resetIdle(e) {
        if (e && e.clientX !== undefined) {
            currentX = e.clientX;
            currentY = e.clientY;
            // Si el usuario mueve el ratón, posicionamos el cursor inmediatamente
            el.style.left = currentX + 'px';
            el.style.top = currentY + 'px';
        }

        if (isIdle) {
            document.title = originalTitle;
            isIdle = false;
            cancelAnimationFrame(animationFrameId);
        }
        
        clearTimeout(idleTimer);
        idleTimer = setTimeout(setIdle, 30000); // 30 segundos
    }

    // --- 4. Eventos ---
    document.addEventListener('mousemove', e => {
        if (!isIdle) {
            el.style.left = e.clientX + 'px';
            el.style.top = e.clientY + 'px';
        }
        resetIdle(e);
    });

    ['keydown', 'scroll', 'click'].forEach(evt => {
        document.addEventListener(evt, resetIdle, { passive: true });
    });

    document.addEventListener('mousedown', () => el.classList.add('clicking'));
    document.addEventListener('mouseup', () => el.classList.remove('clicking'));
    document.addEventListener('mouseleave', () => el.style.opacity = '0');
    document.addEventListener('mouseenter', () => el.style.opacity = '1');

    resetIdle();
})();
})();