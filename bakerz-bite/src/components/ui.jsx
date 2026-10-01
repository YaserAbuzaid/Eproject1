import { asset, formatPrice } from '../data/catalog.js';
import { useReveal } from '../hooks/useSiteFeatures.js';

/** Section wrapper that fades its children in when scrolled into view. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`bb-reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/** Centred eyebrow + title + blurb used at the top of every section. */
export function SectionHead({ eyebrow, title, children }) {
  return (
    <Reveal className="bb-head">
      {eyebrow ? <span className="bb-head__eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </Reveal>
  );
}

/** Read-only star row rendered from a 0–5 score. */
export function Stars({ value = 0, count }) {
  const rounded = Math.round(value);
  return (
    <span className="bb-stars" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true">
          {n <= rounded ? '★' : '☆'}
        </span>
      ))}
      {count != null ? <span className="bb-stars__count">({count})</span> : null}
    </span>
  );
}

/** Corner ribbons such as Bestseller / New / Seasonal. */
export function Badges({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="bb-badges">
      {items.map((b) => (
        <span key={b} className={`bb-badge bb-badge--${b}`}>
          {b}
        </span>
      ))}
    </div>
  );
}

/**
 * One tile in the menu or merchandise grid. Rendered as a button because its
 * whole job is to open the product pop-up, which keeps it keyboard reachable.
 */
export function ProductCard({ item, currency, onOpen }) {
  return (
    <button type="button" className="bb-card" onClick={() => onOpen(item)}>
      <div className="bb-card__media">
        <Badges items={item.badges} />
        <img src={asset(item.image)} alt={item.name} loading="lazy" />
        <span className="bb-card__peek">Click for ingredients &amp; details →</span>
      </div>

      <div className="bb-card__body">
        <span className="bb-card__cat">{item.category}</span>
        <h3 className="bb-card__name">{item.name}</h3>
        <p className="bb-card__desc">{item.shortDescription}</p>

        <div className="bb-card__foot">
          <span className="bb-price">
            {formatPrice(item.price, currency)}
            <small>/ {item.unit}</small>
          </span>
          <Stars value={item.rating} />
        </div>
      </div>
    </button>
  );
}
