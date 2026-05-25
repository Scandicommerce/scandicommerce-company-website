# Blog index redesign — Variant B ("Engineering log")

Branch: `blog-index-redesign`
Design source: `Scandicommerce Design System/explorations/blog-variant-b.jsx`

---

## What changed

### `components/sections/resources/FeaturedArticle.tsx`
**Before:** Two-column card (image left, text right) with tags, title, description, date/time metadata, and a black CTA button.
**After:** Full-bleed `21:9` cover image with a dark gradient overlay. Top corners show `FEATURED · {date}` and `{readTime} · {category}` in JetBrains Mono. Bottom shows the article title (white, bold, clamped with `clamp()`) and a `#1EEFFA` CTA pill with an arrow. Slight `scale` on hover.

### `components/sections/resources/ArticleCard.tsx`
**Before:** Card with tall image, category pill, clock icon, title, description, and date.
**After:** `LogRow` component with three variants:
- **large** — used for "this month" articles: index number, date, category eyebrow, 22px title, one-line description, read time
- **default** — used for "last month": same but 18px title, slightly tighter padding
- **compact** — used for older articles: category and title inline, no description, minimal padding

Each variant has full mobile stacking below `md` (number, category, title, date stacked with hairline separators).

### `components/sections/resources/ArticlesGrid.tsx`
**Before:** Uniform 3-column image grid with a "Load More" button.
**After:** Three date-grouped bays in a 12-column layout:
- Left 3 cols: sticky bay label (clears header at `top-20`) with group name and article count in mono
- Right 9 cols: LogRow list

Groups are computed client-side from each article's `date` field (no new Sanity fields):
- **Denne måneden / This month** — `parsedDate >= first day of current month` → `large` rows
- **Forrige måned / Last month** — previous calendar month → `default` rows
- **Eldre / Older** — everything else → `compact` rows

If all articles fall outside the last two months (e.g. no recent posts), they all render in a single "Older" bay. An archive link at the bottom shows the date range and article count.

Norwegian/English switching is driven by the `lang` prop (`nb-NO` triggers Norwegian bay labels).

### `components/sections/resources/GetShopifyInsitesDelivered.tsx`
**Before:** Bright cyan (`#03C1CA`) section, centered layout, white text/button.
**After:** Dark section (`#0A0A0B`) with a 25% cyan radial glow on the left. Left side has an uppercase "Notes from the studio" eyebrow + heading. Right side has a dark-bordered email input + `#1EEFFA` subscribe button. Sanity fields (`title`, `emailPlaceholder`, `buttonText`) still wired in.

---

## Token translation notes

| Design prototype | This repo |
|---|---|
| `#03C1CA` inline | `text-teal` / `bg-teal` (tailwind.config custom color) |
| `#1EEFFA` CTA fill | `bg-[#1EEFFA]` (arbitrary — not in config) |
| `#11848C` eyebrow text | `text-[#11848C]` (arbitrary) |
| `box-shadow: 0 8px 14px rgba(141,141,141,0.20)` | `shadow-button` |
| `box-shadow: 0 4px 18px rgba(0,0,0,0.05)` | `shadow-header` |
| `font-mono` dates/numbers | `font-mono` (JetBrains Mono, already loaded) |
| 200ms transitions | `duration-200` + Tailwind default ease |

**Flag:** The brief says to use `text-cyan-500` for the brand teal, but Tailwind's built-in `cyan-500` is `#06b6d4` — not `#03C1CA`. The repo's config registers `#03C1CA` as `teal`. All new code uses `text-teal` to stay consistent with the existing codebase. If you want to rename it to `cyan-500` in `tailwind.config.ts`, that's a one-line change.

---

## What was not implemented / punted

1. **Page header section** — The design exploration includes a large `h1` ("Engineering notes from running Shopify Plus at scale.") with a mono stats column (post count, cadence, last shipped, RSS/Email links). This wasn't implemented because the blog page already has a Sanity-managed `blogPageHeroSection` that editors control. Implementing a second hardcoded header would duplicate that and create a content conflict. The design header could be wired up by adding fields to the `blogPageHeroSection` schema in a follow-up.

2. **`bg-cyan-tint` utility** — The brief mentions adding a `bg-cyan-tint` utility for the announcement bar tint. The announcement bar is not part of the blog index route (it lives in the global header), so this wasn't needed here.

3. **Framer Motion entrance animations** — The existing blog components didn't use framer-motion, so no animations were added. If entrance animations (`opacity 0→1, translateY 30→0`) are desired, they can be layered onto the bay divs and LogRow components as a follow-up.

4. **`#1EEFFA` and `#11848C` not in tailwind.config** — These are used as arbitrary values. If they recur in more components they should be promoted to named tokens in `tailwind.config.ts` (`cyan.bright` and `cyan.dark` or similar).

---

## What to review

- [ ] FeaturedCover renders correctly when `imageUrl` is null (falls back to `/images/resources/featured_article/banner.png`)
- [ ] Date grouping logic handles articles with `null` or unparseable dates (falls back to "older")
- [ ] Sticky bay label clears the site header on desktop (`top-20` = 80px — adjust if header height differs)
- [ ] Norwegian locale (`/no/blogg`, `/nb-no/blogg`) shows Norwegian bay labels
- [ ] Mobile layout: sticky bays collapse to full-width headings, rows stack cleanly
- [ ] The archive link at the bottom is cosmetic only — no pagination wired up yet
