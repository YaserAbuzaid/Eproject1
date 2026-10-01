import { useState } from 'react';

import { useCatalog } from './data/catalog.js';
import { useScrolledPast, useScrollSpy } from './hooks/useSiteFeatures.js';

import Navbar, { NAV_ITEMS } from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Menu from './components/Menu.jsx';
import Merchandise from './components/Merchandise.jsx';
import Offers from './components/Offers.jsx';
import Gallery from './components/Gallery.jsx';
import Feedback from './components/Feedback.jsx';
import About from './components/About.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Ticker from './components/Ticker.jsx';
import ProductModal from './components/ProductModal.jsx';

// Module scope keeps the array identity stable across renders, so the
// scroll-spy effect is not torn down and rebuilt on every paint.
const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function App() {
  const { data, loading, error } = useCatalog();
  const [selected, setSelected] = useState(null);
  const active = useScrollSpy(SECTION_IDS);
  const showToTop = useScrolledPast(600);

  if (loading) {
    return (
      <div className="bb-loading">
        <div className="bb-spinner" />
        <p>Warming the ovens…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bb-loading">
        <h2>We could not load the menu</h2>
        <p style={{ maxWidth: 460 }}>
          The JSON data files under <code>public/data</code> could not be read.{' '}
          {error.message}
        </p>
      </div>
    );
  }

  const { site, currency, products, merchandise, offers, gallery, faq } = data;

  return (
    <>
      <Navbar active={active} />

      <main>
        <Hero site={site} />
        <Menu products={products} currency={currency} onOpen={setSelected} />
        <Merchandise
          merchandise={merchandise}
          currency={currency}
          onOpen={setSelected}
        />
        <Offers offers={offers} />
        <Gallery gallery={gallery} />
        <Feedback />
        <About site={site} />
        <Faq faq={faq} />
        <Contact site={site} />
      </main>

      <Footer site={site} />

      {/* Spec: scrolling ticker fixed at the bottom of the page. */}
      <Ticker motto={site.motto} />

      <button
        type="button"
        className={`bb-toTop${showToTop ? ' is-on' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>

      <ProductModal
        item={selected}
        currency={currency}
        onHide={() => setSelected(null)}
      />
    </>
  );
}
