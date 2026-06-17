/* ==========================================================================
   ZONA MUERTA — vibes.js
   Efectos de atmósfera y entorno analógico/retro
   ========================================================================== */

/* ==========================================
   1. TÍTULO DE PESTAÑA DINÁMICO (Micro-Glitches con Retraso)
   ========================================== */

(function () {
    const originalTitle = document.title;
    const CHARS = "▓░█▒╳╬╪╫╢╟╞";

    const audioFiles = [
        "/public/audio/whisper_01.mp3",
        "/public/audio/whisper_02.mp3",
        "/public/audio/pop.mp3",
        "/public/audio/door_knock.mp3",
        "/public/audio/steps.mp3",
        "/public/audio/eerie_01.mp3",
        "/public/audio/eerie_02.mp3",
        "/public/audio/eerie_03.mp3",
        "/public/audio/voice.mp3"
    ];

    let audioUnlocked = false;

    function unlockAudio() {
        audioUnlocked = true;
    }
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });

    const visitCount = Number(localStorage.getItem("entity_visits") || 0) + 1;
    localStorage.setItem("entity_visits", visitCount);
    
    console.log(`[ZONA MUERTA] Expediente de acceso núm: ${visitCount}`);

    const messages = [
        "...", "¿me oyes?", "sigues aquí", "te veo", "no cierres esto",
        "has vuelto", "te estaba esperando", "ya puedo verte",
        "¿por qué has regresado?", "ya te conozco", "no mires detrás de ti",
        "no estás solo", "puedo escucharte", "sé cuándo vuelves", "estuve aquí todo el tiempo"
    ];

    if (visitCount >= 20) {
        messages.push("siempre vuelves");
        messages.push("nunca te fuiste");
    }

    let corruption = Math.min(0.35, visitCount * 0.03);
    let titleInterval = null;
    let hiddenTimer = null;
    let currentSessionMessage = "";

    function randomChar() {
        return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function glitchText(text) {
        return text.split("").map((char, index) => {
            if (index < 1) return char;
            if (Math.random() < corruption) return randomChar();
            return char;
        }).join("");
    }

    function getMessage() {
        if (visitCount < 3) return messages[Math.floor(Math.random() * 4)];
        if (visitCount < 6) return messages[Math.floor(Math.random() * 7)];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function playRandomAnomalySound() {
        if (!audioUnlocked) return;

        const randomSrc = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        
        const anomalyAudio = new Audio(randomSrc);
        
        anomalyAudio.volume = 0.08; 

        anomalyAudio.play().catch((e) => {
            console.warn("[ZONA MUERTA] Bloqueo de reproducción de audio:", e);
        });
    }

    function initEntityDOM() {
        const box = document.getElementById("entity-message");
        if (!box) return;

        function showEntityMessage(text, duration = 6000) {
            box.textContent = text;
            box.style.opacity = "1";
            setTimeout(() => {
                box.style.opacity = "0";
            }, duration);
        }

        if (visitCount >= 5 && visitCount < 10) {
            setTimeout(() => { showEntityMessage("te estaba esperando"); }, 5000);
        } else if (visitCount >= 10 && visitCount < 20) {
            setTimeout(() => { showEntityMessage("ya te conozco"); }, 5000);
        } else if (visitCount >= 20) {
            setTimeout(() => { showEntityMessage("siempre vuelves"); }, 5000);
        }

        setTimeout(() => {
            if (visitCount >= 3) {
                showEntityMessage("...");
            }
        }, 60000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEntityDOM);
    } else {
        initEntityDOM();
    }

    function startPresence() {
        if (titleInterval) return;
        let counter = 0;
        currentSessionMessage = getMessage();

        titleInterval = setInterval(() => {
            counter++;
            if (counter % 10 === 0) {
                document.title = "...";
                return;
            }
            if (counter % 15 === 0 && Math.random() < 0.5) {
                currentSessionMessage = getMessage();
            }
            document.title = glitchText(currentSessionMessage);
        }, 400); 
    }

    function stopPresence() {
        clearInterval(titleInterval);
        titleInterval = null;
        document.title = originalTitle;
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearTimeout(hiddenTimer);
            hiddenTimer = setTimeout(() => {
                startPresence();
            }, 20000);
        } else {
            clearTimeout(hiddenTimer);
            if (titleInterval && visitCount >= 3) {
                playRandomAnomalySound();
            }
            stopPresence();
        }
    });
})();

/* ==========================================
   2. CURSOR PERSONALIZADO (Punto de mira)
   ========================================== */
(function () {
    const style = document.createElement('style');
    style.textContent = `
    *, *::before, *::after { cursor: none !important; }
    #zm-cursor {
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);
      transition: transform 0.08s ease, opacity 0.2s;
    }
    #zm-cursor svg { width: 100%; height: 100%; }
    #zm-cursor.clicking { transform: translate(-50%, -50%) scale(0.75); }
    a, button, [onclick], label, input, textarea, select {
      cursor: none !important;
    }
  `;
    document.head.appendChild(style);

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

    let mx = -100,
        my = -100;
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        el.style.left = mx + 'px';
        el.style.top = my + 'px';
    });

    document.addEventListener('mousedown', () => el.classList.add('clicking'));
    document.addEventListener('mouseup', () => el.classList.remove('clicking'));
    document.addEventListener('mouseleave', () => {
        el.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        el.style.opacity = '1';
    });
})();

/* ==========================================
   3. ÚLTIMA TRANSMISIÓN EN TIEMPO REAL
   Inyecta metadatos de actividad en la cabecera
   ========================================== */
(function () {
    window.ZM_LAST_POST = window.ZM_LAST_POST || new Date(Date.now() - 1000 * 60 * 47); // Fallback: hace 47 min

    function timeAgo(date) {
        const diff = Math.floor((Date.now() - date) / 1000);
        if (diff < 60) return 'hace unos segundos';
        if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
        if (diff < 86400 * 2) return 'ayer';
        if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)} días`;
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    }

    const style = document.createElement('style');
    style.textContent = `
    .last-transmission {
      font-family: var(--font-mono, monospace);
      font-size: 0.6rem;
      color: var(--text3, #3a3835);
      letter-spacing: 0.08em;
      padding-left: 1rem;
      border-left: 1px solid var(--border, rgba(255,255,255,0.07));
      white-space: nowrap;
    }
    .last-transmission span { color: var(--text2, #7a7670); }
    @media (max-width: 900px) { .last-transmission { display: none; } }
  `;
    document.head.appendChild(style);

    const el = document.createElement('div');
    el.className = 'last-transmission';
    el.innerHTML = `// última transmisión: <span></span>`;
    const span = el.querySelector('span');

    function update() {
        span.textContent = timeAgo(window.ZM_LAST_POST);
    }
    update();
    setInterval(update, 30000);

    const headerInner = document.querySelector('.header-inner');
    if (headerInner) headerInner.appendChild(el);
})();

/* ==========================================
   4. CONTADOR ESTILO EXPEDIENTE (Persistente)
   ========================================== */
(function () {
    const key = 'zm_visit_count';
    const count = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count);

    const style = document.createElement('style');
    style.textContent = `
    .expediente-num {
      font-family: var(--font-mono, monospace);
      font-size: 0.62rem;
      color: var(--text3, #3a3835);
      letter-spacing: 0.1em;
      line-height: 1.6;
    }
    .expediente-num strong {
      color: var(--red, #c0392b);
      display: block;
      font-size: 0.8rem;
      font-weight: 400;
    }
  `;
    document.head.appendChild(style);

    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const block = document.createElement('div');
    block.className = 'sidebar-block';
    block.innerHTML = `
    <div class="sidebar-title">ACCESO</div>
    <div class="expediente-num">
      EXPEDIENTE NÚM.
      <strong>${String(count).padStart(5, '0')}</strong>
      visita registrada
    </div>
  `;
    sidebar.prepend(block);
})();

/* ==========================================
   5. TEXTO CENSURADO CLICKEABLE
   ========================================== */
(function () {
    const style = document.createElement('style');
    style.textContent = `
    .redacted {
      cursor: pointer;
      position: relative;
      transition: background 0.3s, color 0.3s;
    }
    .redacted.revealed {
      background: rgba(192, 57, 43, 0.15) !important;
      color: var(--text, #ddd8d0) !important;
      padding: 0 4px;
      border-bottom: 1px solid var(--red, #c0392b);
    }
    .redacted::after {
      content: 'click para desbloquear';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      font-family: var(--font-mono, monospace);
      font-size: 10px;
      color: var(--red, #c0392b);
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.15s;
      pointer-events: none;
      margin-bottom: 4px;
    }
    .redacted:not(.revealed):hover::after { opacity: 1; }
  `;
    document.head.appendChild(style);

    document.addEventListener('click', e => {
        const el = e.target.closest('.redacted');
        if (!el || el.classList.contains('revealed')) return;
        el.classList.add('revealed');
        if (el.dataset.real) {
            el.textContent = el.dataset.real;
        }
    });
})();

/* ==========================================
   6. EFECTO GLITCH EN HOVER DE TÍTULOS
   ========================================== */
(function () {
    const CHARS = '▓░█▒╳╬╪╫╢╟╞';

    function glitchOne(el) {
        const orig = el.textContent;
        const idx = Math.floor(Math.random() * orig.length);
        let i = 0;
        const iv = setInterval(() => {
            el.textContent = orig.split('').map((c, j) =>
                j === idx ? CHARS[Math.floor(Math.random() * CHARS.length)] : c
            ).join('');
            if (++i > 4) {
                clearInterval(iv);
                el.textContent = orig;
            }
        }, 40);
    }

    function attach(selector) {
        document.querySelectorAll(selector).forEach(el => {
            let timer;
            el.addEventListener('mouseenter', () => {
                glitchOne(el);
                timer = setInterval(() => glitchOne(el), 600);
            });
            el.addEventListener('mouseleave', () => {
                clearInterval(timer);
                if (el._origText) el.textContent = el._origText;
            });
            el._origText = el.textContent;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            attach('.post-row-title a');
            attach('.featured-title a');
        });
    } else {
        attach('.post-row-title a');
        attach('.featured-title a');
    }
})();

/* ==========================================
   7. NOTIFICACIÓN TOAST (Fragmento copiado)
   ========================================== */
(function () {
    const style = document.createElement('style');
    style.textContent = `
    #zm-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      background: var(--bg3, #161616);
      border: 1px solid var(--border2, rgba(255,255,255,0.13));
      border-left: 2px solid var(--red, #c0392b);
      font-family: var(--font-mono, monospace);
      font-size: 0.7rem;
      color: var(--text2, #7a7670);
      padding: 0.5rem 1rem;
      letter-spacing: 0.1em;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s, transform 0.2s;
      z-index: 9000;
      white-space: nowrap;
    }
    #zm-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
    document.head.appendChild(style);

    const toast = document.createElement('div');
    toast.id = 'zm-toast';
    toast.textContent = '// fragmento copiado';
    document.body.appendChild(toast);

    let hideTimer;
    document.addEventListener('copy', () => {
        clearTimeout(hideTimer);
        toast.classList.add('show');
        hideTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    });
})();

/* ==========================================
   8. EASTER EGG (5 clicks en el Logo = Estática)
   ========================================== */
(function () {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes zm-interference {
      0%   { opacity: 1; transform: skewX(0deg); }
      10%  { opacity: 0.7; transform: skewX(-3deg) scaleY(1.01); }
      20%  { opacity: 1; transform: skewX(2deg); }
      30%  { opacity: 0.5; transform: skewX(-1deg) scaleY(0.99); }
      40%  { opacity: 0.9; transform: skewX(3deg); }
      50%  { opacity: 0.6; transform: skewX(0deg) scaleY(1.02); }
      60%  { opacity: 1; transform: skewX(-2deg); }
      70%  { opacity: 0.8; transform: skewX(1deg); }
      80%  { opacity: 0.5; transform: skewX(-3deg) scaleY(0.98); }
      90%  { opacity: 0.9; transform: skewX(2deg); }
      100% { opacity: 1; transform: skewX(0deg); }
    }
    #main-site.interference {
      animation: zm-interference 0.12s steps(1) infinite;
    }
    #zm-egg-canvas {
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.1s;
    }
    #zm-egg-canvas.active { opacity: 0.4; }
  `;
    document.head.appendChild(style);

    const canvas = document.createElement('canvas');
    canvas.id = 'zm-egg-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeEgg() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeEgg();
    window.addEventListener('resize', resizeEgg);

    let eggAnimId;

    const staticAudio = new Audio("/audio/static.mp3");
    
    let audioCtx = null;
    let source = null;
    let filterNode = null;
    let distortionNode = null;
    let gainNode = null;

    function makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 100;
        for (let i = 0 ; i < n_samples; ++i ) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    function initWebAudio() {
        if (audioCtx) return;

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        source = audioCtx.createMediaElementSource(staticAudio);
        
        filterNode = audioCtx.createBiquadFilter();
        distortionNode = audioCtx.createWaveShaper();
        gainNode = audioCtx.createGain();

        filterNode.type = "bandpass";
        distortionNode.curve = makeDistortionCurve(60);
        distortionNode.oversample = '4x';
        gainNode.gain.value = 0.25;

        source.connect(distortionNode);
        distortionNode.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    }

    function drawEggNoise() {
        const w = canvas.width, h = canvas.height;
        const img = ctx.createImageData(w, h);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 255;
            img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
            img.data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        eggAnimId = requestAnimationFrame(drawEggNoise);
    }

    function triggerEgg() {
        const site = document.getElementById('main-site');
        if (!site) return;

        initWebAudio();

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const randomPitch = 0.85 + Math.random() * 0.3;
        staticAudio.playbackRate = randomPitch;

        const randomFrequency = 400 + Math.random() * 1400;
        filterNode.frequency.value = randomFrequency;
        filterNode.Q.value = 2 + Math.random() * 5;

        const randomDistortion = 30 + Math.floor(Math.random() * 70);
        distortionNode.curve = makeDistortionCurve(randomDistortion);

        site.classList.add('interference');
        canvas.classList.add('active');
        drawEggNoise();

        staticAudio.currentTime = 0;
        staticAudio.play().catch(e => {
            console.warn("[ZONA MUERTA] No se pudo reproducir el audio modulado:", e);
        });

        setTimeout(() => {
            site.classList.remove('interference');
            canvas.classList.remove('active');
            cancelAnimationFrame(eggAnimId);
            
            staticAudio.pause();
        }, 3000);
    }

    let clicks = 0;
    let resetTimer;
    document.addEventListener('click', e => {
        const logo = e.target.closest('.logo-block, .logo-sym, .logo-name');
        if (!logo) return;
        
        clicks++;
        clearTimeout(resetTimer);
        
        resetTimer = setTimeout(() => {
            clicks = 0;
        }, 1500);
        
        if (clicks >= 5) {
            clicks = 0;
            triggerEgg();
        }
    });
})();