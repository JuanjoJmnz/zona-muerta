// src/pages/rss.xml.js
//
// Genera el feed RSS de Zona Muerta en /rss.xml
// Usa import.meta.glob, igual que index.astro y buscar.astro,
// en vez de Content Collections (que este proyecto no usa).
//

import rss from '@astrojs/rss';

export async function GET(context) {
  const postsGlob = import.meta.glob('./posts/*.md', { eager: true });
  const posts = Object.values(postsGlob);

  // Mismo orden que el resto del sitio: más reciente primero
  const sorted = posts.sort(
    (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );

  return rss({
    title: 'Zona Muerta',
    description:
      'Archivo de lo inexplicable: urbex, leyendas, folklore, videojuegos e hilos de /x/.',
    site: context.site,
    items: sorted.map((post) => ({
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      pubDate: new Date(post.frontmatter.date),
      link: post.url,
      categories: post.frontmatter.tags || [],
    })),
    customData: `<language>es-es</language>`,
  });
}
