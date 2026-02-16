# Main Site (GitHub Pages)

Ultra-low maintenance personal site for Zach Alexander. Static HTML/CSS/JS with no build step.

## Quick Start

1. Open `index.html` in a browser.
2. Or serve locally:

```bash
python3 -m http.server 8000
```

## Customize

- **Colors / tokens**: edit `assets/css/styles.css`.
- **Hero text**: edit `index.html`.
- **Projects**: edit `data/projects.json`.
- **Now page**: edit `now.html`.
- **Contact links**: edit `contact.html`.

### Set Blog URLs

Update `assets/js/latest-blog.js`:

- `BLOG_FEED_URL` → your blog `/feed.xml` URL.
- `BLOG_HOME_URL` → your blog homepage URL.

### Canonical Base URL

Already set to `https://alexzander73.github.io` in:
- `index.html`
- `projects.html`
- `now.html`
- `about.html`
- `contact.html`
- `sitemap.xml`
- `robots.txt`

## Motion Settings

- All transitions and reveals respect `prefers-reduced-motion`.
- If your OS/browser has reduced motion enabled, animations are disabled automatically.

## Feed Troubleshooting

- The blog must be public for cross-origin fetch to work on GitHub Pages.
- Open your blog `feed.xml` directly to verify it loads.
- If fetch fails due to CORS, keep the blog public or expose a public JSON endpoint.

## Deployment (GitHub Pages)

This repo is configured to publish from the root.
1. Push to `main`.
2. In GitHub Pages settings, use the `main` branch and `/` (root).

## Files

- `index.html`
- `projects.html`
- `now.html`
- `about.html`
- `contact.html`
- `assets/css/styles.css`
- `assets/js/main.js`
- `assets/js/latest-blog.js`
- `data/projects.json`
