import { asset } from '../data/catalog.js';
import { Reveal, SectionHead } from './ui.jsx';

function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Spec: a section listing the offers running in store, with their details. */
export default function Offers({ offers }) {
  return (
    <section className="bb-section" id="offers">
      <div className="container">
        <SectionHead eyebrow="Worth knowing" title="Offers in Store">
          Standing offers you can walk in and use today. No app, no sign-up and
          no small print beyond what is listed here.
        </SectionHead>

        <div className="row g-4">
          {offers.map((offer) => (
            <div className="col-12 col-md-6 col-xl-4" key={offer.id}>
              <Reveal className="bb-offer h-100">
                <div className="bb-offer__media">
                  <img src={asset(offer.image)} alt={offer.title} loading="lazy" />
                  <span className="bb-offer__kind">{offer.badge}</span>
                  <span className="bb-offer__ribbon">{offer.discountLabel}</span>
                </div>

                <div className="bb-offer__body">
                  <span className="bb-card__cat">{offer.title}</span>
                  <h3 className="bb-offer__headline">{offer.headline}</h3>
                  <p className="bb-card__desc">{offer.description}</p>

                  <ul className="bb-offer__terms">
                    {offer.terms.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>

                  <div className="bb-offer__valid">
                    Valid {formatDate(offer.validFrom)} – {formatDate(offer.validTill)}
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
