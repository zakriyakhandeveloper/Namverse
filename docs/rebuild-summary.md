# NameVerse UI Rebuild — Summary

## What was done

### Phase 1: Design Token System

**`src/app/globals.css`** — Rewritten with a centralized `@theme` block defining all design tokens:

| Token | Light | Dark |
|---|---|---|
| `--nv-base` | `#FAFBFC` | `#0B1120` |
| `--nv-surface` | `#FFFFFF` | `#131C2E` |
| `--nv-surface-subtle` | `#F1F5F9` | `#1A2744` |
| `--nv-border` | `#E2E8F0` | `#1E2A45` |
| `--nv-text` | `#0B1420` | `#F1F5F9` |
| `--nv-text-secondary` | `#475569` | `#94A3B8` |
| `--nv-text-muted` | `#94A3B8` | `#64748B` |
| `--nv-primary` | `#1E3A5F` | `#3B82F6` |
| `--nv-accent` | `#2563EB` | `#60A5FA` |
| `--nv-accent-subtle` | `#EFF6FF` | `#1E3A5F` |

**Dark mode fix:** Changed from `@media (prefers-color-scheme: dark)` to `.dark` class selector. This fixes the manual toggle that was broken because the CSS only responded to system preference.

**`src/app/layout.js`** — Font swap: `Instrument_Sans` → `Inter` (one font file, better Arabic/Urdu support). Theme color unified to `#1E3A5F`.

**`public/manifest.json`** — Theme color updated to `#1E3A5F`, background to `#FAFBFC`.

### Phase 2: Component Rebuild

**Navbar** — All hardcoded colors replaced with token references. Logo box: `from-indigo-500 to-purple-600` gradient → `bg-nv-primary` (deep navy). One-off font sizes (`text-[10px]`, `text-[11px]`, `text-[9px]`) → `text-xs`, `text-sm`. Dark mode toggle fixed.

**Footer** — Same treatment. Logo gradient → `bg-nv-primary`. `rounded-[2rem]` → `rounded-xl`. All borders/shadows/radius → token system.

**Names listing page (`/names`)** — **Removed the 3-color system entirely.** No more `bg-emerald-50` / `bg-blue-50` / `bg-orange-50` per religion. No more `from-emerald-600 via-blue-600 to-orange-600` gradient. All cards use `bg-nv-surface` with `border-nv-border`. Religion differentiation is now via emoji icons + labels only — same visual language, same accent color everywhere.

### Phase 3: Dependency Diet

Removed 6 unused dependencies:

| Package | Reason |
|---|---|
| `clsx` | Not imported anywhere in src/ |
| `tailwind-merge` | Only used by `cn.js` which was dead code |
| `class-variance-authority` | Not imported anywhere |
| `@radix-ui/react-dropdown-menu` | Not imported anywhere |
| `@radix-ui/react-scroll-area` | Not imported anywhere |
| `@radix-ui/react-slot` | Not imported anywhere |

Also removed the dead `src/lib/utils/cn.js` file.

### Phase 5: SEO Fixes

**`GoogleBotMeta.jsx`** — Fixed `rel="alternate"` → `rel="sitemap"` for the sitemap link tag. Removed duplicate `<meta name="robots">` (already set via layout.js `robots` export). Removed `Accept-CH` meta (deprecated). Removed `yandex` meta (unnecessary).

## What's still pending

- **Phase 2: Name detail page** — The individual name pages still use the old 3-color system and hardcoded values
- **Phase 4: Performance audit** — Need to run Lighthouse and check Core Web Vitals after build
- **Remaining components** — Other pages (search, blog, etc.) still use hardcoded colors
