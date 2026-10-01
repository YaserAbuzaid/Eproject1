import { useEffect, useState } from 'react';

// Every JSON file in public/data. The spec requires the data store to be
// plain JSON files rather than a database, so these are fetched at runtime.
const SOURCES = {
  site: 'data/site.json',
  products: 'data/products.json',
  merchandise: 'data/merchandise.json',
  offers: 'data/offers.json',
  gallery: 'data/gallery.json',
  faq: 'data/faq.json',
};

// Vite serves public/ from BASE_URL, which is "/" in dev but can be a
// subfolder in a built copy. Resolving through it keeps the site working
// when the dist folder is dropped into any directory on a web server.
export function asset(p) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${String(p).replace(/^\//, '')}`;
}

async function loadJson(path) {
  const res = await fetch(asset(path));
  if (!res.ok) throw new Error(`Could not load ${path} (HTTP ${res.status})`);
  return res.json();
}

/**
 * Loads the whole catalogue once and hands back a flat, ready-to-render shape.
 * Returns { data, loading, error } where data is null until the fetch settles.
 */
export function useCatalog() {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const keys = Object.keys(SOURCES);
        const loaded = await Promise.all(keys.map((k) => loadJson(SOURCES[k])));
        if (cancelled) return;

        const raw = Object.fromEntries(keys.map((k, i) => [k, loaded[i]]));
        setState({
          loading: false,
          error: null,
          data: {
            site: raw.site,
            currency: raw.products.currency ?? '$',
            products: raw.products.products ?? [],
            merchandise: raw.merchandise.merchandise ?? [],
            offers: raw.offers.offers ?? [],
            gallery: raw.gallery.gallery ?? [],
            faq: raw.faq.faq ?? [],
          },
        });
      } catch (err) {
        if (!cancelled) setState({ data: null, loading: false, error: err });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Category names in the order they should appear in the filter bar. */
export function categoriesOf(items) {
  return [...new Set(items.map((i) => i.category))];
}

/** Every dietary tag present across the given items, alphabetised. */
export function dietaryOf(items) {
  return [...new Set(items.flatMap((i) => i.dietary ?? []))].sort();
}

export function formatPrice(value, currency = '$') {
  return `${currency}${Number(value).toFixed(2)}`;
}
