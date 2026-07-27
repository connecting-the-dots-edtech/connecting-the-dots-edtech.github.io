# Connecting the Dots — Islamic History Timeline

An interactive documentary-style timeline of Islamic history, from Creation
through the Caliphates, built with React, TypeScript, Vite, and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Content

Timeline events live as individual Markdown files in
[`src/content/events/`](src/content/events/), one file per event. To add a
new event:

1. Create `src/content/events/NNN-slug.md` with frontmatter fields `id`,
   `era`, `year`, `title`, `titleEn`, `up`, `thumb`, and optionally `arabic`
   — see any existing file for the exact shape. The text below the `---`
   fence is the event's narrative body.
2. Import it and add one line to the map in
   [`src/content/events/index.ts`](src/content/events/index.ts), keyed by id.

Eras, the prophetic lineage, and general sources are structural/reference
data and live in [`src/data/timeline.ts`](src/data/timeline.ts).

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages.
