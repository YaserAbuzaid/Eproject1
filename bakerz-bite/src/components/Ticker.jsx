import { useClock, useGeoLocation } from '../hooks/useSiteFeatures.js';

/**
 * Spec: a continuous scrolling ticker at the bottom of the page showing the
 * current date, time and location, using the HTML5 geolocation feature.
 *
 * The strip is rendered twice back to back and translated by -50%, which is
 * what makes the scroll loop seamlessly.
 */
export default function Ticker({ motto }) {
  const now = useClock();
  const geo = useGeoLocation();

  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const strip = (
    <span className="bb-ticker__chunk">
      <span>
        📅 <span className="bb-ticker__hl">{date}</span>
      </span>
      <span className="bb-ticker__sep">◆</span>
      <span>
        🕑 <span className="bb-ticker__hl">{time}</span>
      </span>
      <span className="bb-ticker__sep">◆</span>
      <span>
        📍 Your location: <span className="bb-ticker__hl">{geo.label}</span>
      </span>
      <span className="bb-ticker__sep">◆</span>
      <span>{motto}</span>
      <span className="bb-ticker__sep">◆</span>
      <span>Fresh bread out of the oven at 7 am, 12 pm and 5 pm</span>
      <span className="bb-ticker__sep">◆</span>
    </span>
  );

  return (
    <div className="bb-ticker" role="status" aria-live="off">
      <span className="bb-ticker__tag">Live</span>
      <div className="bb-ticker__view">
        <div className="bb-ticker__track">
          {strip}
          {/* duplicate copy keeps the marquee continuous */}
          <span aria-hidden="true">{strip}</span>
        </div>
      </div>
    </div>
  );
}
