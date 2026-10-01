import Logo from './Logo.jsx';
import { useScrollTo } from '../hooks/useSiteFeatures.js';

// Read once at module load: the copyright year cannot change mid-session, and
// calling Date() during render makes the component impure.
const YEAR = new Date().getFullYear();

export default function Footer({ site }) {
  const scrollTo = useScrollTo();

  return (
    <footer className="bb-footer">
      <div className="container">
        <div className="bb-footer__grid">
          <div>
            <div className="bb-logo mb-3">
              <Logo />
              <span className="bb-logo__text">
                <span className="bb-logo__name" style={{ color: 'var(--bb-cream)' }}>
                  Bakerz Bite
                </span>
                <span className="bb-logo__tag">Bakery &amp; Café</span>
              </span>
            </div>
            <p style={{ fontSize: '0.89rem', lineHeight: 1.7, maxWidth: 320 }}>
              {site.motto} Baked in-store every morning with real butter, fresh
              cream and unbleached flour.
            </p>
          </div>

          {site.sitemap.map((group) => (
            <div key={group.group}>
              <h4>{group.group}</h4>
              <ul>
                {group.links.map((l) => (
                  <li key={`${group.group}-${l.label}`}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(l.href.replace('#', ''));
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bb-footer__bottom">
          <span>
            © {YEAR} Bakerz Bite. A fictional bakery built as an Aptech eProject.
          </span>
          <span>
            {site.contact.email} · {site.contact.phone}
          </span>
        </div>
      </div>
    </footer>
  );
}
