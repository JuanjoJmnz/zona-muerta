/* ==========================================================================
   ZONA MUERTA — egg-hints.js
   Pista suelta rotativa, pensada para el footer o el sidebar.
   Solo muestra pistas de easter eggs que TODAVÍA no se han descubierto,
   para no espoilear lo que ya encontraste ni repetir lo obvio.

   Requiere egg-tracker.js cargado antes.
   ========================================================================== */

(function () {
  const style = document.createElement('style');
  style.textContent = `
    .zm-hint-widget {
      font-family: var(--font-mono, monospace);
      font-size: 0.68rem;
      color: var(--text2, #3a3835);
      letter-spacing: 0.04em;
      line-height: 1.6;
      padding: 0.75rem 0;
      cursor: default;
    }
    .zm-hint-widget .zm-hint-label {
      color: var(--red, #c0392b);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 0.6rem;
      display: block;
      margin-bottom: 0.4rem;
    }
    .zm-hint-widget .zm-hint-text {
      font-style: italic;
    }
    .zm-hint-widget a {
      color: var(--text2, #7a7670);
      text-decoration: underline;
      text-decoration-color: var(--border2, rgba(255,255,255,0.13));
    }
    .zm-hint-widget a:hover { color: var(--text, #ddd8d0); }
  `;
  document.head.appendChild(style);

  function pickHint() {
    if (typeof window.ZM_getEggProgress !== 'function') return null;

    const { unlockedIds, catalog } = window.ZM_getEggProgress();
    const lockedIds = Object.keys(catalog).filter(id => !unlockedIds.includes(id));

    if (lockedIds.length === 0) {
      return { allFound: true };
    }

    const randomId = lockedIds[Math.floor(Math.random() * lockedIds.length)];
    return { hint: catalog[randomId].hint };
  }

  function render(container) {
    const result = pickHint();
    if (!result) {
      container.style.display = 'none';
      return;
    }

    if (result.allFound) {
      container.innerHTML = `
        <span class="zm-hint-label">// archivo completo</span>
        <span class="zm-hint-text">Has encontrado todas las anomalías registradas. El expediente está cerrado — por ahora.</span>
      `;
      return;
    }

    container.innerHTML = `
      <span class="zm-hint-label">// fragmento de expediente sellado</span>
      <span class="zm-hint-text">${result.hint}</span>
    `;
  }

  function init() {
    document.querySelectorAll('.zm-hint-widget').forEach(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Lo exponemos para poder refrescarlo manualmente si se desbloquea
  // un egg mientras la página sigue abierta (opcional, no es necesario
  // recargar la página para que el contador de /expediente se actualice,
  // pero esto permite refrescar también el propio widget de pista).
  window.ZM_refreshHintWidget = init;
})();
