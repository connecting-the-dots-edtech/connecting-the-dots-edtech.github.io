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

This is a React + TypeScript + Tailwind CSS v4 site (Vite), an interactive
documentary-style timeline of Islamic history, with client-side routes `/`
(home), `/timeline`, `/eras` and `/lineage` (react-router; `public/404.html`
handles deep links on GitHub Pages). It deploys to
GitHub Pages as an org root page (`connecting-the-dots-edtech.github.io`),
which is why `vite.config.ts` hardcodes `base: '/'` — not a project subpath.
Deployment is via `.github/workflows/deploy.yml` (GitHub Actions building and
publishing `dist/` on every push to `main`; the repo's Pages source must be
set to "GitHub Actions" in Settings → Pages, not branch deploy).

### No inline styles — literal Tailwind classes, tokens for colour

There are no JSX `style={{}}` props anywhere in `src/`. Tailwind's compiler
only picks up class names that appear as literal, contiguous text in a scanned
source file — it does not execute JS, so a class built by interpolation or
`.replace()` (e.g. `` `bg-[${color}]` ``) silently produces no CSS. Joining
*literal* class strings is fine; building one from a value is not.

- **Colour tokens** live in `src/index.css` as CSS custom properties (`--bg`,
  `--surface`, `--text`, `--muted`, `--gold`, `--line`, `--e-<era>`, ...). Light
  is the `:root` default; dark applies via `prefers-color-scheme` (unless
  `data-theme="light"`) or `data-theme="dark"`. A `@theme inline` block exposes
  them as utilities (`bg-surface`, `text-muted`, `text-gold`, `border-line`, ...).
  All text colours come from tokens.
- **Per-era colour:** `src/data/eraStyles.ts` exports `eraVar[eraId]`, literal
  arbitrary-property classes (`[--e:var(--e-cosmos)]`). Put it on an element or
  ancestor, then use `text-e`, `bg-e`, `stroke-e`, `fill-e`, or `var(--e)` in
  arbitrary values. For border colour use `border-(--e)` — Tailwind's `border-e`
  is the inline-end border-width utility, not a colour. To add an era: add its
  `--e-<id>` tokens (light and dark) in `index.css` and an `eraVar` entry.
- **No zoom:** the timeline has no zoom levels or per-zoom width classes. Era
  bands size from their content.
- **Starfield:** `src/data/stars.ts` is a fixed, pre-baked list of literal
  position/size/timing classes (not `Math.random()` at runtime).
- **Breakpoints:** custom variants `phone:` (max-width 760px) and `tablet:`
  (max-width 960px), defined in `index.css`. Desktop-first: a base class plus a
  `phone:` override.
- **Imperative style exceptions:** DOM style is mutated directly via a ref inside
  `useEffect`/`useLayoutEffect` only for continuous runtime values: the timeline
  curve's clip geometry (`useConnectingLine`, via `CurveSvg`'s clip rect), the
  minimap's segment flex and viewport box (`ScrubberMinimap`), the reader's
  progress-bar width (`EventModal`), the drag-scroll cursor
  (`useDragScroll`), and the lineage SVG `viewBox` and the stage's
  `data-dragging` cursor flag (`usePanZoom`). Follow the pattern in
  `src/hooks/useDragScroll.ts`.

### Language split

Bangla carries the content: headings, era names and spans, period labels,
chapter labels (`অধ্যায় ০৭`), counts (`৫টি ঘটনা`) and lineage text, always with
Bengali digits (`bnDigits` / `pad2` in `src/lib/format.ts`). English UI chrome —
nav, footer, buttons, interface labels, aria-labels — is Hanken Grotesk (`font-ui`)
with Latin digits, and English-only containers (nav, footer, tab bar, view switch)
carry `lang="en"`. `titleEn` and era `en` exist in the data but are never
rendered. No uppercase or letter-spacing on Bangla. Fonts: `font-bn-display`
(Tiro Bangla) for Bangla titles, `font-bn` (Hind Siliguri) for Bangla body,
`font-ui` for English UI, `font-lat` (Marcellus) for the wordmark only, `font-ar`
(Amiri, then Traditional Arabic) for Arabic. No text under 12px; italic is never
synthesised. Motion is limited to the starfield twinkle, home emblem rotation,
the home thread's travelling light, the timeline curve draw-in, card hover lift,
the Eras panel swap fade, the reader slide-in and the lineage view tween (380ms,
instant under reduced motion); all of it respects
`prefers-reduced-motion`: CSS via the global rule in `index.css` (plus
`motion-reduce:scroll-auto` on the timeline scroller), and JS smooth scrolls pass
`scrollBehavior()` from `src/lib/motion.ts` (`'auto'` under reduced motion).

### Shared UI

`src/components/ui/` holds the reusable pieces: `EventCard` (timeline and
feature variants), `SectionHeading`, `Emblem`, `CurveSvg` and the
icon set in `icons.tsx`. The timeline curve is computed in `src/lib/curve.ts`
(cosine segments through measured `[data-curve-pt]` anchors) and driven by
`src/hooks/useCurve.ts` (measuring) and `src/hooks/useConnectingLine.ts`
(draw-in and scroll catch-up). Also shared: `src/components/EraJourney.tsx` (the
home page's eight-era journey), `src/lib/format.ts` (Bangla digits, reading time,
excerpts, source splitting), `src/lib/keys.ts` (`isTypingTarget`, so global
shortcuts like `/` don't fire inside inputs), `src/hooks/useMediaQuery.ts`, and
`src/components/navLinks.ts` (the nav links shared by Header and TabBar).

### Lineage tree

`/lineage` is an interactive SVG tree of the prophets, with pan and zoom. The data
is `src/data/lineage.ts`: `LineageNode`s (type in `src/data/types.ts`) at
hand-placed coordinates on a 2100×1040 canvas, each with a `parent` and a `link`
evidence level (`q` Qur'an or sahih hadith, `h` historians' accounts, `g`
generations skipped or disputed). Pure helpers (`ancestorChain`, `mainLine`,
`childrenOf`, `edgePath`, `labelPlacement`) are in `src/lib/lineage.ts`. Pan and
zoom are in `src/hooks/usePanZoom.ts` (drag, pinch, Ctrl/⌘+wheel, animated
`zoomBy`/`centerOn`); selection, the details panel and the legend are in
`src/components/LineageTree.tsx`. To add a person: add a node with `x`/`y`, a
`parent` and a `link`, and give a `source` (nodes without one fall back to a
default by link type). Names, notes and sources are Bangla.

### Content model: Markdown files + a manual map registry

Timeline events are authored as individual Markdown files in
`src/content/events/*.md` (frontmatter: `id`, `era`, `year`, `title`,
`titleEn`, `up`, `thumb`, optional `arabic`; the body below the `---` fence
is the narrative text). `up` is currently unused by the layout (the timeline
alternates cards by `id % 2`); it is still required and kept for compatibility. `src/content/parseEvent.ts` has a small hand-rolled
frontmatter parser (not a YAML library — deliberately, since a static Vite
build has no use for one). `src/content/events/index.ts` is the registry:
each `.md` file is imported with a `?raw` suffix and mapped by numeric id;
this is a manual map by design (not an automatic `import.meta.glob` folder
scan), so adding an event means (1) add the `.md` file, (2) add one
import + map entry in `index.ts`. `src/data/timeline.ts` re-exports `events`
from that registry alongside the structural data that rarely changes: `eras`,
`categories`, and `eventMatchesCategory` (the search category filter logic).

### Shared UI state via context, not prop drilling

`src/state/TimelineAppContext.tsx` (`TimelineAppProvider` / `useTimelineApp`)
is the single source of truth for state that's read/written from multiple,
non-adjacent parts of the tree: current view mode (timeline/list), the
timeline track's scroll ref plus `scrollToEra()`, the Eras page's
`selectedEra` / `setSelectedEra`, the quick-look/reader modal's open event
(`EventModal`), and search state (open/query/category/results, plus
`eventMatchesQuery` and per-category `categoryCounts`). `App.tsx` wraps the
page in the provider; components call `useTimelineApp()` directly rather than
receiving these as props.

`src/state/ThemeContext.tsx` holds the theme. It starts from the OS preference
(read once at load) until the visitor toggles; only then is the choice saved to `localStorage`
(`theme`). `index.html` sets `data-theme` before first paint. The reader's text
size is saved separately in `localStorage` (`ctd-size`).

### Timeline Explorer

`src/components/TimelineExplorer/` has two interchangeable views over the same
`events`/`eras` data (`TimelineView`, `ListView`), switched via `ViewSwitch` /
`useTimelineApp().view`. `TimelineView` is a horizontally scrolling track
(vertical on phones) with a cosine curve through the event anchors, arrow
buttons, a hint row and drag-to-scrub (`useDragScroll` on the shared
`trackRef`). `ScrubberMinimap` and the Eras panel jump into the timeline via
`scrollToEra()`, which forces `view` back to `'timeline'` and navigates to
`/timeline` before scrolling, since era `data-era` bands only exist in that
view. `ListView` groups events by era.

An external browser verification script depends on a set of DOM ids/data attributes
(`tl-scroller`, `tl-track`, `data-curve-pt`, `era-journey`, `era-panel`,
`lineage-tree`, `lin-svg`, `lin-info`, `lin-key`, `lin-key-btn`, `data-node`,
`data-edge`, `data-lin`, `reader`, `search`, ...). `data-lineage` on a node is
`main` or `branch`: on or off the আদম → মুহাম্মদ ﷺ chain. Don't rename them
without checking for uses.
