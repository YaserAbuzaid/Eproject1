import { useState } from 'react';
import { Reveal, SectionHead } from './ui.jsx';

/** Spec: an FAQ section, here as a single-open accordion. */
export default function Faq({ faq }) {
  const [openId, setOpenId] = useState(faq[0]?.id ?? null);

  return (
    <section className="bb-section" id="faq">
      <div className="container">
        <SectionHead eyebrow="Good to know" title="Frequently Asked Questions">
          The things people ask us most often at the counter.
        </SectionHead>

        <Reveal className="bb-faq">
          {faq.map((item) => {
            const open = openId === item.id;
            return (
              <div className={`bb-faq__item${open ? ' is-open' : ''}`} key={item.id}>
                <h3 className="m-0">
                  <button
                    type="button"
                    className="bb-faq__q"
                    aria-expanded={open}
                    aria-controls={`panel-${item.id}`}
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span>{item.q}</span>
                    <span className="bb-faq__sign" aria-hidden="true">
                      +
                    </span>
                  </button>
                </h3>
                <div className="bb-faq__a" id={`panel-${item.id}`} role="region">
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
