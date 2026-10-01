import { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ store */

/** useState backed by localStorage, tolerant of private mode and bad JSON. */
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode / quota) — keep state in memory */
    }
  }, [key, value]);

  return [value, setValue];
}

/* ---------------------------------------------------------- visitor count */

const VISITS_KEY = 'bb.visitorCount';
const SEEN_KEY = 'bb.countedThisSession';
const SEED = 12480; // so a fresh browser does not display "1"

/**
 * Visitor counter for the badge beside the logo. Counts one visit per browser
 * session, persisting the running total in localStorage.
 */
export function useVisitorCount() {
  const [count, setCount] = useState(SEED);

  useEffect(() => {
    let total = SEED;
    try {
      const stored = parseInt(window.localStorage.getItem(VISITS_KEY) ?? '', 10);
      if (Number.isFinite(stored) && stored >= SEED) total = stored;

      // sessionStorage resets per tab session, so a refresh does not inflate it.
      if (!window.sessionStorage.getItem(SEEN_KEY)) {
        total += 1;
        window.sessionStorage.setItem(SEEN_KEY, '1');
        window.localStorage.setItem(VISITS_KEY, String(total));
      }
    } catch {
      /* storage blocked — fall back to the seed */
    }
    setCount(total);
  }, []);

  return count;
}

/* ------------------------------------------------------------------ clock */

/** Live date and time, re-rendered once a second. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

/* --------------------------------------------------------------- location */

/**
 * HTML5 Geolocation for the ticker. Resolves to a human-readable place name
 * when the browser allows it and a reverse-geocode lookup succeeds, otherwise
 * degrades to raw coordinates, and finally to a plain message. Never blocks
 * the UI and never throws.
 */
export function useGeoLocation() {
  // Start in the pending state rather than setting it from the effect, so the
  // first paint already shows the right thing.
  const [location, setLocation] = useState({
    status: 'pending',
    label: 'Locating you…',
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation({ status: 'unsupported', label: 'Location not supported by this browser' });
      return undefined;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (cancelled) return;
        const { latitude, longitude } = coords;
        const rough = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

        // Show coordinates immediately, then upgrade to a place name if the
        // lookup works. Offline or blocked, the coordinates simply remain.
        setLocation({ status: 'ok', label: rough, latitude, longitude });

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!res.ok) return;
          const d = await res.json();
          const place = [d.city || d.locality, d.principalSubdivision, d.countryName]
            .filter(Boolean)
            .join(', ');
          if (!cancelled && place) {
            setLocation({ status: 'ok', label: place, latitude, longitude });
          }
        } catch {
          /* keep the coordinates we already showed */
        }
      },
      (err) => {
        if (cancelled) return;
        const label =
          err.code === err.PERMISSION_DENIED
            ? 'Location access blocked'
            : 'Location unavailable';
        setLocation({ status: 'error', label });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}

/* ------------------------------------------------------------- scroll spy */

/**
 * Tracks which section is currently in view so the navbar can colour the
 * matching menu item, which the spec asks for on click as well as hover.
 */
export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (!ids.length) return undefined;

    const onScroll = () => {
      const line = window.scrollY + offset;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      }
      // Pin the final section once the page is scrolled to the very bottom,
      // which short trailing sections would otherwise never reach. Measured
      // against documentElement and guarded on the page actually being
      // scrollable, because an open modal locks body scroll and would
      // otherwise read as "at the bottom" from anywhere on the page.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = maxScroll > 4 && window.scrollY >= maxScroll - 2;
      setActive(atBottom ? ids[ids.length - 1] : current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return active;
}

/** True once the page has been scrolled past `after` pixels. */
export function useScrolledPast(after = 40) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > after);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [after]);

  return past;
}

/* ----------------------------------------------------------- fade reveals */

/**
 * Adds the .is-in class when the element scrolls into view, driving the
 * fade-in used across every section.
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in');
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/** Smoothly scrolls to a section id, accounting for the fixed navbar. */
export function useScrollTo() {
  return useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);
}
