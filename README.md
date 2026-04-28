# IKnowAPlace — Landing Site

Marketing and deep-link site for the [I know a place](https://iknowaplace.app) iOS app.  
Built with Jekyll, deployed to GitHub Pages.

---

## Local development

**Prerequisites:** Ruby, Bundler (`gem install bundler`)

```bash
bundle install

# Development server with live reload (uses _config.local.yml overrides)
bundle exec jekyll serve --livereload --config _config.yml,_config.local.yml

# Production build
bundle exec jekyll build
```

The dev server starts at `http://127.0.0.1:4000`. Built output goes to `_site/`.

`_config.local.yml` overrides `api_base_url` to `http://localhost:8080` so the
`/app/location` page hits a local API server instead of production.

---

## Deployment

The site is deployed to GitHub Pages via **GitHub Actions** ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).
This is required because the site uses a custom Jekyll plugin (`_plugins/fetch_locations.rb`)
which GitHub Pages' built-in Jekyll does not support.

The workflow runs on:
- Every push to `main`
- A daily schedule at 02:00 UTC (picks up any location data changes)
- A `repository_dispatch` webhook event of type `location-updated`

### One-time setup

In the GitHub repo **Settings → Pages**, set **Source** to **GitHub Actions**
(not the default "Deploy from a branch").

### Triggering a rebuild from the backend

When a location is created or updated, the backend should POST to the GitHub
API to trigger an immediate rebuild:

```
POST https://api.github.com/repos/know-a-place/know-a-place.github.io/dispatches
Authorization: Bearer <GITHUB_PAT>
Content-Type: application/json

{ "event_type": "location-updated" }
```

The PAT needs `repo` scope (or `actions: write` on a fine-grained token).

---

## How pages are generated

The site is a standard Jekyll static site. Each page is a Markdown (`.md`) file
with YAML front matter at the root:

```
index.md, privacy.md, terms.md, contact.md, owners/owners.md, …
```

Pages that use `layout: default` are wrapped by [_layouts/default.html](_layouts/default.html),
which injects the shared `<head>`, [header](_includes/header.html), and
[footer](_includes/footer.html) via Liquid includes.

Per-page CSS is declared in front matter and loaded dynamically by the layout:

```yaml
# index.md
css: assets/css/landing.css, assets/css/carousel.css
```

Global site variables (`title`, `url`, `api_base_url`, `app_store_url`, etc.) live
in [_config.yml](_config.yml) and are available in templates as `{{ site.<key> }}`.

The landing-page carousel is data-driven: slide content comes from
[_data/carousel.yml](_data/carousel.yml) and is iterated with `{% for item in site.data.carousel %}`.

Jekyll plugins used: `jekyll-feed`, `jekyll-sitemap`, `jekyll-seo-tag`, plus the
custom `_plugins/fetch_locations.rb` (see below).

### Location pages (`/app/location/[slug]`)

[`_plugins/fetch_locations.rb`](_plugins/fetch_locations.rb) runs at build time,
calls `GET /api/v1/locations/webapp` on the production API, and generates a static
HTML page for every location at `/app/location/[slug]/`.

Each generated page uses [`_layouts/location.html`](_layouts/location.html), which
provides full SEO metadata (unique title, description, Open Graph tags, Twitter
Card, and `CafeOrCoffeeShop` JSON-LD structured data), then mounts the same React
app as `app.md` for interactive functionality.

If the API is unreachable at build time the plugin logs a warning and skips page
generation — the build completes and the rest of the site is unaffected.

**Fallback for slugs not yet built:** [404.html](404.html) catches any unmatched
`/app/location/[slug]` path and redirects the browser to `/app/location?slug=[slug]`,
which the React SPA handles via query parameter. This means a location added
minutes before the next rebuild still works — it just skips the pre-rendered SEO
page until the next build.

---

## How assets are served

All files under `assets/` are copied as-is into `_site/` by Jekyll — no bundler,
no compilation step.

| Path | Contents |
|---|---|
| `assets/css/` | Plain CSS files, one per page/component |
| `assets/js/site.js` | Vanilla JS for the marketing site (mobile nav, carousel autoplay) |
| `assets/js/app.js` | React + JSX source for the `/app/location` page (see below) |
| `assets/images/` | Static images and SVG illustrations |
| `assets/favicons/` | PNG favicons at various sizes |

Fonts (Inter, Poppins) are loaded from Google Fonts CDN; the layout preconnects
and preloads them for Core Web Vitals.

The `.well-known/` directory is explicitly included in `_config.yml` so Jekyll
copies it into `_site/`. The `appspecific/` sub-directory is excluded because it
contains internal tooling files that should not be publicly served.

---

## How `/app/location` is rendered

[app.md](app.md) uses `layout: null`, meaning it outputs a **standalone HTML
document** with no site chrome. Its permalink is `/app/location`.

```yaml
---
layout: null
permalink: /app/location
---
```

The page mounts a React 18 app. React, ReactDOM, and Babel Standalone are loaded
from unpkg CDN at runtime. `assets/js/app.js` contains JSX and is parsed
in-browser by Babel (declared with `type="text/babel" data-presets="react"`).

Jekyll injects two runtime constants into `<script>` in the page `<head>` at
build time:

```html
<script>
  window.__APP_STORE_URL__ = "{{ site.app_store_url }}";
  window.__API_BASE_URL__  = "{{ site.api_base_url }}";
</script>
```

`app.js` reads these values so the production build points at
`https://api.iknowaplace.app` and the local build points at
`http://localhost:8080`.

**API call:** on mount, the React app extracts the location slug from the URL
path (`/app/location/<slug>`), falling back to a `?slug=` query parameter. It then
fetches:

```
GET {API_BASE}/api/v1/location/<slug>/webapp
```

The response JSON provides `name`, `address_district`, `address_city`, `status`,
`has_wifi`, and `images`. The UI renders a `MobileCard` with a hero photo
carousel, facility rows, and a sticky App Store CTA.

**Responsive layout:** at viewport widths ≥ 800 px the `MobileCard` is wrapped
inside a `DesktopFrame` that renders a simulated phone mockup alongside download
copy and a QR code. Below 800 px the card fills the viewport.

---

## How deep links work for `/app/location`

Three complementary mechanisms handle opening the native app from a
`/app/location/<slug>` URL:

### 1. Universal Links (iOS Safari — preferred path)

[.well-known/apple-app-site-association](.well-known/apple-app-site-association)
maps the `/app/*` path pattern to the native app bundle
(`774LY293RT.com.iknowaplace.map`):

```json
{
  "applinks": {
    "details": [{ "appID": "774LY293RT.com.iknowaplace.map", "paths": ["/app/*"] }]
  }
}
```

When a user on iOS Safari follows a link to `https://iknowaplace.app/app/location/<slug>`,
iOS checks this file and, if the app is installed, opens it directly in the native
app without touching the web page. No JavaScript required.

### 2. Smart App Banner (iOS Safari — app not installed)

An inline `<script>` in `app.md`'s `<head>` dynamically injects an
`apple-itunes-app` meta tag with an `app-argument` pointing back to the full URL:

```html
<meta name="apple-itunes-app"
      content="app-id=6747653382,
               app-argument=https://iknowaplace.app/app/location/<slug>">
```

Safari renders its native Smart App Banner at the top of the page. Tapping
**Open** passes the URL to the app as a deep-link argument so it can navigate
directly to the right location.

### 3. Custom-scheme banner (non-Safari iOS browsers)

Chrome, Firefox, and other iOS browsers do not support Universal Links or Smart
App Banners. The `DeeplinkBanner` React component detects this case
(`isIOS && !isSafari`) and renders a dismissible banner at the top of the page
with an **Open** button that fires the custom URL scheme:

```
iknowaplace://location/<slug>
```

If the app is installed the OS hands off to it immediately; if not, the link
silently fails and the user stays on the web page.
