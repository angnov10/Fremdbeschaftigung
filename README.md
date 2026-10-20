# CHRONO

CHRONO is a polished historical daily puzzle game built as a static browser app. It is designed for quick play on desktop, mobile, and school-managed iPads in Safari.

## Features

- Daily historical challenge modes
- Krillion-style uncommon-answer scoring
- Noillirk-style famous-answer scoring
- Before / After timeline gameplay
- Discover connection mode
- Local progress persistence with LocalStorage
- Responsive dark-mode-first interface
- Works as a static site without a build step

## Run locally

```bash
cd /Users/an/Fremdbeschaftigung
python3 -m http.server 8000
```

Then open http://localhost:8000 in the browser.

## Deployment

This project is a static frontend and can be deployed to:

- Cloudflare Pages
- GitHub Pages
- any static host

### Cloudflare Pages

1. Push the repository to GitHub.
2. Create a Pages project from the repository.
3. Use the project root as the deployment directory.
4. No build step is required.

### GitHub Pages

1. Open repository settings.
2. Enable Pages.
3. Publish from the main branch or from a static root.

## Test

```bash
cd /Users/an/Fremdbeschaftigung
node tests/sanity.mjs
```

## Notes

- Daily challenges are derived from UTC dates and a stable hash.
- Local stats are stored in the browser and may be cleared by clearing site data.
- The app intentionally uses curated data so it remains playable without live API access.
