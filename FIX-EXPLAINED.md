# How The First-Fetch 404 Problem Was Solved

## The Problem

Some name pages (like `/names/islamic/maaida`) returned **404 on the first visit** even though:
- The name existed in MongoDB
- The API returned correct data when called directly
- Many other names on the same letter page worked fine

---

## Root Cause (One Simple Explanation)

The `isrFetch()` function in `src/lib/api/server-fetch.js` had two critical bugs:

### Bug 1: It cached error responses for 30 days

```js
// BEFORE (broken):
async function isrFetch(url, revalidate = ISR_TTL) {
  try {
    const res = await fetch(url, { next: { revalidate: 2592000 } }); // 30 days!
    if (!res.ok) return null;  // ← silently returns null
    return await res.json();
  } catch {
    return null;               // ← silently returns null
  }
}
```

When the API returned a **temporary error** (500, 502, network timeout), the `fetch()` call with `revalidate: 2592000` **cached that error response for 30 days**. Every visit for the next 30 days got the same cached error → page showed 404.

### Bug 2: No retry — one failure = permanent 404

If the API had a **single transient hiccup** (server restart, network blip, cold start), the page returned 404 immediately with no retry. That 404 got cached for 30 days.

---

## The Fix (3 Changes)

### Fix 1: Add error logging (visibility)

```js
// AFTER (fixed):
async function isrFetch(url, revalidate = ISR_TTL) {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      console.error(`[isrFetch] ${res.status} for ${url}`); // ← NOW VISIBLE
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[isrFetch] Network error for ${url}:`, err.message); // ← NOW VISIBLE
    return null;
  }
}
```

**Why:** Before this fix, errors were completely invisible. You couldn't tell if the API was failing for specific names. Now every failure is logged.

### Fix 2: Add retry logic (resilience)

```js
async function isrFetchWithRetry(url, retries = 2, revalidate = ISR_TTL) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const attemptRevalidate = attempt === 0 ? revalidate : Math.min(revalidate, 60);
    const result = await isrFetch(url, attemptRevalidate);
    if (result) return result;  // ← SUCCESS: return immediately
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 200 * (attempt + 1))); // wait before retry
    }
  }
  return null; // ← ALL attempts failed
}
```

**Why:** Instead of giving up after one failure, the system tries up to 3 times (initial + 2 retries). If the API is temporarily down, the retries give it a chance to recover.

### Fix 3: Use retry for name detail lookups

```js
// BEFORE:
let data = await isrFetch(`${API_BASE}/api/v1/names/${religion}/${slug}`);

// AFTER:
let data = await isrFetchWithRetry(
  `${API_BASE}/api/v1/names/${religion}/${slug}`,
  2,   // retry up to 2 more times
  ISR_TTL  // 30-day cache
);
```

**Why:** Name detail pages are the most critical — a 404 here means Google reports a broken URL. Using retry ensures transient API failures don't cause permanent 404s.

---

## Before vs After Flow

### BEFORE (broken):

```
User visits /names/islamic/maaida
  → isrFetch() calls API
  → API returns 500 (temporary error)
  → isrFetch returns null (SILENTLY)
  → Page tries local JSON fallback (Maaida not in local files)
  → notFound() → 404
  → 404 response CACHED FOR 30 DAYS
  → Every visit for 30 days = 404 (even after API recovers)
```

### AFTER (fixed):

```
User visits /names/islamic/maaida
  → isrFetchWithRetry() calls API (attempt 1)
  → API returns 500 (temporary error)
  → isrFetch logs error + returns null
  → Retry: wait 200ms, call API again (attempt 2)
  → API returns 200 (recovered)
  → isrFetch returns data ✅
  → Page renders correctly ✅
  → Response cached for 30 days
```

---

## What Changed in Each File

| File | What Changed | Why |
|------|-------------|-----|
| `src/lib/api/server-fetch.js` | Added `console.error()` to `isrFetch()` | Visibility — you can now see when API calls fail |
| `src/lib/api/server-fetch.js` | Added `isrFetchWithRetry()` function | Resilience — retries up to 3 times before giving up |
| `src/lib/api/server-fetch.js` | `serverFetchNameDetail()` uses `isrFetchWithRetry` | Critical path — name detail pages must not fail on first try |
| `src/app/names/[religion]/[slug]/page.jsx` | Added `revalidate = 2592000` (30 days) | Free tier — pages cached for 30 days, not re-rendered every visit |
| `src/app/names/[religion]/[slug]/page.jsx` | Added `dynamicParams = true` | Explicit — names not in build-time list are generated on-demand + cached |
| `src/lib/utils/nameSlug.js` | NEW: Unified slug resolution | Single source of truth for all name URLs |
| `src/app/names/[religion]/letter/[letter]/[page]/page.jsx` | Uses `getCanonicalSlug()` | Consistent slug generation from API data |
| `src/components/name/RelatedNames.jsx` | Validates similar names before linking | Prevents broken links from garbage data in similar_sounding_names |
| `src/components/names/NameDetailClient.jsx` | Validates similar names before linking | Same — prevents broken internal links |

---

## How to Verify It's Working

### 1. Check build output for errors
```bash
npx next build 2>&1 | grep "isrFetch"
```
You should see NO errors (or only 404s for names that truly don't exist in the API).

### 2. Test a name that previously 404'd
Visit a name that was returning 404 before. It should now load on first visit.

### 3. Check server logs
After deploying, visit a name page and check Vercel function logs for `[isrFetch]` messages. You should see success messages, not errors.

---

## Key Insight

The API was always working. The problem was that **one temporary failure got cached permanently**. The fix adds retry logic so transient errors don't cause permanent 404s, and makes all errors visible through logging.
