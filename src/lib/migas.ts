/* BreadcrumbList (migas de pan) para las páginas internas.

   Google muestra la ruta "Inicio › Blog › Artículo" en lugar de la URL cuando la
   página la declara. Solo se agregan como niveles intermedios las secciones que
   existen de verdad (las de `secciones`); el último nivel es la página actual con
   su URL canónica. En la portada no se emite nada. */

export interface Miga {
  name: string;
  url: string;
}

export function migasDePan(opts: {
  /** Ruta sin prefijo de idioma, p. ej. "/blog/mi-articulo" ("/" en la portada). */
  ruta: string;
  inicio: Miga;
  /** Secciones intermedias que existen como página: "/blog" → { name, url }. */
  secciones: Record<string, Miga>;
  /** Nombre visible de la página actual (sin la marca). */
  actual: string;
  /** URL canónica de la página actual. */
  urlActual: string;
}): Record<string, unknown> | null {
  const ruta = opts.ruta.replace(/\/+$/, '') || '/';
  if (ruta === '/') return null;
  const partes = ruta.split('/').filter(Boolean);
  const items: Miga[] = [opts.inicio];
  for (let i = 1; i < partes.length; i++) {
    const s = opts.secciones['/' + partes.slice(0, i).join('/')];
    if (s) items.push(s);
  }
  items.push({ name: opts.actual, url: opts.urlActual });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      item: m.url,
    })),
  };
}
