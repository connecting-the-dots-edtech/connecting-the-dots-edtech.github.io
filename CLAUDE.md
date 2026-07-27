# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server with HMR
npm run build     # tsc -b (typecheck) && vite build -> dist/
npm run preview   # serve the production build from dist/ locally
npm run lint      # oxlint
```

There is no test suite in this repository.

The build is deliberately pinned to **Vite 6.4.3** and `@vitejs/plugin-react`
4.x, not the latest Vite 8 line. Vite 8 ships a rolldown-based bundler by
default that crashed with native binding errors (`Cannot find module
'./rolldown-binding.<platform>.node'`) in this environment. Don't bump past
Vite 6/7 without verifying the build actually runs first.

## Architecture

This is a single-page React + TypeScript + Tailwind CSS v4 site (Vite), an
interactive documentary-style timeline of Islamic history. It deploys to
GitHub Pages as an org root page (`connecting-the-dots-edtech.github.io`),
which is why `vite.config.ts` hardcodes `base: '/'` — not a project subpath.
Deployment is via `.github/workflows/deploy.yml` (GitHub Actions building and
publishing `dist/` on every push to `main`; the repo's Pages source must be
set to "GitHub Actions" in Settings → Pages, not branch deploy).

### No inline styles — precomputed Tailwind classes for data-driven values

Every visual property is a Tailwind utility class; there are no JSX `style={{}}`
props anywhere in `src/`. Tailwind's compiler only picks up class names that
appear as literal, contiguous text in a scanned source file — it does not
execute JS, so a class built by string interpolation or `.replace()` (e.g.
`` `bg-[${color}]` ``) silently produces no CSS. Because several UI elements
are colored/sized per content item (era accent colors, per-zoom-level track
widths, the hero starfield), those values are precomputed as literal class
strings ahead of time rather than computed at render time:

- `src/data/eraStyles.ts` — one object per era id with literal classes like
  `'bg-[#181C2E]'`, `'text-[#8FB4E6]'`, plus a `min-w-[Npx]` class for each of
  the 4 zoom levels (`src/data/eraStyles.ts`'s `eraWidthClasses`). When adding
  a new era or changing zoom behavior, add/update entries here — do not try
  to compute a Tailwind class from a hex value in a component.
- `src/data/stars.ts` — the hero's 40 twinkling stars are a fixed, pre-baked
  list of literal position/size/timing classes (not `Math.random()` at
  runtime), for the same reason.
- `src/data/timeline.ts`'s `lineage` array carries `sizeClass` / `dotClass` /
  `borderClass` literal Tailwind classes directly, not raw color values.

The only exceptions are two hooks that mutate DOM style imperatively via a
ref inside a `useEffect` (`src/hooks/useParallax.ts` for scroll-linked
parallax translation, `src/hooks/useDragScroll.ts` for drag-to-scroll cursor
feedback) — these are continuous, runtime-only values that cannot be
expressed as a finite set of classes, and they're not JSX `style` props.

### Content model: Markdown files + a manual map registry

Timeline events are authored as individual Markdown files in
`src/content/events/*.md` (frontmatter: `id`, `era`, `year`, `title`,
`titleEn`, `up`, `thumb`, optional `arabic`; the body below the `---` fence
is the narrative text). `src/content/parseEvent.ts` has a small hand-rolled
frontmatter parser (not a YAML library — deliberately, since a static Vite
build has no use for one). `src/content/events/index.ts` is the registry:
each `.md` file is imported with a `?raw` suffix and mapped by numeric id;
this is a manual map by design (not an automatic `import.meta.glob` folder
scan), so adding an event means (1) add the `.md` file, (2) add one
import + map entry in `index.ts`. `src/data/timeline.ts` re-exports `events`
from that registry alongside the structural data that rarely changes: `eras`,
`lineage`, `generalSources`, `categories`, and `eventMatchesCategory` (the
search category filter logic).

### Shared UI state via context, not prop drilling

`src/state/TimelineAppContext.tsx` (`TimelineAppProvider` / `useTimelineApp`)
is the single source of truth for state that's read/written from multiple,
non-adjacent parts of the tree: current view mode (timeline/list/map), zoom
level, the timeline track's scroll ref plus `scrollToEra()`, the quick-look
modal's open event, the currently displayed Event Detail page (`detailEvent`
— separate from the quick-look modal so "Read full event" can swap the
detail section's content without navigating), and search overlay state
(open/query/category/results). `App.tsx` wraps the whole page in the
provider; components call `useTimelineApp()` directly rather than receiving
these as props.

### Timeline Explorer

`src/components/TimelineExplorer/` has three interchangeable views over the
same `events`/`eras` data (`TimelineView`, `ListView`, `MapView`), switched
via `useTimelineApp().view`. Only `TimelineView` supports zoom (era band
widths scale via `eraWidthClasses`) and drag-to-scrub (`useDragScroll` on the
shared `trackRef`); `ScrubberMinimap` and `EraGrid` both jump into the
timeline via `scrollToEra()`, which forces `view` back to `'timeline'` before
scrolling, since era `data-era` bands only exist in the DOM in that view.
