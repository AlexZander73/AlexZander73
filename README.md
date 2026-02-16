# Zach Alexander

This repo hosts the GitHub Pages site: https://alexzander73.github.io/

## Quick Start

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

## Customize

- **Colors / tokens**: `assets/css/styles.css`
- **Hero + copy**: `index.html`
- **Projects fallback data**: `data/projects.json`
- **Now page**: `now.html`
- **Contact links**: `contact.html`

### Blog Feed

Update `assets/js/latest-blog.js`:
- `BLOG_FEED_URL` → your blog `/feed.xml`
- `BLOG_HOME_URL` → blog homepage

## Auto Project Sync (GitHub Actions)

A workflow updates `data/projects.auto.json` from the GitHub API.

- Runs on push to `main` and weekly schedule.
- Filters out forks and archived repos.
- Uses `GITHUB_TOKEN` (no extra secrets needed).

If the auto file is missing or fails to load, the site falls back to `data/projects.json`.

## Enable Pages

1. Repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / Folder: `/ (root)`

## Motion Settings

All animations respect `prefers-reduced-motion`.
