# NameVerse — Full Codebase Audit Report

> **Date:** 2026-07-19  
> **Scope:** UI System, Data Layer, Dependencies, SEO  
> **Mode:** Read-only audit — no code changes made

---

## 1. Current UI Style System

### 1.1 Colors

The project uses a custom CSS custom-property system defined in `src/app/globals.css` (lines 4–18 for light, lines 21–37 for dark). Tailwind v4 is used for utility classes.

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--nv-canvas` | `#F8FAFC` | `#0F172A` | Page background |
| `--nv-canvas-2` | `#EFF6FF` | `#1E293B` | Secondary canvas |
| `--nv-ink` | `#0F172A` | `#F8FAFC` | Text color |
| `--nv-muted` | `#64748B` | `#CBD5E1` | Muted text |
| `--nv-card` | `rgba(255,255,255,0.86)` | `rgba(15,23,42,0.84)` | Card backgrounds |
| `--nv-card-strong` | `rgba(255,255,255,0.96)` | `rgba(15,23,42,0.96)` | Solid card backgrounds |
| `--nv-border` | `#E2E8F0` | `rgba(148,163,184,0.22)` | Borders |
| `--nv-shadow` | `rgba(15,23,42,0.12)` | `rgba(0,0,0,0.42)` | Box shadows |
| `--nv-accent` | `#0EA5E9` | `#38BDF8` | Primary accent (sky blue) |
| `--nv-accent-2` | `#2563EB` | `#3B82F6` | Secondary accent (blue) |
| `--nv-accent-3` | `#3B82F6` | `#60A5FA` | Tertiary accent (blue) |
| `--nv-success` | `#10B981` | `#34D399` | Success states |
| `--nv-warning` | `#F59E0B` | `#FBBF24` | Warning states |
| `--nv-error` | `#EF4444` | `#F87171` | Error states |

**Inconsistent one-off colors found:**
- `src/app/names/page.jsx` uses hardcoded Tailwind colors per religion category: emerald (`bg-emerald-50`, `text-emerald-700`), blue (`bg-blue-50`, `text-blue-700`), orange (`bg-orange-50`, `text-orange-700`) — these are NOT using the CSS custom properties.
- `src/components/Navbar/Navbar.jsx` uses hardcoded `bg-blue-50`, `text-blue-700`, `bg-slate-950`, `bg-indigo-500 to-purple-600` — not using CSS variables.
- `src/components/Footer/Footer.jsx` uses hardcoded `bg-indigo-500 to-purple-600`, `bg-slate-50`, `border-slate-200`.
- `src/app/layout.js` sets `themeColor: "#1E40AF"` (line 104) and `theme-color: "#4F46E5"` (line 114) — two different values for theme-color meta tag.
- `src/app/names/page.jsx` uses `bg-gradient-to-r from-emerald-600 via-blue-600 to-orange-600` (line 200) — a multi-color gradient that doesn't match any single accent token.
- `src/app/names/page.jsx` uses `bg-purple-500` (line 133) and `border-purple-300` (line 247) — purple is not in the CSS variable palette.

**Dark mode:** Implemented via `@media (prefers-color-scheme: dark)` in `globals.css`. The Navbar also has a manual toggle that adds/removes a `dark` class on `<html>`, but the CSS variables only respond to `prefers-color-scheme`, not the `.dark` class. This means the manual toggle in the Navbar (lines 83–89, 123–130) is **non-functional** — it toggles the class but the CSS doesn't respond to `.dark`.

### 1.2 Typography

**Fonts loaded:**
- **Display font:** `Fraunces` (weights 600, 700) via `next/font/google` — `src/app/layout.js` line 22–28
- **Body font:** `Instrument_Sans` (weights 400, 600) via `next/font/google` — `src/app/layout.js` line 30–36
- Both use `display: 'swap'` and `preload: true`

**CSS font-family classes:**
- `.nv-display`: `var(--font-display), ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
- `.nv-body` / `body`: `var(--font-body), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`

**Font sizes in use (from globals.css and scanned pages):**
- `text-3xl` (1.875rem), `text-4xl` (2.25rem), `text-5xl` (3rem) — heading scale
- `text-base` (1rem), `text-lg` (1.125rem) — body text
- `text-xs` (0.75rem), `text-sm` (0.875rem) — small text, nav, badges
- `text-[10px]`, `text-[11px]`, `text-[9px]` — one-off sizes in Navbar
- `text-xl` (1.25rem), `text-2xl` (1.5rem) — section headings
- `text-6xl` (3.75rem) — hero on names page

**Font weights used:** `font-extrabold`, `font-black`, `font-bold`, `font-semibold`, `font-medium`, `font-normal`, `font-mono`

**Line heights:** `leading-none`, `leading-tight`, `leading-relaxed`, `leading-7`, `leading-snug`

### 1.3 Spacing Scale

The project uses Tailwind's default spacing scale. Common values:
- `p-4`, `p-5`, `p-6`, `p-8`, `p-10` — padding
- `px-3`, `px-3.5`, `px-4`, `px-6`, `px-8` — horizontal padding
- `py-1.5`, `py-2`, `py-2.5`, `py-3`, `py-4`, `py-6`, `py-10`, `py-12` — vertical padding
- `gap-1`, `gap-1.5`, `gap-2`, `gap-2.5`, `gap-3`, `gap-4`, `gap-6`, `gap-10` — gaps
- `space-y-1`, `space-y-1.5`, `space-y-3`, `space-y-4`, `space-y-6`, `space-y-8` — stacked spacing
- `mt-0.5`, `mt-1`, `mt-2`, `mt-4`, `mt-5`, `mt-6`, `mt-8`, `mt-10` — margin top
- `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-6`, `mb-8`, `mb-16`, `mb-20` — margin bottom
- Custom `.nv-container` uses `px-4 sm:px-6 lg:px-8` — responsive container padding

**No custom spacing scale** — follows Tailwind defaults.

### 1.4 Border Radius, Shadows, Breakpoints

**Border radius:**
- `rounded-full` — pills, avatars, buttons
- `rounded-xl` — cards, sections
- `rounded-2xl` — large cards, dropdowns
- `rounded-3xl` — `.nv-card`, `.nv-card-solid`, feature sections
- `rounded-lg` — icons, small elements
- `rounded-md` — default button variant
- `rounded-[2rem]` — one-off in Footer (line 116)

**Shadows:**
- `shadow-sm` — cards, sections
- `shadow-xl` — dropdowns, hover states
- `shadow-2xl` — mobile menu
- `shadow-xs` — shadcn/ui button variants
- Custom: `0 24px 60px -40px var(--nv-shadow)` — `.nv-surface` and `.nv-card`
- Custom: `0 10px 30px -22px rgba(2, 6, 23, 0.24)` — `.nv-card-solid`

**Breakpoints:** Tailwind defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`). No custom breakpoints found.

### 1.5 Components Inventory

| Component | Path | Description |
|---|---|---|
| Navbar | `src/components/Navbar/Navbar.jsx` | Sticky top nav with dropdowns, mobile menu, theme toggle, search link |
| SearchBar | `src/components/Navbar/searchBar.jsx` | Inline search bar component |
| Footer | `src/components/Footer/Footer.jsx` | Multi-column footer with links, social icons, copyright |
| Breadcrumbs | `src/components/Breadcrumbs/Breadcrumbs.jsx` | Breadcrumb navigation component |
| RouteChrome | `src/components/Layout/RouteChrome.jsx` | Page layout wrapper with background ornament |
| PageLayout | `src/components/Layout/PageLayout.jsx` | Generic page layout wrapper |
| SitePage | `src/components/Layout/SitePage.jsx` | Site page layout |
| NameDetail (main) | `src/components/name/NameDetail.jsx` | Main name detail card component |
| NameHero | `src/components/name/NameHero.jsx` | Hero section for name detail pages |
| Meaning | `src/components/name/Meaning.jsx` | Name meaning display |
| RelatedNames | `src/components/name/RelatedNames.jsx` | Related names section |
| FAQ | `src/components/name/FAQ.jsx` | FAQ section for name pages |
| KnowledgeGraph | `src/components/name/KnowledgeGraph.jsx` | Entity relationship graph |
| EntityRelationshipPanel | `src/components/name/EntityRelationshipPanel.jsx` | Entity relationship panel |
| ShareButtons | `src/components/name/ShareButtons.jsx` | Social share buttons |
| TopicClusterNav | `src/components/name/TopicClusterNav.jsx` | Topic cluster navigation |
| UserJourneyNav | `src/components/name/UserJourneyNav.jsx` | User journey navigation |
| AlphaIndex | `src/components/NameDetail/AlphaIndex.jsx` | A-Z alphabet index |
| NameDetailClient | `src/components/names/NameDetailClient.jsx` | Client-side name detail |
| LetterNamesClient | `src/components/names/LetterNamesClient.jsx` | Client-side letter listing |
| FAQAccordion | `src/components/names/FAQAccordion.jsx` | FAQ accordion component |
| ExploreBlock | `src/components/names/ExploreBlock.jsx` | Explore section block |
| HomePage (client) | `src/components/HomePage/Homepage.jsx` | Main homepage client component |
| HeroSection | `src/components/HomePage/HeroSection.jsx` | Homepage hero |
| SearchSection | `src/components/HomePage/SearchSection.jsx` | Homepage search |
| TrendingNames | `src/components/HomePage/TrendingNames.jsx` | Trending names section |
| PopularNamesSection | `src/components/HomePage/PopularNamesSection.jsx` | Popular names |
| ReligiousNamesSection | `src/components/HomePage/ReligiousNamesSection.jsx` | Religious names |
| NameCategories | `src/components/HomePage/NameCategories.jsx` | Name categories |
| BlogPreview | `src/components/HomePage/BlogPreview.jsx` | Blog preview |
| LatestArticles | `src/components/HomePage/LatestArticles.jsx` | Latest articles |
| ComprehensiveFAQ | `src/components/HomePage/ComprehensiveFAQ.jsx` | FAQ section |
| TableOfContents | `src/components/HomePage/TableOfContents.jsx` | TOC |
| ThemeGrid | `src/components/HomePage/ThemeGrid.jsx` | Theme grid |
| QuickFiltersGrid | `src/components/HomePage/QuickFiltersGrid.jsx` | Quick filters |
| SearchTools | `src/components/HomePage/SearchTools.jsx` | Search tools |
| WhyChooseSection | `src/components/HomePage/WhyChooseSection.jsx` | Why choose section |
| AuthorityStats | `src/components/HomePage/AuthorityStats.jsx` | Authority stats |
| BrandDominance | `src/components/HomePage/BrandDominance.jsx` | Brand dominance |
| ContentSection | `src/components/HomePage/ContentSection.jsx` | Content section |
| HowItWorks | `src/components/HomePage/HowItWorks.jsx` | How it works |
| PlatformOverview | `src/components/HomePage/PlatformOverview.jsx` | Platform overview |
| SeasonalNamesSection | `src/components/HomePage/SeasonalNamesSection.jsx` | Seasonal names |
| Trending2026 | `src/components/HomePage/Trending2026.jsx` | 2026 trends |
| SearchWithSuggestions | `src/components/SearchWithSuggestions.jsx` | Search with autocomplete |
| FavoriteButton | `src/components/FavoriteButton.jsx` | Favorite/save toggle |
| AdvancedNameFilters | `src/components/Filters/AdvancedNameFilters.jsx` | Advanced filter UI |
| DynamicFilters | `src/components/Filters/DynamicFilters.jsx` | Dynamic filter controls |
| BlogCard | `src/components/Blog/BlogCard.jsx` | Blog post card |
| BlogSidebar | `src/components/Blog/BlogSidebar.jsx` | Blog sidebar |
| BlogToc | `src/components/Blog/BlogToc.jsx` | Blog table of contents |
| BlogSection | `src/components/Blog/BlogSection.jsx` | Blog content section |
| BlogInternalLinks | `src/components/Blog/BlogInternalLinks.jsx` | Internal blog links |
| BlogVisual | `src/components/Blog/BlogVisual.jsx` | Blog visual element |
| ShareButtons (Blog) | `src/components/Blog/ShareButtons.jsx` | Blog share buttons |
| NewsletterSignup | `src/components/Blog/NewsletterSignup.jsx` | Newsletter signup |
| BlogImageWithFallback | `src/components/Blog/BlogImageWithFallback.jsx` | Blog image with fallback |
| NativeAdScript | `src/components/Ads/NativeAdScript.jsx` | Native ad script loader |
| NativeBanner | `src/components/Ads/NativeBanner.jsx` | Native ad banner |
| StickyBanner | `src/components/Ads/StickyBanner.jsx` | Sticky ad banner |
| ErrorBoundary | `src/components/ErrorBoundary/ErrorBoundary.jsx` | React error boundary |
| LoadingAnimation | `src/components/LoadingAnimation/LoadingAnimation.jsx` | Loading spinner |
| LoadingWrapper | `src/components/LoadingAnimation/LoadingWrapper.jsx` | Loading wrapper |
| OptimizedImage | `src/components/OptimizedImage/OptimizedImage.jsx` | Optimized image component |
| OptimizedList | `src/components/OptimizedList/OptimizedList.jsx` | Optimized list |
| VirtualList | `src/components/VirtualList/VirtualList.jsx` | Virtual scrolling list |
| ResourceHints | `src/components/Performance/ResourceHints.jsx` | Resource hints |
| GoogleBotMeta | `src/components/SEO/GoogleBotMeta.jsx` | Googlebot meta tags |
| SEOHead | `src/components/SEO/SEOHead.jsx` | SEO head component |
| StructuredData | `src/components/SEO/StructuredData.jsx` | JSON-LD structured data |
| TopicalAuthorityDashboard | `src/components/SEO/TopicalAuthorityDashboard.jsx` | Topical authority dashboard |
| ToastContainer | `src/components/Toast/ToastContainer.jsx` | Toast notifications |
| OriginNamesPage | `src/components/OriginNamesPage/OriginNamesPage.jsx` | Origin names page |
| Button | `src/components/ui/button.jsx` | shadcn/ui button |
| Badge | `src/components/ui/badge.jsx` | shadcn/ui badge |
| Card | `src/components/ui/card.jsx` | shadcn/ui card |
| Input | `src/components/ui/input.jsx` | shadcn/ui input |
| Skeleton | `src/components/ui/skeleton.jsx` | shadcn/ui skeleton |
| DropdownMenu | `src/components/ui/dropdown-menu.jsx` | shadcn/ui dropdown menu (Radix) |
| ScrollArea | `src/components/ui/scroll-area.jsx` | shadcn/ui scroll area (Radix) |

### 1.6 Layout Patterns

| Layout | Route(s) | Structure |
|---|---|---|
| **Homepage** | `/` | Hero → Search → Trending → Categories → Blog → FAQ → SEO content. Uses `HomePageClient` wrapper. |
| **Name Detail** | `/names/[religion]/[slug]` | Breadcrumbs → NameHero → Meaning → RelatedNames → FAQ → KnowledgeGraph. Wrapped in `RouteChrome`. |
| **Category/Listing** | `/names`, `/names/religion/[religion]/[page]`, `/names/[religion]/letter/[letter]/[page]` | Hero → Category cards → Alphabet nav → FAQ. Paginated listing pages use `LetterNamesClient`. |
| **Gender Listing** | `/[religion]/boy-names`, `/[religion]/girl-names` | Gender-specific name listing pages |
| **Blog** | `/blog`, `/blog/[slug]` | Blog listing → Article detail with sidebar |
| **Search** | `/search`, `/search/[term]` | Search input → results grid |
| **Static Pages** | `/about`, `/privacy`, `/terms`, `/contact` | Simple content pages |
| **Utility Pages** | `/name-meanings`, `/names-by-meaning`, `/names-by-origin`, `/popularity`, `/trending-names`, `/unique-names`, `/viral-names`, `/advanced-search`, `/my-names`, `/languages`, `/popular-by-state`, `/sibling-names`, `/stories`, `/top-baby-names-usa` | Various listing/utility pages |

---

## 2. Data Layer Audit

### 2.1 Data Sources

#### Local JSON Files (in `public/data/`)

| File | Records | Schema |
|---|---|---|
| `islamic-boy-names.json` | 139 | `{name, meaning, origin, luckyNumber, quranicReference}` |
| `islamic-girl-names.json` | 216 | `{name, meaning, origin, luckyNumber, quranicReference}` |
| `christian-boy-names.json` | 100 | `{name, meaning, origin, luckyNumber, quranicReference}` |
| `christian-girl-names.json` | 100 | `{name, meaning, origin, luckyNumber, quranicReference}` |
| `hindu-boy-names.json` | 150 | `{name, meaning, origin, luckyNumber, quranicReference}` |
| `hindu-girl-names.json` | 150 | `{name, meaning, origin, luckyNumber, quranicReference}` |
| `blog-posts.json` | 66 | Blog post objects with `id`, `title`, `publishDate`, etc. |
| `blog-posts-original.json` | 66 | Same as above (backup) |
| `meaning-content.json` | 7 | Meaning content entries |

#### Local JSON Files (in `public/`)

| File | Records | Schema |
|---|---|---|
| `islamic_names.json` | 18,636 | Array of strings (name only) |
| `islamic_extracted.json` | 18,666 | `{name, language[], gender, origin, religion, category, lucky_number, lucky_day, short_meaning}` |
| `christians_names.json` | 12,847 | Array of strings (name only) |
| `christian_extracted.json` | 12,889 | `{name, language[], gender, origin, religion, category, lucky_number, lucky_day, short_meaning}` |
| `hindu_names.json` | 10,410 | Array of strings (name only) |
| `hindu_extracted.json` | 10,410 | `{name, language[], gender, origin, religion, category, lucky_number, lucky_day, short_meaning}` |

**Total local records:** ~41,900 names (extracted) + ~855 small-set names + 66 blog posts

#### External API

| Endpoint | Method | Called From | Timing |
|---|---|---|---|
| `{API_BASE}/api/v1/names/:religion/filters` | GET | `server-fetch.js` (server component), `names.js` (client) | Build time (ISR) + client-side |
| `{API_BASE}/api/v1/names/:religion` | GET | `server-fetch.js`, `names.js` | Build time (ISR) + client-side |
| `{API_BASE}/api/v1/names/:religion/:slug` | GET | `server-fetch.js` (server component) | Build time (ISR) |
| `{API_BASE}/api/v1/names/search` | GET | `server-fetch.js`, `names.js` | Request time (ISR 1hr) + client-side |
| `{API_BASE}/api/names` | GET | `server-fetch.js` (trending) | Build time (ISR) |
| `{API_BASE}/api/names/:religion/:slug/related` | GET | `server-fetch.js` | Build time (ISR) |
| `{API_BASE}/api/names/:religion/:slug/similar` | GET | `server-fetch.js` | Build time (ISR) |
| `{API_BASE}/api/religion/:religion/filters` | GET | `names.js` (legacy) | Client-side (deprecated) |
| `{API_BASE}/api/religion/:religion` | GET | `names.js` (legacy) | Client-side (deprecated) |
| `{API_BASE}/api/names/:religion/:slug` | GET | `names.js` (legacy), `server-fetch.js` (fallback) | Build time + client-side |

**API Base URL:** `https://name-meaning-site-backend.vercel.app` (from `next.config.mjs` line 1, `server-fetch.js` line 20)

**Notable bug:** `serverFetchRelatedNames()` and `serverFetchSimilarNames()` in `server-fetch.js` (lines 361, 385) hardcode the URL to `/api/names/religion/islamic/1/related` and `/api/names/religion/islamic/1/similar` respectively — they **ignore the `religion` and `slug` parameters** passed to them. This means related/similar names always fetch for the same hardcoded endpoint regardless of which name page you're on.

### 2.2 Rendering Strategy per Route

| Route | Strategy | Revalidate | Details |
|---|---|---|---|
| `/` (homepage) | ISR | 31,536,000s (365 days) | `export const revalidate = 31536000` |
| `/names` | ISR | 31,536,000s (365 days) | `export const revalidate = 31536000` |
| `/names/[religion]/[slug]` | ISR + dynamicParams | 31,536,000s (365 days) | `dynamicParams = true` — generates from local JSON + API |
| `/names/[religion]/letter/[letter]/[page]` | ISR | 31,536,000s (365 days) | Server component fetches from API |
| `/names/religion/[religion]/[page]` | ISR | 31,536,000s (365 days) | Server component |
| `/names/[religion]/origin/[origin]/[page]` | ISR | 31,536,000s (365 days) | Server component |
| `/names/[religion]/categories/[category]/[page]` | ISR | 31,536,000s (365 days) | Server component |
| `/search` | Client-side | N/A | `GlobalSearchClient.jsx` — client component |
| `/search/[term]` | Client-side | N/A | Client component |
| `/blog` | ISR | 31,536,000s (365 days) | Server component |
| `/blog/[slug]` | ISR | 31,536,000s (365 days) | Server component |
| `/sitemap.xml` | Static | 86,400s (1 day) | `dynamic = 'force-static'` |
| `/feed.xml` | Static | N/A | Route handler |
| Static pages (`/about`, `/privacy`, etc.) | ISR | 31,536,000s (365 days) | Server components |
| `/api/*` | Dynamic | No cache | `no-store` in headers |

**Key finding:** All content pages use 365-day ISR. This is extremely long — content changes (new names, updated meanings) won't appear for up to a year without manual revalidation.

### 2.3 Caching Layer

- **Next.js ISR cache:** 365-day revalidation on all content pages
- **In-memory request cache:** `requestCache` Map in `src/lib/api/names.js` (lines 712–759) — 60-second TTL, deduplicates API calls within same render
- **Backend slug cache:** `backendSlugCache` Map in `sitemap-data.mjs` (line 313) — per-build cache of backend slugs
- **No KV/Redis/Cloudflare cache** detected in the codebase

---

## 3. Dependencies & Libraries

### 3.1 Full Dependency Inventory

#### Framework / Core
| Package | Version | Used? |
|---|---|---|
| `next` | ^16.0.10 | ✅ Yes |
| `react` | ^19.2.3 | ✅ Yes |
| `react-dom` | ^19.2.3 | ✅ Yes |
| `sharp` | ^0.34.4 | ✅ Yes (Next.js image optimization) |

#### Styling
| Package | Version | Used? |
|---|---|---|
| `tailwindcss` | ^4 | ✅ Yes |
| `@tailwindcss/postcss` | ^4 | ✅ Yes |
| `tw-animate-css` | ^1.3.6 | ✅ Yes (imported in globals.css) |
| `tailwind-merge` | ^3.3.1 | ✅ Yes (via `cn()` utility) |
| `class-variance-authority` | ^0.7.1 | ✅ Yes (shadcn/ui components) |
| `clsx` | ^2.1.1 | ✅ Yes (via `cn()` utility) |

#### Icons
| Package | Version | Used? |
|---|---|---|
| `lucide-react` | ^1.8.0 | ✅ Yes — heavily used in Navbar, Footer, and other components |

**Icon usage pattern:** `import { BookOpen, ChevronDown, ... } from 'lucide-react'` — individual named imports. Used extensively in Navbar (20+ icons), Footer (4 icons), and other components.

#### UI Component Libraries
| Package | Version | Used? |
|---|---|---|
| `@radix-ui/react-dropdown-menu` | ^2.1.15 | ✅ Yes (via `ui/dropdown-menu.jsx`) |
| `@radix-ui/react-scroll-area` | ^1.2.10 | ✅ Yes (via `ui/scroll-area.jsx`) |
| `@radix-ui/react-slot` | ^1.2.3 | ✅ Yes (via `ui/button.jsx`) |

**Note:** `@heroicons/react` is listed in `next.config.mjs` `optimizePackageImports` (line 197) but **no import of `@heroicons/react` was found anywhere in `src/`**. This is either unused or was used previously and removed.

#### Data / Fetching
| Package | Version | Used? |
|---|---|---|
| (none beyond native fetch) | — | All API calls use native `fetch()` or axios-like `apiClient` |

#### SEO / Meta
| Package | Version | Used? |
|---|---|---|
| `sitemap` | ^9.0.0 | ✅ Yes (sitemap generation) |

#### Build Tooling
| Package | Version | Used? |
|---|---|---|
| `eslint` | ^9 | ✅ Yes |
| `@eslint/eslintrc` | ^3 | ✅ Yes |
| `eslint-config-next` | 15.4.5 | ✅ Yes |
| `rimraf` | ^6.1.3 | ✅ Yes (cache clearing scripts) |

#### Cloudflare / OpenNext
No `@opennextjs/cloudflare` or any Cloudflare-specific packages found in `package.json`. The project is currently on Vercel (per `vercel.json` and `next.config.mjs` references).

### 3.2 Potentially Unused Dependencies

| Package | Evidence |
|---|---|
| `@heroicons/react` | Listed in `next.config.mjs` `optimizePackageImports` but **no import found** in any `src/` file. Not in `package.json` dependencies either — it's only referenced in config. |

### 3.3 Node / Next.js Versions

- **Next.js:** ^16.0.10 (very recent)
- **React:** ^19.2.3
- **Node:** v23.3.0 (from runtime)

---

## 4. SEO Files & Metadata

### 4.1 SEO Files

| File | Path | Status |
|---|---|---|
| `robots.txt` | `public/robots.txt` | ✅ Present. Allows all, blocks `/api/admin/`, `/api/internal/`, `/api/auth/`, `/performance`, `/install`, and query params. Sitemap points to `https://nameverse.site/sitemap.xml`. |
| `sitemap.xml` | `public/sitemap.xml` + dynamic route `src/app/sitemap.xml/route.js` | ✅ Dynamic sitemap index. Generated by `src/lib/seo/sitemap-data.mjs`. Splits into sub-sitemaps by type (pages, names, blog, popularity, letter, origin, category, gender). Validates slugs against backend. |
| `sitemap-blog.xml` | `src/app/sitemap-blog.xml/route.js` | ✅ Blog-specific sitemap route |
| `manifest.json` | `public/manifest.json` | ✅ PWA manifest with `name`, `short_name`, `icons`, `shortcuts`, `theme_color: #4F46E5` |
| `favicon.ico` | `public/favicon.ico` | ✅ Present |
| `logo.svg` | `public/logo.svg` | ✅ Used as SVG favicon and apple-touch-icon |
| `ads.txt` | `public/ads.txt` | ✅ Present |

### 4.2 Metadata Setup

**Root layout** (`src/app/layout.js`):
- Uses `metadata` export (Next.js Metadata API)
- Title template: `"%s | NameVerse"`
- Default title: `"Baby Names, Meanings, Origins & Lucky Numbers | NameVerse"`
- Description: Long-form description of site purpose
- Open Graph: title, description, image (`/og-home.png`), type `website`
- Twitter: `summary_large_image` card
- Canonical: `siteUrl` (root)
- `metadataBase` set to `siteUrl`

**Homepage** (`src/app/page.js`):
- Overrides root metadata with same title/description
- Adds `keywords` array, `robots` directive, `authors`, `creator`, `publisher`
- OG and Twitter tags with custom image
- Adds `article:published_time` and `article:modified_time` in `other`

**Name detail pages** (`src/app/names/[religion]/[slug]/page.jsx`):
- Uses `generateMetadata()` function that calls `generateNamePageMetadata()` from `src/lib/seo/name-page-seo.jsx`
- Dynamically generates title, description, canonical URL, OG tags per name
- Canonical URL built via `nameAbsoluteUrl(religion, slug)` from `src/lib/seo/url-builder`

**Names listing** (`src/app/names/page.jsx`):
- Static `metadata` export with canonical set to `${getSiteUrl()}/names`
- OG tags with custom title/description

**Canonical URL logic:**
- `src/lib/seo/site.js` provides `canonicalUrl(path)` which strips query params
- `src/lib/seo/meta-helpers.jsx` provides `generateCanonicalUrl(path, baseUrl)` — normalizes path, removes query params, ensures no trailing slash
- `src/lib/seo/url-builder.js` provides `nameAbsoluteUrl(religion, slug)` for name pages
- Middleware (`middleware.js`) normalizes URLs in a single pass: lowercase, remove trailing slash, collapse double slashes, redirect non-canonical religion names

### 4.3 Structured Data / JSON-LD

| Page Type | Schema Types | Source |
|---|---|---|
| **Root layout** (all pages) | `Organization`, `WebSite`, `BreadcrumbList`, `CollectionPage` | `StructuredData` component in `layout.js` |
| **Homepage** | `WebSite`, `Organization`, `WebPage`, `FAQPage` (5 Q&A), `BreadcrumbList`, `ItemList` (12 trending names) | Inline JSON-LD in `page.js` |
| **Name detail** | `Dataset`, `WebPage`, `Article`, `DefinedTerm`, `ScholarlyArticle`, `FAQPage`, `BreadcrumbList` | `generateNamePageSchemas()` in `name-page-seo.jsx` |
| **Names listing** | `FAQPage` (6 Q&A) | Inline JSON-LD in `names/page.jsx` |

**Gap:** Blog pages, gender listing pages, and utility pages do not appear to have page-specific structured data beyond what the root layout provides.

### 4.4 Image Alt Text

- `src/app/layout.js` line 67: OG image has `alt` text
- `src/components/Navbar/Navbar.jsx`: Logo uses text "N" in a gradient div — no `<img>` tags
- `src/components/Footer/Footer.jsx`: No `<img>` tags
- `src/components/Blog/BlogImageWithFallback.jsx`: Likely has alt text (not fully audited)
- **Spot check:** No obvious missing alt text on `<img>` tags, but the site uses very few actual `<img>` elements — most visuals are CSS gradients, SVG inline, or emoji.

### 4.5 Sitemap Details

- Dynamic sitemap generated by `src/lib/seo/sitemap-data.mjs` (594 lines)
- Splits into sub-sitemaps: pages, names, blog, popularity, letter, origin, category, gender
- Validates every name slug against the backend API before including in sitemap
- Caps collection pages at 50 to prevent thin pages
- Static routes validated against actual page files (build-time guard)
- Sitemap served via `src/app/sitemap.xml/route.js` with 1-hour cache, 1-day stale-while-revalidate

---

## 5. Gaps & Opportunities

### 5.1 Design System Standardization

1. **Dark mode toggle is broken.** The Navbar has a manual dark/light toggle that adds/removes a `.dark` class on `<html>`, but `globals.css` only uses `@media (prefers-color-scheme: dark)` — it does NOT respond to the `.dark` class. The toggle is non-functional.

2. **Inconsistent color usage.** The CSS custom property system (`--nv-*` tokens) is defined but many components bypass it with hardcoded Tailwind colors:
   - Religion-specific pages use emerald/blue/orange hardcoded colors
   - Navbar uses `bg-blue-50`, `text-blue-700`, `bg-slate-950`
   - Footer uses `bg-indigo-500 to-purple-600`
   - Names listing page uses purple (`bg-purple-500`, `border-purple-300`) — not in the palette
   - Two different `theme-color` values: `#1E40AF` (layout.js line 104) vs `#4F46E5` (layout.js line 114)

3. **One-off font sizes.** The Navbar uses `text-[10px]`, `text-[11px]`, `text-[9px]` — arbitrary values outside the Tailwind type scale.

4. **One-off border radius.** Footer uses `rounded-[2rem]` — not in the standard radius set.

### 5.2 SEO Metadata Gaps

5. **Blog pages lack page-specific structured data.** The root layout provides Organization/WebSite/BreadcrumbList schemas, but blog post pages don't have `Article` or `BlogPosting` schema markup.

6. **Gender listing pages lack page-specific metadata.** Pages like `/islamic/boy-names` and `/christian/girl-names` don't have their own `generateMetadata` — they inherit the root layout's generic title/description.

7. **Canonical URL for homepage is set to `siteUrl` in root layout** but the homepage page.js also sets its own canonical. This is redundant but not harmful.

8. **`robots.txt` sitemap URL hardcoded** to `https://nameverse.site/sitemap.xml` — if the domain changes (e.g., to Cloudflare), this must be updated.

### 5.3 Dependency Issues

9. **`@heroicons/react` referenced in `next.config.mjs`** `optimizePackageImports` but not installed in `package.json` and no imports found in source. This is a dead config entry.

10. **No Cloudflare/OpenNext packages** in `package.json` despite migration plans mentioned in the task context.

### 5.4 Data-Fetching Efficiency

11. **`serverFetchRelatedNames()` and `serverFetchSimilarNames()` are broken.** Both functions in `server-fetch.js` (lines 361, 385) hardcode the API URL to `/api/names/religion/islamic/1/related` and `/api/names/religion/islamic/1/similar` respectively, completely ignoring the `religion` and `slug` parameters. This means every name page shows the same related/similar names.

12. **365-day ISR revalidation** on all content pages means name data changes (new names, updated meanings) won't appear for up to a year. Consider a shorter revalidation window or on-demand revalidation.

13. **Duplicate data sources.** The project has both `public/data/*.json` (small sets, ~855 total) and `public/*_extracted.json` (~41,900 total) plus `public/*_names.json` (string-only arrays). The `generateStaticParams` in `page.jsx` reads from all three, creating potential for duplicate slug generation.

14. **Legacy API endpoints still in use.** `fetchNamesLegacy`, `fetchFiltersLegacy`, `fetchNameDetailLegacy` in `src/lib/api/names.js` are marked `@deprecated` but still present. The server-fetch module also falls back to the legacy endpoint.

### 5.5 Other Issues

15. **`clsx` and `tailwind-merge` are both installed** but `cn()` utility likely only uses `tailwind-merge`. `clsx` may be unused directly (check `src/lib/utils/cn.js`).

16. **No testing framework** in `package.json` — no Jest, Vitest, Playwright, or Cypress.

17. **`eslint-config-next` version mismatch:** `15.4.5` in devDependencies but `next` is `^16.0.10`. The ESLint config may be incompatible with Next.js 16.

---

*End of audit report. This is a read-only analysis — no code was modified.*
