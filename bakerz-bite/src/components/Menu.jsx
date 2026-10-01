import { useMemo, useState } from 'react';
import { categoriesOf, dietaryOf, formatPrice } from '../data/catalog.js';
import { ProductCard, Reveal, SectionHead } from './ui.jsx';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'name', label: 'A to Z' },
];

const DIET_LABELS = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  eggless: 'Eggless',
  'gluten-free': 'Gluten free',
};

/**
 * Spec: sections for Cakes, Pastries, Cookies and Pies, each holding several
 * items, with filters to help the visitor narrow down to what they want.
 */
export default function Menu({ products, currency, onOpen }) {
  const categories = useMemo(() => categoriesOf(products), [products]);
  const diets = useMemo(() => dietaryOf(products), [products]);
  const ceiling = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price))),
    [products]
  );

  const [category, setCategory] = useState('All');
  const [diet, setDiet] = useState([]);
  const [maxPrice, setMaxPrice] = useState(ceiling);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const toggleDiet = (tag) =>
    setDiet((cur) => (cur.includes(tag) ? cur.filter((d) => d !== tag) : [...cur, tag]));

  const reset = () => {
    setCategory('All');
    setDiet([]);
    setMaxPrice(ceiling);
    setQuery('');
    setSort('featured');
  };

  const dirty =
    category !== 'All' ||
    diet.length > 0 ||
    maxPrice < ceiling ||
    query.trim() !== '' ||
    sort !== 'featured';

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matched = products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      // Every selected dietary tag must be satisfied, not just one of them.
      if (diet.length && !diet.every((d) => p.dietary?.includes(d))) return false;
      if (needle) {
        const haystack = [p.name, p.shortDescription, p.category, ...(p.ingredients ?? [])]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const ordered = [...matched];
    switch (sort) {
      case 'price-asc':
        ordered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        ordered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        ordered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        ordered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured: bestsellers first, then by rating.
        ordered.sort((a, b) => {
          const ab = a.badges?.includes('bestseller') ? 1 : 0;
          const bb = b.badges?.includes('bestseller') ? 1 : 0;
          return bb - ab || b.rating - a.rating;
        });
    }
    return ordered;
  }, [products, category, diet, maxPrice, query, sort]);

  return (
    <section className="bb-section" id="menu">
      <div className="container">
        <SectionHead eyebrow="The counter" title="Our Menu">
          Over three hundred varieties pass through our ovens. Here is what is on
          the shelf today, across cakes, pastries, cookies, pies, breads and
          handcrafted drinks.
        </SectionHead>

        <Reveal className="bb-filters">
          <div className="bb-filters__row">
            <div className="bb-filters__group" style={{ flex: '1 1 280px' }}>
              <span className="bb-filters__label">Search</span>
              <input
                type="search"
                className="bb-field"
                placeholder="Try “chocolate”, “almond”, “eggless”…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search the menu"
                style={{ width: '100%' }}
              />
            </div>

            <div className="bb-filters__group">
              <span className="bb-filters__label">
                Up to {formatPrice(maxPrice, currency)}
              </span>
              <input
                type="range"
                className="bb-range"
                min={1}
                max={ceiling}
                step={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price"
              />
            </div>

            <div className="bb-filters__group">
              <span className="bb-filters__label">Sort by</span>
              <select
                className="bb-field"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort the menu"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bb-filters__row mt-3">
            <div className="bb-filters__group" style={{ flex: '1 1 auto' }}>
              <span className="bb-filters__label">Category</span>
              <div className="bb-chiprow">
                {['All', ...categories].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`bb-chip${category === c ? ' is-on' : ''}`}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="bb-filters__group">
              <span className="bb-filters__label">Dietary</span>
              <div className="bb-chiprow">
                {diets.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`bb-chip${diet.includes(d) ? ' is-on' : ''}`}
                    aria-pressed={diet.includes(d)}
                    onClick={() => toggleDiet(d)}
                  >
                    {DIET_LABELS[d] ?? d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bb-filters__meta">
            <span>
              Showing <strong>{visible.length}</strong> of {products.length} items
            </span>
            {dirty ? (
              <button type="button" className="bb-linkbtn" onClick={reset}>
                Clear all filters
              </button>
            ) : null}
          </div>
        </Reveal>

        {visible.length ? (
          <div className="bb-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} item={p} currency={currency} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="bb-empty">
            <h3>Nothing matches that combination</h3>
            <p className="mb-3">
              Try widening the price range or clearing a dietary filter.
            </p>
            <button type="button" className="bb-btn bb-btn--outline" onClick={reset}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
