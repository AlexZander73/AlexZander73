# Product Export README

## What this product appears to be
This repo is a **content/archive/documentation project** with a **knowledge/reference tool** surface.

Evidence:
- The repo README describes a MkDocs site that mirrors a GitHub Wiki.
- The `docs/` directory is topic-indexed reference content (install guides, FAQ, quests, followers, bug notes).
- The `scripts/` directory focuses on syncing markdown, fixing links, checklist ingestion, and static deployment.

## Chosen framing and why
Chosen framing: **docs-forward product page**.

Reasoning:
- The strongest public value is navigable reference structure and maintenance workflow, not app runtime features.
- A docs-forward page avoids app-store or SaaS framing and matches how this project is actually used.

## Source files and assets used
Primary sources:
- `README.md`
- `mkdocs.yml`
- `LICENSE-NOTE.md`
- `docs/index.md`
- `docs/Getting-started.md`
- `docs/Installation-and-config-guides.md`
- `docs/Content-and-quests.md`
- `docs/Followers.md`
- `docs/Frequently-Asked-Questions.md`
- `docs/checklist/index.md`

Created export assets:
- `productExport/assets/tuxborn-atlas-preview.svg` (new local preview image)

## Assumptions made
- No explicit privacy policy URL is present in this repo; `privacyUrl` is left blank in `content.json` for later central hookup.
- No official standalone product card image was found in this repo; a local SVG preview was generated for export completeness.
- The support URL is based on the Discord invite shown on `docs/index.md`.

## Fields and URLs needing manual hookup later
- `product.privacyUrl` in `content.json` (currently empty)
- Optional replacement of `catalog.image` with official branded media when available
- Back-to-site placeholder link in `index.html` (`../`) should be adjusted by central site routing

## Main catalog/product card preview asset
Use:
- `./assets/tuxborn-atlas-preview.svg`

## Support/privacy URL status
- Support URL: **final candidate** from docs source (`https://discord.gg/xRrHRsb5e9`)
- Privacy URL: **placeholder / missing** (manual follow-up required)

## Screenshot availability
- No dedicated screenshot set was identified in this repo for product-card usage.
- A local preview SVG is provided as a safe fallback visual.

## Integration notes for central site import
- Suggested destination path: `/products/tuxborn-wiki/`
- Suggested support path if needed: `/support/tuxborn-wiki/` (or direct Discord link)
- Suggested privacy path if needed: `/products/tuxborn-wiki/privacy/`
- Suggested catalog title: `Tuxborn Wiki`
- Suggested catalog blurb: `A maintained navigation layer for installing, understanding, and completing content in the Tuxborn modpack.`
- Suggested catalog image: `./assets/tuxborn-atlas-preview.svg`
- Suggested platform text: `Web reference`

## Export package contents
- `productExport/index.html`
- `productExport/styles.css`
- `productExport/content.json`
- `productExport/assets/tuxborn-atlas-preview.svg`
- `productExport/EXPORT_README.md`
