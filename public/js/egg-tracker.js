/* ==========================================================================
   ZONA MUERTA — egg-tracker.js
   Sistema de seguimiento de easter eggs descubiertos.

   Cada easter egg, al activarse, debe llamar a:
     window.ZM_unlockEgg('id_del_egg')

   Esto guarda el progreso en localStorage y lo deja disponible para
   que la página /expediente lo lea y muestre qué se ha descubierto.

   IMPORTANTE: cargar este script ANTES que vibes.js, vibes2.js,
   blood.js, screamer.js y eggs.js, para que window.ZM_unlockEgg ya
   exista cuando esos otros scripts lo llamen.
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'zm_unlocked_eggs';

  // Catálogo central: id técnico -> datos para mostrar en /expediente.
  // Si añades un easter egg nuevo en el futuro, solo hace falta:
  //   1. Añadirlo aquí
  //   2. Llamar a window.ZM_unlockEgg('su_id') donde se dispare el efecto
  const EGG_CATALOG = {
    sangre: {
      title: 'La palabra que mancha',
      hint: 'Hay palabras que tiñen. Una de seis letras enrojece la pantalla.',
      revealed: 'Escribir "sangre" en cualquier parte de la página.',
    },
    bestia: {
      title: 'El número de la bestia',
      hint: 'La bestia tiene tres seis. Escríbelos y verás su rostro.',
      revealed: 'Escribir el código 666.',
    },
    luz: {
      title: 'La bombilla que falla',
      hint: 'Algo parpadea cuando nombras lo que ilumina. Tres letras, una luz a punto de morir.',
      revealed: 'Escribir "luz" en cualquier parte de la página.',
    },
    ayuda: {
      title: 'El suelo tiembla',
      hint: 'Pide socorro y el suelo temblará bajo tus pies.',
      revealed: 'Escribir "ayuda".',
    },
    mirar: {
      title: 'Ojos que esperan',
      hint: 'Hay ojos esperando a que los nombres. Cinco letras para verlos aparecer.',
      revealed: 'Escribir "mirar".',
    },
    logo: {
      title: 'La señal se rompe',
      hint: 'El símbolo central no es decorativo. Insiste cinco veces y la señal se romperá.',
      revealed: 'Hacer 5 clics seguidos en el logo ⊗.',
    },
    scroll: {
      title: 'Pulso de cámara',
      hint: 'Agita la pantalla como quien busca algo perdido, y la cámara temblará contigo.',
      revealed: 'Hacer scroll rápido arriba y abajo varias veces.',
    },
    fecha: {
      title: 'El calendario miente',
      hint: 'Las fechas no siempre dicen la verdad. Insiste tres veces sobre una.',
      revealed: 'Triple clic sobre la fecha de cualquier entrada.',
    },
    trece: {
      title: 'Trece, tres veces',
      hint: 'Trece. Tres veces. Con un paso atrás entre cada una.',
      revealed: 'Escribir "13" tres veces, con Backspace entre cada una.',
    },
    konami: {
      title: 'La secuencia antigua',
      hint: 'Una secuencia vieja de los videojuegos invierte el mundo: arriba, arriba, abajo, abajo, izquierda, derecha, izquierda, derecha.',
      revealed: 'El código Konami: ↑ ↑ ↓ ↓ ← → ← →',
    },
    frecuencia: {
      title: 'Frecuencia sincronizada',
      hint: 'Una sola letra sincroniza la frecuencia. La que sale al pagar respetos.',
      revealed: 'Pulsar la tecla F.',
    },
    umbral: {
      title: 'Nivel de anomalía crítico',
      hint: 'No se busca. Se acumula. Diez anomalías detectadas bastan para que algo responda.',
      revealed: 'Alcanzar 10 anomalías detectadas.',
    },
    rotar: {
      title: 'El Vals de los Quietos',
      hint: 'La inercia de los muertos es caprichosa. No toques, solo observa. A los tres segundos de silencio, la maquinaria del más allá reclama su cuerda.',
      revealed: 'Mantener el ratón sobre el logo durante 3 segundos.',
    },
  };

  function getUnlocked() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveUnlocked(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // localStorage bloqueado: el progreso no persiste, pero no rompemos nada
    }
  }

  /**
   * Marca un easter egg como descubierto. Idempotente: llamarlo varias
   * veces para el mismo id no duplica ni hace nada raro.
   * Devuelve true si era la PRIMERA vez que se desbloqueaba (para que
   * quien lo llame pueda, opcionalmente, mostrar un aviso de "nuevo
   * hallazgo registrado" solo la primera vez).
   */
  window.ZM_unlockEgg = function (id) {
    if (!EGG_CATALOG[id]) {
      console.warn(`[ZONA MUERTA] Easter egg desconocido: "${id}". Añádelo a EGG_CATALOG en egg-tracker.js.`);
    }

    const unlocked = getUnlocked();
    if (unlocked.includes(id)) return false;

    unlocked.push(id);
    saveUnlocked(unlocked);
    return true;
  };

  window.ZM_getEggProgress = function () {
    const unlocked = getUnlocked();
    const total = Object.keys(EGG_CATALOG).length;
    return {
      unlockedIds: unlocked,
      unlockedCount: unlocked.length,
      total,
      catalog: EGG_CATALOG,
    };
  };
})();
