import { asset } from '../data/catalog.js';
import { Reveal, SectionHead } from './ui.jsx';

/** Spec: an About Us section telling the brand story. */
export default function About({ site }) {
  const { about } = site;

  return (
    <section className="bb-section bb-section--dark" id="about">
      <div className="container">
        <SectionHead eyebrow="Who we are" title="About Bakerz Bite">
          {about.intro}
        </SectionHead>

        <div className="row g-5 align-items-center">
          <div className="col-12 col-lg-6">
            <Reveal>
              <img
                src={asset('images/gallery-1.jpg')}
                alt="A baker working dough by hand"
                style={{
                  width: '100%',
                  borderRadius: 'var(--bb-radius-lg)',
                  boxShadow: 'var(--bb-shadow-lg)',
                }}
                loading="lazy"
              />
            </Reveal>
          </div>

          <div className="col-12 col-lg-6">
            <Reveal>
              <p style={{ lineHeight: 1.8, opacity: 0.85 }}>{about.story}</p>
              <p style={{ lineHeight: 1.8, opacity: 0.85 }}>{about.promise}</p>

              <div className="bb-stats">
                {about.stats.map((s) => (
                  <div
                    className="bb-stat"
                    key={s.label}
                    style={{
                      background: 'rgba(255,247,236,0.06)',
                      borderColor: 'rgba(243,226,208,0.16)',
                    }}
                  >
                    <div className="bb-stat__v">{s.value}</div>
                    <div className="bb-stat__l" style={{ color: 'rgba(243,226,208,0.65)' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="row g-4 mt-4">
          {about.values.map((v, i) => (
            <div className="col-12 col-md-6" key={v.title}>
              <Reveal className="bb-value">
                <span className="bb-value__n">0{i + 1}</span>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
