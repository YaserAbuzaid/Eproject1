import { useMemo, useState } from 'react';
import { categoriesOf } from '../data/catalog.js';
import { ProductCard, Reveal, SectionHead } from './ui.jsx';

/**
 * Spec: a Merchandise section carrying Bakerz Bite branded mugs, bags,
 * glasses and trays, with the same filter-and-popup behaviour as the menu.
 */
export default function Merchandise({ merchandise, currency, onOpen }) {
  const categories = useMemo(() => categoriesOf(merchandise), [merchandise]);
  const [category, setCategory] = useState('All');

  const visible =
    category === 'All'
      ? merchandise
      : merchandise.filter((m) => m.category === category);

  return (
    <section className="bb-section bb-section--tint" id="merchandise">
      <div className="container">
        <SectionHead eyebrow="Take us home" title="Merchandise">
          Mugs, bags, glasses and trays carrying the Bakerz Bite mark, made to the
          same standard as the things we bake.
        </SectionHead>

        <Reveal className="d-flex justify-content-center mb-4">
          <div className="bb-chiprow justify-content-center">
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
        </Reveal>

        <div className="bb-grid">
          {visible.map((m) => (
            <ProductCard key={m.id} item={m} currency={currency} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
