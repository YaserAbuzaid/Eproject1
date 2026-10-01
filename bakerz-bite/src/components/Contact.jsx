import { Reveal, SectionHead } from './ui.jsx';

/**
 * Spec: Contact Us must display the email id, address and contact number.
 * Opening hours and a site map sit alongside them.
 */
export default function Contact({ site }) {
  const { contact, hours, sitemap, social } = site;

  return (
    <section className="bb-section bb-section--tint" id="contact">
      <div className="container">
        <SectionHead eyebrow="Come and see us" title="Contact Us">
          Call, email or simply walk in. The ovens are on from four in the
          morning and the door opens at seven.
        </SectionHead>

        <div className="row g-5">
          <div className="col-12 col-lg-5">
            <Reveal>
              <div className="bb-contact">
                <span className="bb-contact__icon" aria-hidden="true">
                  ✉
                </span>
                <div>
                  <div className="bb-contact__k">Email</div>
                  <div className="bb-contact__v">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    <br />
                    <a href={`mailto:${contact.ordersEmail}`}>{contact.ordersEmail}</a>
                  </div>
                </div>
              </div>

              <div className="bb-contact">
                <span className="bb-contact__icon" aria-hidden="true">
                  ☎
                </span>
                <div>
                  <div className="bb-contact__k">Phone</div>
                  <div className="bb-contact__v">
                    <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>
                      {contact.phone}
                    </a>
                    <br />
                    <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>
                      WhatsApp {contact.whatsapp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bb-contact">
                <span className="bb-contact__icon" aria-hidden="true">
                  ⌂
                </span>
                <div>
                  <div className="bb-contact__k">Address</div>
                  <div className="bb-contact__v">
                    {contact.addressLines.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bb-contact" style={{ borderBottom: 0 }}>
                <span className="bb-contact__icon" aria-hidden="true">
                  ◴
                </span>
                <div style={{ flex: 1 }}>
                  <div className="bb-contact__k">Opening hours</div>
                  <table className="bb-hours">
                    <tbody>
                      {hours.map((h) => (
                        <tr key={h.days}>
                          <td>{h.days}</td>
                          <td>
                            {h.open} – {h.close}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--bb-muted)',
                  marginTop: 18,
                  fontStyle: 'italic',
                }}
              >
                {contact.note}
              </p>
            </Reveal>
          </div>

          <div className="col-12 col-lg-7" id="sitemap">
            <Reveal>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Site Map</h3>
              <p style={{ color: 'var(--bb-muted)', fontSize: '0.92rem', marginBottom: 26 }}>
                Everything on this single page, in one list.
              </p>

              <div className="bb-sitemap">
                {sitemap.map((group) => (
                  <div key={group.group}>
                    <h4>{group.group}</h4>
                    <ul>
                      {group.links.map((l) => (
                        <li key={`${group.group}-${l.label}`}>
                          <a href={l.href}>{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <h4>Follow</h4>
                  <ul>
                    {social.map((s) => (
                      <li key={s.label}>
                        <a href={s.href}>
                          {s.label} <span style={{ opacity: 0.6 }}>{s.handle}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
