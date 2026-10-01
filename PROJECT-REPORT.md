# Bakerz Bite — Project Report

**eProject title:** Bakerz Bite — Bakery & Café Single Page Application
**Technology:** HTML5, CSS3, Bootstrap 5, JavaScript (ES2022), React 19, Vite
**Data store:** JSON files (no database)

---

## 1. Problem Definition

Bakerz Bite is a bakery and café chain specialising in baked goods made from
carefully selected ingredients. It offers more than 300 varieties of artisan
pastries, gourmet cakes and desserts, and handcrafted beverages, all baked
fresh in store every day. Its motto is *"Where smiles are served daily."*

The business needs a **single-page, responsive website** that presents its full
range to customers, lets them explore products in detail before visiting the
shop, shows the offers currently running, and collects feedback. The site must
work in all leading browsers and look equally good on a phone, a tablet and a
desktop.

### 1.1 Objectives

1. Present the product range in browsable, filterable sections.
2. Give every product a detail view listing its full ingredients and
   specification, so a customer can check allergens before buying.
3. Promote the branded merchandise range alongside the food.
4. Advertise current in-store offers with their full terms.
5. Collect customer feedback and star ratings.
6. Publish the bakery's contact details, opening hours and location.
7. Do all of the above in one page, with no reloads and no backend.

### 1.2 Scope

**In scope:** the public-facing marketing and catalogue site — browsing,
filtering, product detail, gallery, offers, feedback, contact.

**Out of scope:** online ordering, payment, user accounts, stock management and
any server-side component. The eProject specification fixes the data store as
JSON or TXT files, which rules out a persistent multi-user backend.

---

## 2. Hardware and Software Requirements

### Hardware
- Intel Core i3 / i5 processor or higher
- 8 GB RAM or above
- Colour SVGA display
- 500 GB hard disk space
- Keyboard and mouse

### Software
- **Operating system:** Windows 10 or 11
- **Runtime:** Node.js 20 or newer (developed on Node 22.23.3, npm 10.9.9)
- **Browsers:** Microsoft Edge, Google Chrome, Mozilla Firefox, Safari
- **Editor:** any; Visual Studio Code recommended

### Libraries used

| Library        | Version | Why |
| -------------- | ------- | --- |
| react / react-dom | 19.2 | Component model and rendering |
| vite           | 8.3     | Dev server and production bundler |
| bootstrap      | 5.3     | Responsive grid and utility classes |
| react-bootstrap| 2.10    | Accessible modal component |
| oxlint         | 1.81    | Linting |

---

## 3. Design Specifications

### 3.1 Architecture

The site is a client-side single-page application. There is no server-side
logic. React renders every section into one page; the JSON data store is
fetched once on load and held in memory.

```
┌──────────────────────────────────────────────────────────┐
│                        BROWSER                            │
│                                                           │
│   ┌───────────────────────────────────────────────────┐  │
│   │                    App.jsx                         │  │
│   │     (composition root, owns open-modal state)      │  │
│   └───────────────────────────────────────────────────┘  │
│        │                  │                    │          │
│   ┌────▼─────┐   ┌────────▼────────┐   ┌───────▼──────┐  │
│   │ Navbar   │   │  Section        │   │ ProductModal │  │
│   │ Hero     │   │  components     │   │              │  │
│   │ Ticker   │   │  (Menu, Offers, │   └──────────────┘  │
│   │ Footer   │   │   Gallery, …)   │                     │
│   └────┬─────┘   └────────┬────────┘                     │
│        │                  │                               │
│   ┌────▼──────────────────▼────────┐  ┌───────────────┐  │
│   │   hooks/useSiteFeatures.js     │  │ data/catalog  │  │
│   │  visitor count · clock ·       │  │     .js       │  │
│   │  geolocation · scroll spy ·    │  │  (fetch JSON) │  │
│   │  reveal · localStorage         │  └───────┬───────┘  │
│   └────────────┬───────────────────┘          │          │
│                │                               │          │
│        ┌───────▼────────┐          ┌───────────▼───────┐ │
│        │  localStorage  │          │ public/data/*.json │ │
│        │ visits·reviews │          │  (the data store)  │ │
│        └────────────────┘          └────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Colour scheme

A single palette is declared once as CSS custom properties in
`src/styles/theme.css`, and every colour on the site refers to it. This is what
keeps the colour combination uniform throughout, as the specification requires.

| Token | Hex | Used for |
| ----- | --- | -------- |
| `--bb-espresso` | `#21130a` | Dark section backgrounds, footer |
| `--bb-cocoa`    | `#3b2416` | Headings, logo, ticker |
| `--bb-bark`     | `#5a3b25` | Body links, secondary text |
| `--bb-caramel`  | `#c07a33` | Primary actions, active nav, accents |
| `--bb-honey`    | `#e8a94b` | Highlights, stars, hover states |
| `--bb-blush`    | `#f3e2d0` | Soft fills, ingredient chips |
| `--bb-cream`    | `#fff7ec` | Page background |
| `--bb-paper`    | `#fffdf9` | Card surfaces |
| `--bb-sage`     | `#6f8a5f` | "New" badge, dietary tags |
| `--bb-berry`    | `#a32e52` | "Bestseller" badge, offer ribbons, errors |

### 3.3 Typography

- **Headings:** Playfair Display, falling back to Georgia then Times New Roman.
- **Body:** Inter, falling back to Segoe UI then the system sans-serif.

Webfonts load from Google Fonts as a progressive enhancement. If the network is
unavailable the fallbacks take over and the layout is unaffected.

### 3.4 Responsive breakpoints

| Width | Behaviour |
| ----- | --------- |
| ≥ 992 px | Full horizontal navigation, 4-column product grid, 4-column gallery, two-column modal |
| 641 – 991 px | Hamburger drawer navigation, 2–3 column grid, stacked modal and feedback |
| ≤ 640 px | 2-column product grid, 2-column gallery, single-column footer, visitor badge collapses to the number only |

### 3.5 Data design

All six files live in `public/data/`.

**products.json**
```
{
  currency: string,
  products: [{
    id, name, category, unit, image         : string
    price, rating, reviews                   : number
    shortDescription, description            : string
    ingredients, allergens, dietary, badges  : string[]
    specifications                           : { [label]: value }
  }]
}
```

**merchandise.json** — identical item shape to `products`, so one card
component and one modal component serve both sections.

**offers.json**
```
{ offers: [{ id, title, headline, description, discountLabel,
             badge, image, terms: string[],
             validFrom, validTill : "YYYY-MM-DD" }] }
```

**site.json** — `brand`, `motto`, `tagline`, `about{intro, story, promise,
values[], stats[]}`, `contact{email, ordersEmail, phone, whatsapp,
addressLines[]}`, `hours[]`, `social[]`, `sitemap[]`.

**gallery.json** — `[{ id, image, caption, tag }]`
**faq.json** — `[{ id, q, a }]`

---

## 4. Diagrams

### 4.1 Site structure

```
                        Bakerz Bite (one page)
                                 │
   ┌──────┬──────────┬───────────┼──────────┬─────────┬────────┬─────────┐
   │      │          │           │          │         │        │         │
 Home   Menu   Merchandise    Offers    Gallery   Feedback   About   Contact
   │      │          │           │          │         │        │        │
 banner  filters   category    offer     masonry    form    story    email
 motto   6 cats    filter      cards     + light-   stars   values   phone
 CTAs    29 items  6 items     + terms   box        reviews stats    address
   │      │          │                     │                         hours
   └──────┴── click ─┴─► PRODUCT POP-UP    └─► LIGHTBOX              FAQ
              image · description ·                                  site map
              ingredients · specification ·
              allergens · rating
```

### 4.2 Data Flow Diagram — Level 0 (context)

```
   ┌──────────┐   browses, filters, clicks    ┌─────────────────┐
   │          │ ─────────────────────────────►│                 │
   │ VISITOR  │                                │   BAKERZ BITE   │
   │          │◄───────────────────────────── │     WEBSITE     │
   └──────────┘   products, offers, gallery    └────────┬────────┘
        │                                               │
        │ submits feedback + rating                     │ reads
        └──────────────────────────────────────────►    ▼
                                              ┌─────────────────────┐
   ┌─────────────────┐   coordinates          │  JSON DATA STORE    │
   │ GEOLOCATION API │◄──────────────────────┤  public/data/*.json │
   │   (browser)     │ ─────────────────────►└─────────────────────┘
   └─────────────────┘   latitude, longitude
```

### 4.3 Data Flow Diagram — Level 1

```
 VISITOR
    │
    │ (1) open page
    ▼
 ┌──────────────────┐   fetch 6 files   ┌─────────────────────┐
 │ 1.0 LOAD         │◄─────────────────►│ D1  JSON data store │
 │     CATALOGUE    │                   └─────────────────────┘
 └────────┬─────────┘
          │ catalogue in memory
          ▼
 ┌──────────────────┐                   ┌─────────────────────┐
 │ 2.0 RENDER       │                   │ D2  localStorage    │
 │     SECTIONS     │                   │  visits · reviews   │
 └────────┬─────────┘                   └──────────┬──────────┘
          │                                   ▲    │
          │ (2) filter criteria               │    │ read reviews
          ▼                                   │    ▼
 ┌──────────────────┐                  write  │  ┌──────────────────┐
 │ 3.0 FILTER &     │                  visit  │  │ 5.0 FEEDBACK     │
 │     SORT ITEMS   │                  count  └──┤     & RATING     │
 └────────┬─────────┘                            └────────┬─────────┘
          │ matching items                                │ validated review
          ▼                                               ▼
 ┌──────────────────┐                            ┌─────────────────────┐
 │ 4.0 SHOW PRODUCT │                            │ D2  localStorage    │
 │     POP-UP       │                            └─────────────────────┘
 └──────────────────┘
          ▲
          │ (3) click an item
       VISITOR

 ┌──────────────────┐   position   ┌─────────────────┐
 │ 6.0 TICKER       │◄─────────────┤ GEOLOCATION API │
 │  date·time·place │              └─────────────────┘
 └──────────────────┘
```

### 4.4 Flowchart — filtering the menu and opening a product

```
            ┌───────┐
            │ START │
            └───┬───┘
                ▼
     ┌────────────────────┐
     │ Load products.json │
     └─────────┬──────────┘
               ▼
     ┌────────────────────┐
     │ Show all 29 items  │
     └─────────┬──────────┘
               ▼
        ╔══════════════╗
        ║ Visitor acts ║
        ╚══════╤═══════╝
               │
     ┌─────────┴──────────┐
     │                    │
 changes a filter    clicks an item
     │                    │
     ▼                    ▼
┌──────────────────┐  ┌──────────────────────┐
│ Apply in order:  │  │ Open modal for that  │
│  • search text   │  │ product              │
│  • category      │  └──────────┬───────────┘
│  • price ceiling │             ▼
│  • dietary tags  │  ┌──────────────────────┐
│    (ALL must     │  │ Show image, price,   │
│     match)       │  │ rating, description, │
└────────┬─────────┘  │ ingredients, spec,   │
         ▼            │ allergen warning     │
   ┌───────────┐      └──────────┬───────────┘
   │ Any items │                 ▼
   │ matched?  │          ╔═════════════╗
   └─┬───────┬─┘          ║ Close modal ║
  No │       │ Yes        ╚══════╤══════╝
     ▼       ▼                   │
┌─────────┐ ┌──────────────┐     │
│ Show    │ │ Sort by the  │     │
│ empty   │ │ chosen order │     │
│ state + │ └──────┬───────┘     │
│ Reset   │        ▼             │
└────┬────┘ ┌──────────────┐     │
     │      │ Render grid  │     │
     │      │ + show count │     │
     │      └──────┬───────┘     │
     └─────────────┴─────────────┘
                   ▼
            ╔══════════════╗
            ║ Visitor acts ║  (loop)
            ╚══════════════╝
```

### 4.5 Flowchart — submitting feedback

```
      ┌───────┐
      │ START │
      └───┬───┘
          ▼
 ┌──────────────────────┐
 │ Visitor fills name,  │
 │ stars and review     │
 └──────────┬───────────┘
            ▼
 ┌──────────────────────┐
 │ Press Submit         │
 └──────────┬───────────┘
            ▼
     ┌──────────────┐    No     ┌─────────────────────────┐
     │ Name given?  ├──────────►│ "Please tell us your    │
     └──────┬───────┘           │  name."                 │
            │ Yes               └───────────┬─────────────┘
            ▼                               │
     ┌──────────────┐    No     ┌───────────▼─────────────┐
     │ Rating 1–5?  ├──────────►│ "Please pick a star     │
     └──────┬───────┘           │  rating."               │
            │ Yes               └───────────┬─────────────┘
            ▼                               │
     ┌──────────────┐    No     ┌───────────▼─────────────┐
     │ Review ≥ 10  ├──────────►│ "A little more detail   │
     │ characters?  │           │  please…"               │
     └──────┬───────┘           └───────────┬─────────────┘
            │ Yes                           │
            ▼                               ▼
 ┌──────────────────────┐          ┌────────────────────┐
 │ Save review to       │          │ Show errors,       │
 │ localStorage with    │          │ keep what was typed│
 │ an ISO timestamp     │          └─────────┬──────────┘
 └──────────┬───────────┘                    │
            ▼                                │
 ┌──────────────────────┐                    │
 │ Prepend to the list, │                    │
 │ recompute average,   │                    │
 │ clear form, show     │                    │
 │ thank-you message    │                    │
 └──────────┬───────────┘                    │
            ▼                                ▼
         ┌──────┐                      ┌───────────┐
         │ END  │                      │ Try again │
         └──────┘                      └───────────┘
```

### 4.6 Flowchart — the geolocation ticker

```
          ┌───────┐
          │ START │
          └───┬───┘
              ▼
  ┌──────────────────────────┐   No   ┌───────────────────────────┐
  │ navigator.geolocation    ├───────►│ "Location not supported   │
  │ available?               │        │  by this browser"         │
  └───────────┬──────────────┘        └───────────────────────────┘
              │ Yes
              ▼
  ┌──────────────────────────┐
  │ Request current position │
  └───────────┬──────────────┘
              │
     ┌────────┴────────┐
  Granted           Refused / error
     │                 │
     ▼                 ▼
┌──────────────┐  ┌────────────────────────┐
│ Show         │  │ "Location access       │
│ coordinates  │  │  blocked" /            │
│ immediately  │  │ "Location unavailable" │
└──────┬───────┘  └────────────────────────┘
       ▼
┌──────────────────────┐
│ Reverse-geocode the  │
│ coordinates          │
└──────┬───────────────┘
       │
  ┌────┴─────┐
Success    Failure
  │           │
  ▼           ▼
┌──────────┐ ┌─────────────────────┐
│ Show     │ │ Keep the coordinates│
│ place    │ │ already on screen   │
│ name     │ └─────────────────────┘
└────┬─────┘
     ▼
┌───────────────────────────────────────┐
│ Scroll date + time + location across  │
│ the bottom, clock ticking every second│
└───────────────────────────────────────┘
```

---

## 5. Module Descriptions

| Module | File | Responsibility |
| ------ | ---- | -------------- |
| Catalogue loader | `src/data/catalog.js` | Fetches all six JSON files in parallel, normalises them into one object, exposes `asset()` for base-path-safe URLs and helpers for categories, dietary tags and price formatting. |
| Site features | `src/hooks/useSiteFeatures.js` | `useStoredState` (safe localStorage), `useVisitorCount`, `useClock`, `useGeoLocation`, `useScrollSpy`, `useScrolledPast`, `useReveal`, `useScrollTo`. |
| Navigation | `src/components/Navbar.jsx` | Fixed bar, hover and active colour changes, mobile drawer, visitor badge beside the logo. |
| Banner | `src/components/Hero.jsx` | Rotating banner of three product photographs with manual dot controls. |
| Menu | `src/components/Menu.jsx` | Product grid with search, category, dietary, price and sort filters, live result count and an empty state. |
| Merchandise | `src/components/Merchandise.jsx` | Branded merchandise with a category filter, reusing the product card and modal. |
| Product pop-up | `src/components/ProductModal.jsx` | The detail window: image, price, rating, description, dietary tags, ingredients, specification table and allergen notice. |
| Offers | `src/components/Offers.jsx` | Offer cards with ribbon, badge, full terms and validity dates. |
| Gallery | `src/components/Gallery.jsx` | Masonry gallery with tag filter and a keyboard-navigable lightbox. |
| Feedback | `src/components/Feedback.jsx` | Validated feedback form, 5-star rating, running average, review list persisted per browser. |
| About / FAQ / Contact | `About.jsx`, `Faq.jsx`, `Contact.jsx` | Brand story and statistics; accordion FAQ; contact details, opening hours and the site map. |
| Ticker | `src/components/Ticker.jsx` | The continuously scrolling strip carrying live date, time and geolocated place. |
| Shared UI | `src/components/ui.jsx` | `Reveal`, `SectionHead`, `Stars`, `Badges`, `ProductCard`. |

---

## 6. Test Data and Test Cases

### 6.1 Test data used

| Data set | Volume | Notes |
| -------- | ------ | ----- |
| Products | 29 items | 6 Cakes, 6 Pastries, 6 Cookies, 5 Pies, 3 Breads, 3 Beverages |
| Price range | $1.95 – $30.00 | Exercises the price slider at both ends |
| Dietary tags | vegetarian, vegan, eggless, gluten-free | Several items carry more than one |
| Merchandise | 6 items | Mugs, Bags, Glasses, Trays, Aprons, Gifting |
| Offers | 6 offers | All dated 2026-01-01 to 2026-12-31 |
| Gallery | 15 images | 7 distinct tags |
| FAQ | 12 question-and-answer pairs | |
| Seeded reviews | 3 reviews, ratings 5, 5, 4 | Average 4.7 before any visitor input |

### 6.2 Test cases executed

| # | Test case | Input | Expected | Result |
| - | --------- | ----- | -------- | ------ |
| 1 | Page loads and renders all sections | Open `/` | Hero, menu, merchandise, offers, gallery, feedback, about, FAQ, contact, footer, ticker | **Pass** |
| 2 | All images resolve | Open `/` | 57 images, none broken | **Pass** — 57 loaded, 0 broken |
| 3 | Product count | Open `/` | 29 products + 6 merchandise = 35 cards | **Pass** — 35 cards |
| 4 | Product pop-up opens | Click Chocolate Truffle Cake | Modal with image, $28.00, rating, description, 10 ingredients, specification, allergens | **Pass** |
| 5 | Category filter | Select "Pies" | Only the 5 pies shown, count updates | **Pass** |
| 6 | Dietary filter is cumulative | Select Vegan + Eggless | Only items carrying both tags | **Pass** |
| 7 | Price filter | Drag slider to $5 | Only items at or below $5.00 | **Pass** |
| 8 | Search | Type "almond" | Matches name, description and ingredient text | **Pass** |
| 9 | No results | Impossible filter combination | Empty state with a Reset button | **Pass** |
| 10 | Reset filters | Press "Clear all filters" | All 29 items return, controls reset | **Pass** |
| 11 | Feedback validation | Submit with everything blank | Three field errors, nothing saved | **Pass** |
| 12 | Feedback submission | "Test Reviewer", 4 stars, 62-character review | Review added, count 3 → 4, average 4.7 → 4.5, thank-you shown, persisted to localStorage | **Pass** |
| 13 | Visitor counter | Open the site | Badge beside the logo shows a running count, +1 per session | **Pass** — 12,481 |
| 14 | Ticker | Observe the bottom strip | Date, live clock and location scroll continuously | **Pass** |
| 15 | Geolocation refused | Deny the permission prompt | Ticker reads "Location unavailable", nothing breaks | **Pass** |
| 16 | Active menu colour | Scroll to Contact | "Contact Us" is highlighted; returns to "Home" at the top | **Pass** |
| 17 | Active state with modal open | Open a pop-up at the top of the page | Navigation still shows "Home" | **Pass** (regression found and fixed) |
| 18 | Gallery lightbox | Click a gallery image | Opens full size; arrow keys browse; Esc closes | **Pass** |
| 19 | Responsive — mobile | 390 × 844 | Hamburger menu, 2-column grid, no horizontal scrolling | **Pass** |
| 20 | Production build | `npm run build` | Builds with no errors | **Pass** — 108 modules, 540 ms |

---

## 7. Installation Instructions

1. Install **Node.js 20 or newer** from <https://nodejs.org>.
2. Unzip the project and open a terminal in the `bakerz-bite` folder.
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the site:
   ```
   npm run dev
   ```
5. Open the printed address, normally <http://localhost:5173>.
6. When the browser asks for location permission, allow it to see the ticker's
   geolocation feature. Refusing is also fine — the ticker falls back cleanly.

To produce a deployable copy instead, run `npm run build` and serve the
resulting `dist/` folder from any web server. `npm run preview` does this
locally.

**There are no login credentials and no database.** The site is entirely public
and reads its data from JSON files.

---

## 8. Assumptions

1. **Bakerz Bite is fictional.** The brand, the address *42 Flourmill Lane,
   Springfield*, the email addresses and the `+1 (555)` telephone numbers are
   invented sample data. `555` is the standard reserved range for fictional
   numbers.
2. **Prices are in US dollars**, held as a single `currency` field in
   `products.json` so the whole site can be switched by editing one value.
3. **No ordering or payment.** The specification asks for a catalogue site, so
   there is no basket, no checkout and no account system.
4. **Feedback is per-browser.** With a JSON-file data store there is no way to
   write to the server, so submitted reviews are kept in `localStorage`. They
   persist for that visitor on that browser but are not shared between
   visitors. Three seeded reviews ship with the site so the section is never
   empty.
5. **The visitor counter is per-browser** for the same reason. It starts from a
   realistic seed value and increments once per browser session rather than per
   page refresh.
6. **Reverse geocoding uses a free third-party endpoint** (BigDataCloud, no API
   key required). If it is unreachable the ticker shows raw coordinates.
7. **Webfonts are optional.** If Google Fonts cannot be reached the site falls
   back to Georgia and Segoe UI with no layout change.
8. **Photographs are Creative Commons images from Wikimedia Commons**, credited
   in `public/images/credits.json`. They stand in for professional photography
   the real bakery would commission. Merchandise images are original SVG
   mockups drawn for this project, because branded merchandise cannot be
   represented by stock photography.
9. **The site must be served over HTTP, not opened from the file system,**
   because `fetch()` is blocked on `file://` URLs.
10. **Ratings and review counts shown on product cards are sample data** and do
    not change when a visitor submits feedback; the feedback section keeps its
    own independent list.

---

## 9. Possible Enhancements

- Replace the JSON files with a real API so feedback and the visitor count are
  shared across all visitors.
- Add an online ordering basket with delivery slot selection.
- Add a store locator using the geolocation data already collected, showing the
  nearest branch rather than just the visitor's own position.
- Multilingual support.
- Swap the Creative Commons photography for commissioned product shots.
