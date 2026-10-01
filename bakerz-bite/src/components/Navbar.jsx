import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { useScrolledPast, useScrollTo, useVisitorCount } from '../hooks/useSiteFeatures.js';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'merchandise', label: 'Merchandise' },
  { id: 'offers', label: 'Offers' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About Us' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact Us' },
];

export default function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolledPast(30);
  const visitors = useVisitorCount();
  const scrollTo = useScrollTo();

  // Close the mobile drawer on Escape or once the viewport grows past the
  // breakpoint, otherwise it stays mounted but invisible and traps clicks.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 991 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const go = (id) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <header className={`bb-nav${scrolled ? ' bb-nav--scrolled' : ''}`}>
      <div className="container">
        <div className="bb-nav__inner">
          <a
            className="bb-logo"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
          >
            <Logo />
            <span className="bb-logo__text">
              <span className="bb-logo__name">Bakerz Bite</span>
              <span className="bb-logo__tag">Bakery &amp; Café</span>
            </span>
          </a>

          <nav aria-label="Primary">
            <ul className={`bb-nav__links${open ? ' is-open' : ''}`}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`bb-nav__link${active === item.id ? ' is-active' : ''}`}
                    aria-current={active === item.id ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Spec: visitor count sits at the top right beside the logo. */}
          <div className="bb-visitor" title="Total visits to this site">
            <span className="bb-visitor__dot" aria-hidden="true" />
            <span className="bb-visitor__label">Visitors</span>
            <strong>{visitors.toLocaleString()}</strong>
          </div>

          <button
            type="button"
            className="bb-burger"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
              <path
                d={open ? 'M2 2l16 10M18 2L2 12' : 'M0 1h20M0 7h20M0 13h20'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
