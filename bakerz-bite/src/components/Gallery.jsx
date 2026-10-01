import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '../data/catalog.js';
import { Reveal, SectionHead } from './ui.jsx';

/** Spec: a gallery for viewing different images, here with a lightbox. */
export default function Gallery({ gallery }) {
  const tags = useMemo(
    () => ['All', ...new Set(gallery.map((g) => g.tag))],
    [gallery]
  );
  const [tag, setTag] = useState('All');
  const [openAt, setOpenAt] = useState(null);
  const lightboxRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const shown = tag === 'All' ? gallery : gallery.filter((g) => g.tag === tag);

  const step = useCallback(
    (delta) =>
      setOpenAt((i) => (i === null ? null : (i + delta + shown.length) % shown.length)),
    [shown.length]
  );

  useEffect(() => {
    if (openAt === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenAt(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openAt, step]);

  // Move focus into the lightbox when it opens and hand it back to the thumbnail
  // on close, so keyboard users are not dumped at the top of the document.
  useEffect(() => {
    if (openAt === null) {
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
      return;
    }
    // Only capture on the initial open, not when stepping between images.
    if (!restoreFocusRef.current) restoreFocusRef.current = document.activeElement;
    lightboxRef.current?.focus();
  }, [openAt]);

  // Clamp rather than close when a filter shrinks the list under the open
  // index, so the lightbox never points past the end of the array.
  const current = openAt === null ? null : shown[Math.min(openAt, shown.length - 1)];

  return (
    <section className="bb-section bb-section--tint" id="gallery">
      <div className="container">
        <SectionHead eyebrow="Look around" title="Gallery">
          The shop, the ovens and the things that come out of them.
        </SectionHead>

        <Reveal className="d-flex justify-content-center mb-4">
          <div className="bb-chiprow justify-content-center">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`bb-chip${tag === t ? ' is-on' : ''}`}
                aria-pressed={tag === t}
                onClick={() => {
                  setTag(t);
                  setOpenAt(null);
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="bb-gallery">
          {shown.map((g, i) => (
            <button
              key={g.id}
              type="button"
              className="bb-gallery__item"
              onClick={() => setOpenAt(i)}
              aria-label={`Open image: ${g.caption}`}
            >
              <img src={asset(g.image)} alt={g.caption} loading="lazy" />
              <span className="bb-gallery__cap">{g.caption}</span>
            </button>
          ))}
        </Reveal>
      </div>

      {current ? (
        <div
          className="bb-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          ref={lightboxRef}
          tabIndex={-1}
          onClick={() => setOpenAt(null)}
        >
          <button
            type="button"
            className="bb-lightbox__nav"
            style={{ left: 22 }}
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            ‹
          </button>

          <img
            src={asset(current.image)}
            alt={current.caption}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="bb-lightbox__cap">
            {current.caption}
            <br />
            <small style={{ opacity: 0.6 }}>
              Press Esc to close, arrow keys to browse
            </small>
          </p>

          <button
            type="button"
            className="bb-lightbox__nav"
            style={{ right: 22 }}
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
}
