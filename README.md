# ⊗ ZONA MUERTA

Archivo paranormal: urbex, leyendas urbanas, folklore, videojuegos de terror, hilos de /x/ y media inexplicable.

Blog construido con [Astro](https://astro.build), desplegado en [Vercel](https://vercel.com) con deploy automático desde GitHub.

🔗 **Live:** `https://zona-muerta.vercel.app`

---

## Stack

- **Framework:** Astro, con el adaptador de Vercel (`@astrojs/vercel`) — el sitio es mayormente estático, pero `/api/subscribe.json.ts` necesita `export const prerender = false` para ejecutarse en servidor (no se puede generar como HTML fijo)
- **Newsletter:** [Buttondown](https://buttondown.email), vía su API REST desde el endpoint de Astro
- **Contenido:** Markdown (`.md`) con frontmatter, vía `import.meta.glob`
- **Hosting:** Vercel — cada `git push` a `main` despliega automáticamente
- **Sin dependencias de UI externas** — CSS y JS escritos a mano, sin frameworks de componentes

## Estructura del proyecto

```
├── src
│   ├── pages
│   │   ├── api
│   │   │   └── subscribe.json.ts   # Endpoint de suscripción al newsletter
│   │   ├── archivo
│   │   │   └── [date].astro        # Vista de posts agrupados por fecha
│   │   ├── categorias
│   │   │   ├── [category].astro    # Vista de posts por categoría
│   │   │   ├── contacto.astro      # Formulario de contacto
│   │   │   └── index.astro         # Listado de todas las categorías
│   │   ├── posts/                  # Artículos en Markdown (uno por archivo .md)
│   │   ├── tags
│   │   │   └── [tag].astro         # Vista de posts por tag
│   │   ├── index.astro             # Página principal: post destacado + listado + sidebar
│   │   └── buscar.astro            # Buscador en cliente sobre todos los posts
│   └── layouts/
│       └── PostLayout.astro        # Layout compartido: header, footer, hero de artículo
├── public/
│   ├── img/                        # Imágenes de portada/thumbnails y assets de easter eggs
│   ├── audio/                      # Audio de posts y easter eggs (screamer.mp3, static.mp3...)
│   ├── css/
│   │   ├── style.css               # Estilos base del sitio (layout, tipografía, componentes)
│   │   └── vibes.css               # Estilos de los efectos de atmósfera
│   └── js/
│       ├── main.js                 # Comportamiento base (intro estática, glitch del logo, etc.)
│       ├── vibes.js                # Primera tanda de efectos (entidad, cursor, easter egg de audio)
│       ├── vibes2.js               # Segunda tanda (reloj, manchas de archivo, frecuencia, anomalías)
│       └── eggs.js                 # Tercera tanda (luz, ayuda, mirar, scroll, fechas, contador "13")
└── README.md
```

## Contenido (posts)

Cada entrada es un archivo `.md` dentro de `posts/`, con frontmatter del tipo:

```markdown
---
title: "El Sanatorio de Agramonte: Tres Noches en el Lugar que Nadie Debería Visitar"
excerpt: "Las marcas en las paredes del ala psiquiátrica no eran pintura..."
category: "Urbex"
catClass: "cat-urbex"
imgClass: "img-urbex"
thumbImg: "/img/santuario_agramonte.png"
coverImg: "/img/santuario_agramonte.png"
date: "2026-06-16"
duration: "12 min"
tags: ["urbex", "psiquiátrico", "albacete"]
---

Contenido del artículo en Markdown...
```

Categorías activas: `Urbex`, `Leyendas`, `Folklore`, `Videojuegos`, `/x/` (`catClass: cat-xchan`), `Media`.

`index.astro` y `buscar.astro` leen todos los posts vía `import.meta.glob('./posts/*.md', { eager: true })` y los renderizan con las clases `.post-row`, `.post-row-thumb`, etc. definidas en `style.css` — **no se debe pisar ese CSS con estilos locales** en páginas nuevas; si una página se ve descuadrada respecto al resto, casi siempre es por una clase nueva sin estilos en `style.css`, no por necesitar overrides.

## Rutas dinámicas

| Ruta | Archivo | Qué hace |
|---|---|---|
| `/categorias` | `categorias/index.astro` | Listado de todas las categorías |
| `/categorias/[category]` | `categorias/[category].astro` | Posts filtrados por una categoría |
| `/categorias/contacto` | `categorias/contacto.astro` | Formulario de contacto |
| `/tags/[tag]` | `tags/[tag].astro` | Posts filtrados por tag |
| `/archivo/[date]` | `archivo/[date].astro` | Posts agrupados por fecha |
| `/buscar` | `buscar.astro` | Buscador en cliente sobre todos los posts |
| `/api/subscribe` | `api/subscribe.json.ts` | Endpoint de suscripción al newsletter |

Estas páginas comparten el mismo set de clases CSS que `index.astro`. Igual que con el buscador, si añades una página nueva que renderiza posts (listado, filtro, etc.), reutiliza `.post-row` / `.post-row-thumb` / `.post-cat` tal cual están en `style.css` en vez de definir estilos propios — es la causa más común de que algo se vea descuadrado.

## Easter eggs

| Disparador | Efecto | Archivo |
|---|---|---|
| Escribir `sangre` | Lluvia de gotas de sangre + salpicaduras | `eggs.js` |
| Escribir `666` | Screamer (imagen + audio) | `eggs.js` |
| Escribir `luz` | Parpadeo de bombilla fundiéndose | `eggs.js` |
| Escribir `ayuda` | Sacudido sutil de la página | `eggs.js` |
| Escribir `mirar` | Ojos aparecen en posición aleatoria | `eggs.js` |
| 5 clics en el logo `⊗` | Interferencia visual de pantalla completa | `vibes.js` |
| Scroll rápido arriba/abajo (4+ cambios de dirección) | Temblor de cámara | `eggs.js` |
| Triple clic en una fecha | Fecha se corrompe 2s | `eggs.js` |
| Escribir `13` tres veces | +13 al contador de anomalías | `eggs.js` |
| Cada múltiplo de 10 anomalías | Mensaje críptico aleatorio | `eggs.js` |
| 30s de inactividad | El título de la pestaña cambia | `eggs.js` |
| Konami code (↑↑↓↓←→←→) | Inversión de colores 3s | `vibes2.js` |
| Tecla `F` | Mensaje "frecuencia sincronizada" | `vibes2.js` |

Todos los listeners de teclado comprueban si el foco está en un campo de formulario (`input`, `textarea`, `select`, contenido editable) antes de actuar, para no interferir nunca con el buscador, el newsletter o el formulario de contacto.

⚠️ **Orden de carga obligatorio** de los scripts (algunos dependen de funciones globales definidas por los anteriores, como `window.ZM_registerAnomaly`):

```html
<script src="/js/main.js"></script>
<script src="/js/vibes.js"></script>
<script src="/js/vibes2.js"></script>
<script src="/js/blood.js"></script>
<script src="/js/screamer.js"></script>
<script src="/js/eggs.js"></script>
```

## Variables de entorno

| Variable | Para qué | Dónde se configura |
|---|---|---|
| `BUTTONDOWN_API_KEY` | Autenticación con la API de Buttondown para suscripciones | `.env` en local / Environment Variables en el dashboard de Vercel en producción |

El endpoint `/api/subscribe.json.ts` recibe un POST con `{ email }`, lo registra en Buttondown, y devuelve un mensaje distinto según el resultado: éxito, correo ya suscrito, o error. Si Buttondown cambia el formato de su respuesta de error, revisar la comprobación de texto `'already subscribed'` en ese archivo.

## Desarrollo local

```bash
npm install
npm run dev
```

Para probar el formulario de newsletter en local, crea un archivo `.env` en la raíz con:
```
BUTTONDOWN_API_KEY=tu_clave_aqui
```

## Deploy

Cualquier push a la rama principal en GitHub dispara un build y deploy automático en Vercel. Recuerda configurar `BUTTONDOWN_API_KEY` en **Vercel → Project Settings → Environment Variables**; sin ella, el endpoint de suscripción fallará en producción aunque el resto del sitio funcione con normalidad.

## Contenido pendiente / calendario editorial

El plan de publicación (una entrada al día, rotando categorías) vive fuera del repo. Resumen del criterio:

- **Lunes:** /x/
- **Martes:** Videojuegos
- **Miércoles:** Leyendas
- **Jueves:** Folklore
- **Viernes:** Media
- **Fin de semana:** Urbex

---

_Proyecto personal de [Juanjo](https://github.com/JuanjoJmnz). Sin clickbait. Sin exageraciones. Solo lo que la realidad oficial prefiere ignorar._
