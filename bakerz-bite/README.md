# Bakerz Bite — Bakery & Café

A single-page, responsive website for the fictional bakery chain **Bakerz Bite**,
built as an Aptech eProject.

> *Where smiles are served daily.*

---

## Running the project

You need **Node.js 20 or newer** (built and tested on Node 22).

```bash
cd bakerz-bite
npm install
npm run dev
```

Then open the address Vite prints, normally <http://localhost:5173>.

### Other commands

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the development server with hot reload         |
| `npm run build`   | Produce an optimised build in `dist/`                |
| `npm run preview` | Serve the contents of `dist/` locally to check it    |
| `npm run lint`    | Run Oxlint over the source                           |

### Important: it must be served over HTTP

This is a Vite + React application and it loads its data with `fetch()`.
Opening `index.html` directly from the file system (`file://`) **will not work**,
because browsers block `fetch()` on `file://` URLs. Always use `npm run dev`, or
`npm run build` followed by `npm run preview`, or copy `dist/` onto any web
server.

---

## How it is put together

```
bakerz-bite/
├── index.html                  page shell, title, meta, webfont links
├── public/
│   ├── data/                   the data store — plain JSON, no database
│   │   ├── site.json           brand, about copy, contact details, site map
│   │   ├── products.json       29 edible products
│   │   ├── merchandise.json    6 branded merchandise items
│   │   ├── offers.json         6 in-store offers
│   │   ├── gallery.json        gallery images and captions
│   │   └── faq.json            12 questions and answers
│   └── images/                 photography + branded SVG mockups
│       └── credits.json        source and licence for every photograph
└── src/
    ├── main.jsx                entry point, loads Bootstrap then the theme
    ├── App.jsx                 composes every section, owns the modal state
    ├── styles/theme.css        the entire visual theme in one file
    ├── data/catalog.js         loads the JSON files, price/category helpers
    ├── hooks/useSiteFeatures.js  visitor count, clock, geolocation, scroll spy
    └── components/
        ├── Logo.jsx            the wheat-and-cupcake mark, inline SVG
        ├── Navbar.jsx          fixed nav, active states, visitor badge
        ├── Hero.jsx            rotating banner
        ├── Menu.jsx            product grid plus all the filters
        ├── Merchandise.jsx     branded merchandise grid
        ├── ProductModal.jsx    the product pop-up
        ├── Offers.jsx          offer cards
        ├── Gallery.jsx         masonry gallery with lightbox
        ├── Feedback.jsx        feedback form and star rating
        ├── About.jsx           brand story and values
        ├── Faq.jsx             accordion
        ├── Contact.jsx         contact details, hours, site map
        ├── Footer.jsx          footer navigation
        ├── Ticker.jsx          scrolling date / time / location strip
        └── ui.jsx              shared pieces: cards, stars, badges, reveals
```

### Where the data lives

Everything shown on the page is read from the JSON files in `public/data` at
runtime. There is no database and no backend. To change a price, add a cake or
reword the FAQ, edit the JSON and refresh — no code change is needed.

Two things are stored in the browser rather than in a file, because they are
per-visitor:

- **Visitor count** — `localStorage`, incremented once per browser session.
- **Submitted reviews** — `localStorage`, so your own reviews survive a refresh.

---

## Requirements checklist

Every numbered item from the eProject specification, and where it is implemented.

| # | Requirement | Where |
| - | ----------- | ----- |
| 1 | Logo and banner with images of cakes, pastries, cookies | `Logo.jsx`, `Hero.jsx` |
| 2 | Sections for Cakes, Pastries, Cookies, Pies with several items | `Menu.jsx` + `products.json` (29 items over 6 categories) |
| 3 | Clicking an item opens a pop-up with image, description, ingredients | `ProductModal.jsx` |
| 4 | Merchandise section with branded mugs, bags, glasses, trays | `Merchandise.jsx` + `merchandise.json` |
| 5 | Filters to help users select products | `Menu.jsx` — search, category, dietary, price, sort |
| 6 | Gallery for viewing images | `Gallery.jsx` — masonry grid with lightbox |
| 7 | Feedback and rating entered by the viewer | `Feedback.jsx` — validated form, 5-star rating |
| 8 | Site map, Gallery, About Us, FAQ, Contact Us links | `Navbar.jsx`, `Contact.jsx`, `Footer.jsx` |
| 9 | About Us / Contact Us showing email, address, phone | `About.jsx`, `Contact.jsx` |
| 10 | Section listing offers with details | `Offers.jsx` + `offers.json` |
| 11 | Uniform colour combination throughout | `theme.css` — one palette, all colours are CSS variables |
| 12 | Smooth navigation | Smooth scrolling, scroll-spy, fade-in reveals |
| ✦ | Scrolling ticker at the bottom with date, time and location | `Ticker.jsx` + `useGeoLocation` (HTML5 Geolocation) |
| ✦ | Visitor count at top right beside the logo | `Navbar.jsx` + `useVisitorCount` |
| ✦ | Menu options change colour on hover and after clicking | `.bb-nav__link` in `theme.css` |
| ✦ | Fade in / fade out effects | `.bb-reveal` + `useReveal` |

---

## Notes on the geolocation ticker

The ticker uses the browser's HTML5 Geolocation API. The browser will ask for
permission the first time the page loads. The ticker degrades in stages and
never breaks:

1. Permission granted and the lookup succeeds → a place name, e.g. *Chennai, Tamil Nadu, India*.
2. Permission granted but the lookup fails (offline) → coordinates, e.g. *13.08°, 80.27°*.
3. Permission refused → *Location access blocked*.
4. Browser has no geolocation support → *Location not supported by this browser*.

Turning coordinates into a place name uses the free, keyless BigDataCloud
reverse-geocoding endpoint. If you would rather the page made no third-party
request at all, delete the `fetch` block inside `useGeoLocation` in
`src/hooks/useSiteFeatures.js` and the ticker will simply show coordinates.

---

## Image credits

Photographs come from **Wikimedia Commons** and are used under their respective
Creative Commons licences. `public/images/credits.json` records the author,
licence and source page for every photograph.

The six merchandise images are **not** photographs. They are SVG mockups drawn
for this project in the site's own palette, because the merchandise is supposed
to carry Bakerz Bite branding, which no stock photograph can show. They are
generated to be consistent with each other and are entirely original.

---

## Browser support

Tested in Chromium. Uses only widely supported platform features: CSS Grid,
flexbox, custom properties, `IntersectionObserver`, `localStorage` and the
Geolocation API. It respects `prefers-reduced-motion`, and the layout is built
mobile-first with breakpoints at 991 px and 640 px.
