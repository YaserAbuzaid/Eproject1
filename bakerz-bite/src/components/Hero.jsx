import { useEffect, useState } from 'react';
import { asset } from '../data/catalog.js';
import { useScrollTo } from '../hooks/useSiteFeatures.js';

// Spec: a banner at the top of the page carrying images of cakes, pastries
// and cookies. These cycle behind the headline.
// Product-led only. Shop-front photographs on Wikimedia Commons always show
// some other bakery's signage, which has no business on this brand's banner.
const SLIDES = [
  { src: 'images/hero-1.jpg', alt: 'Bakery counter stacked with the morning bake' },
  { src: 'images/hero-2.jpg', alt: 'An assortment of freshly baked pastries' },
  { src: 'images/french-baguette.jpg', alt: 'Baguettes and seeded loaves on the bread shelf' },
];

const ROTATE_MS = 5600;

export default function Hero({ site }) {
  const [index, setIndex] = useState(0);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bb-hero" id="home">
      <div className="bb-hero__slides" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`bb-hero__slide${i === index ? ' is-active' : ''}`}
            style={{ backgroundImage: `url("${asset(slide.src)}")` }}
            role="img"
            aria-label={slide.alt}
          />
        ))}
        <div className="bb-hero__scrim" />
      </div>

      <div className="container">
        <div className="bb-hero__inner">
          <span className="bb-hero__eyebrow">Baked fresh since 4 am</span>

          <h1>
            Three hundred reasons to <em>stop by</em> today.
          </h1>

          <p className="bb-hero__motto">“{site.motto}”</p>

          <p className="bb-hero__lead">{site.tagline}</p>

          <div className="bb-hero__cta">
            <button
              type="button"
              className="bb-btn bb-btn--primary"
              onClick={() => scrollTo('menu')}
            >
              Explore the menu
            </button>
            <button
              type="button"
              className="bb-btn bb-btn--ghost"
              onClick={() => scrollTo('offers')}
            >
              Today&apos;s offers
            </button>
          </div>
        </div>
      </div>

      <div className="bb-hero__dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`bb-hero__dot${i === index ? ' is-active' : ''}`}
            aria-label={`Show banner image ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
