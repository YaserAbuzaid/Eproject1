import { useMemo, useState } from 'react';
import { useStoredState } from '../hooks/useSiteFeatures.js';
import { Reveal, SectionHead, Stars } from './ui.jsx';

const SEEDED = [
  {
    id: 'seed-1',
    name: 'Priya Raman',
    rating: 5,
    message:
      'The croissants here are the only ones in town that actually shatter when you bite them. Worth the queue on a Saturday.',
    date: '2026-02-14T09:20:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'Daniel Okafor',
    rating: 5,
    message:
      'Ordered a truffle cake for my daughter’s birthday with four days notice. They piped the message exactly as asked and it was gone in twenty minutes.',
    date: '2026-03-02T17:05:00.000Z',
  },
  {
    id: 'seed-3',
    name: 'Helena Vogt',
    rating: 4,
    message:
      'Sourdough is genuinely excellent. Only wish they baked more of it, it sells out before lunch most days.',
    date: '2026-03-21T11:48:00.000Z',
  },
];

const STORAGE_KEY = 'bb.feedback';

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Spec: feedback and a rating must be enterable by the viewer. */
export default function Feedback() {
  const [saved, setSaved] = useStoredState(STORAGE_KEY, []);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const all = useMemo(() => [...saved, ...SEEDED], [saved]);

  const average = useMemo(() => {
    if (!all.length) return 0;
    return all.reduce((sum, r) => sum + r.rating, 0) / all.length;
  }, [all]);

  const submit = (e) => {
    e.preventDefault();

    const next = {};
    if (!name.trim()) next.name = 'Please tell us your name.';
    if (!rating) next.rating = 'Please pick a star rating.';
    if (message.trim().length < 10) {
      next.message = 'A little more detail please, at least 10 characters.';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaved((cur) => [
      {
        id: `fb-${Date.now()}`,
        name: name.trim(),
        rating,
        message: message.trim(),
        date: new Date().toISOString(),
      },
      ...cur,
    ]);

    setName('');
    setRating(0);
    setMessage('');
    setErrors({});
    setDone(true);
    window.setTimeout(() => setDone(false), 6000);
  };

  return (
    <section className="bb-section" id="feedback">
      <div className="container">
        <SectionHead eyebrow="Your turn" title="Feedback & Rating">
          Tell us how we did. Reviews you leave here are stored in this browser
          so you can see them on your next visit.
        </SectionHead>

        <div className="bb-feedback">
          <Reveal>
            <form className="bb-form" onSubmit={submit} noValidate>
              {done ? (
                <div className="bb-note" role="status">
                  Thank you — your review has been added below.
                </div>
              ) : null}

              <div className="bb-form__row">
                <label htmlFor="fb-name">Your name</label>
                <input
                  id="fb-name"
                  className="bb-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Raman"
                />
                {errors.name ? <span className="bb-error">{errors.name}</span> : null}
              </div>

              <div className="bb-form__row">
                <label htmlFor="fb-rating">Your rating</label>
                <div className="bb-rate" id="fb-rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={(hover || rating) >= n ? 'is-on' : ''}
                      aria-label={`${n} star${n === 1 ? '' : 's'}`}
                      aria-pressed={rating === n}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {errors.rating ? (
                  <span className="bb-error">{errors.rating}</span>
                ) : null}
              </div>

              <div className="bb-form__row">
                <label htmlFor="fb-message">Your review</label>
                <textarea
                  id="fb-message"
                  className="bb-field"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did you order, and how was it?"
                />
                {errors.message ? (
                  <span className="bb-error">{errors.message}</span>
                ) : null}
              </div>

              <button type="submit" className="bb-btn bb-btn--primary w-100">
                Submit review
              </button>
            </form>
          </Reveal>

          <Reveal>
            <div className="bb-summary">
              <div className="bb-summary__score">{average.toFixed(1)}</div>
              <div>
                <Stars value={average} />
                <div style={{ fontSize: '0.86rem', opacity: 0.75, marginTop: 6 }}>
                  Based on {all.length} review{all.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {all.map((r) => (
              <article className="bb-review" key={r.id}>
                <div className="bb-review__top">
                  <span className="bb-review__who">{r.name}</span>
                  <span className="bb-review__when">{timeAgo(r.date)}</span>
                </div>
                <Stars value={r.rating} />
                <p className="mt-2">{r.message}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
