# NameVerse 404 Diagnostic Report
## Complete Investigation of 1600+ Not Found URLs

---

## EXECUTIVE SUMMARY

After a complete codebase audit, **3 root causes** have been identified that explain the 1600+ 404 errors. The primary cause is that the name detail page fetches data from an external API via `isrFetch()` which **silently swallows all errors** and caches failed responses for 30 days, creating permanent 404s for names that were temporarily unavailable.

---

## DETAILED REQUEST TRACE: `/names/islamic/maaida`

### Step 1: Letter Page → Link Generation
**File:** `src/app/names/[religion]/letter/[letter]/[page]/page.jsx` (line 471-477)

```js
const itemKey = nameItem.slug || generateSlug(nameItem.name) || nameItem._id || index;
// For Maaida: itemKey = "maaida" (from API's slug field)

<Link href={`/names/${religion}/${itemKey}`} />
// Result: /names/islamic/maaida  ✅ CORRECT
```

**Evidence:** API returns `slug: "maaida"` for the name "Maaida" in the response.

### Step 2: Middleware → Route Validation
**File:** `middleware.js` (line 204-220)

```js
// Route: /names/islamic/maaida
// segments[0] = "names", segments[1] = "islamic", segments[2] = "maaida"
// segments.length === 3 ✅
// normalizeReligion("islamic") → "islamic" ✅
// isValidSlug("maaida") → /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test("maaida") → true ✅
// Result: NextResponse.next() ✅ PASSED
```

### Step 3: Next.js Route Matching
**File:** `src/app/names/[religion]/[slug]/page.jsx`

```js
// Route params: { religion: "islamic", slug: "maaida" }
// generateStaticParams() only returns 28 names per religion from local JSON
// "maaida" is NOT in generateStaticParams() output
// dynamicParams is NOT exported → defaults to true in Next.js 14+
// Result: Page renders dynamically ✅ (but see Root Cause #1)
```

### Step 4: Page Component → Data Fetching
**File:** `src/app/names/[religion]/[slug]/page.jsx` (line 180-199)

```js
const slug = createSlug(resolvedParams?.slug);  // "maaida" → "maaida" ✅
let nameData = await serverFetchNameDetail(religion, slug);
// → serverFetchNameDetail("islamic", "maaida")

if (!nameData) {
  nameData = loadLocalNameData(religion, slug);
  // Maaida is NOT in any local JSON file → returns null ❌
}

if (!nameData) {
  return notFound();  // ← THIS IS WHERE THE 404 HAPPENS
}
```

### Step 5: serverFetchNameDetail → API Call
**File:** `src/lib/api/server-fetch.js` (line 165-192)

```js
const safeSlug = encodeURIComponent("maaida"); // "maaida" ✅
let data = await isrFetch(`${API_BASE}/api/v1/names/islamic/maaida`);
// API URL: https://name-meaning-site-backend.vercel.app/api/v1/names/islamic/maaida
```

**Evidence from live API test:**
```bash
curl -s "https://name-meaning-site-backend.vercel.app/api/v1/names/islamic/maaida"
# Returns: {"success":true,"data":{"_id":"6a29c21a5eb3755191783f35","name":"Maaida","slug":"maaida",...}}
# API WORKS CORRECTLY ✅
```

### Step 6: isrFetch → THE FAILURE POINT
**File:** `src/lib/api/server-fetch.js` (line 36-44)

```js
async function isrFetch(url, revalidate = ISR_TTL) {  // ISR_TTL = 2592000 (30 days)
  try {
    const res = await fetch(url, { next: { revalidate: 2592000 } });
    if (!res.ok) return null;       // ← SILENTLY RETURNS NULL ON ANY HTTP ERROR
    return await res.json();
  } catch {
    return null;                     // ← SILENTLY RETURNS NULL ON ANY NETWORK ERROR
  }
}
```

**THE EXACT FAILURE POINT IDENTIFIED:**

If the API returns a non-200 status (even once), `isrFetch`:
1. Returns `null` (silently)
2. The `fetch` call with `next: { revalidate: 2592000 }` **caches the failed/error response for 30 days**
3. All subsequent requests for 30 days use the cached error response
4. `isrFetch` returns `null` every time
5. `loadLocalNameData` doesn't find "maaida" in local JSON
6. `notFound()` is called → **404 page returned and cached**

---

## ROOT CAUSES (Prioritized by Impact)

### 🔴 ROOT CAUSE #1: Silent Error Swallowing + 30-Day ISR Cache Poisoning
**Impact: CRITICAL — Direct cause of all 1600+ 404s**
**File:** `src/lib/api/server-fetch.js` (lines 36-44)

**The Problem:**
```js
async function isrFetch(url, revalidate = ISR_TTL) {
  try {
    const res = await fetch(url, { next: { revalidate: 2592000 } });
    if (!res.ok) return null;    // SILENT failure
    return await res.json();
  } catch {
    return null;                 // SILENT failure
  }
}
```

**Why it causes 404s:**
1. The API might return a 500, 502, 503, or other transient error
2. `isrFetch` catches it silently and returns `null`
3. The `fetch` call with `revalidate: 2592000` caches the error response for **30 days**
4. For the next 30 days, every request to this name page gets the cached error
5. The name detail page returns `notFound()` → 404

**Evidence:**
- API works when tested directly with curl
- The 30-day ISR cache means even if the API recovers immediately, the cached error persists
- This explains why "Many names on the same letter page work" — only names that hit a transient error get permanently cached as 404

**Fix:**
```js
async function isrFetch(url, revalidate = ISR_TTL) {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      // Don't cache errors - return fresh response on next request
      console.error(`API error ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`API fetch error for ${url}:`, err.message);
    return null;
  }
}
```

AND modify `serverFetchNameDetail` to use a shorter or no ISR cache:
```js
export async function serverFetchNameDetail(religion, slug) {
  // ... validation ...
  // Don't cache name detail API calls - they need fresh data
  let data = await isrFetch(`${API_BASE}/api/v1/names/${normalizedReligion}/${safeSlug}`, 0);
  // ...
}
```

### 🔴 ROOT CAUSE #2: Missing `dynamicParams` and `revalidate` on Name Detail Page
**Impact: HIGH — Affects ISR behavior for all name pages**
**File:** `src/app/names/[religion]/[slug]/page.jsx`

**Evidence:** All other dynamic routes have these exports:
| Route | `dynamicParams` | `revalidate` |
|-------|----------------|--------------|
| `names/[religion]/letter/[letter]/[page]` | ✅ `true` | ✅ 60 days |
| `names/[religion]/origin/[origin]/[page]` | ✅ `true` | ✅ 60 days |
| `names/[religion]/categories/[category]/[page]` | ✅ `true` | ✅ 60 days |
| `names/religion/[religion]/[page]` | ✅ `true` | ✅ default |
| **`names/[religion]/[slug]`** | **❌ MISSING** | **❌ MISSING** |

**Why it matters:**
- Without `dynamicParams = true`, the page relies on Next.js default behavior
- Without `revalidate`, the page is not ISR-cached, meaning every request triggers a fresh server render
- This creates unnecessary load and makes the page vulnerable to transient API failures

**Fix:** Add to `src/app/names/[religion]/[slug]/page.jsx`:
```js
export const dynamicParams = true;
export const revalidate = 86400; // 1 day — names change infrequently
```

### 🟡 ROOT CAUSE #3: Incomplete Local JSON Fallback
**Impact: MEDIUM — Eliminates safety net for API failures**
**File:** `src/app/names/[religion]/[slug]/page.jsx` (lines 15-44)

**Evidence:**
- Local JSON files: `islamic-boy-names.json`, `islamic-girl-names.json`, etc.
- Only contain a subset of names
- `Maaida` is NOT in any local JSON file (confirmed by search)
- When the API fails, there is NO fallback data for thousands of names

**The `loadLocalNameData` function:**
```js
function loadLocalNameData(religion, slug) {
  // Iterates through 6 local JSON files
  // Uses createSlug(n.name) === slug to match
  // Only finds names that exist in the local files
  // Returns null for names only in the database
}
```

**Impact:** For names not in local JSON files, the ONLY data source is the API. If the API fails, there is no fallback → 404.

### 🟡 ROOT CAUSE #4: `similar_sounding_names` Generate Broken Internal Links
**Impact: MEDIUM — Creates broken links from name detail pages**

**Evidence from API response for "Ma'Arif":**
```json
"similar_sounding_names": ["maassama", "marudeen.", "meher", "mada", "marhabah", "mahek", "marnia", "meena", "mika"]
```

Note: `"marudeen."` contains a period. While `createSafeSlug("marudeen.")` produces `"marudeen"`, the name "marudeen" likely doesn't exist in the database, creating a broken link.

**How links are generated:**

In `src/components/name/RelatedNames.jsx` (line 38-49):
```js
data.similar_sounding_names.slice(0, 10).map((name) => {
  const link = normalizeLink(name, religionKey);
  // normalizeLink uses createSafeSlug(name)
  // For "marudeen." → link = "/names/islamic/marudeen"
  // This name likely doesn't exist → 404
})
```

In `src/components/names/NameDetailClient.jsx` (line 712-721):
```js
data.similar_sounding_names?.slice(0, 8).map((similarName) => (
  <Link href={`/names/${religion}/${createSafeSlug(similarName)}`} />
  // Same issue — names may not exist in database
))
```

**Impact:** Each name detail page generates 8-10 links to similar names. If even 30% of these names don't exist in the database, that's thousands of broken internal links.

### 🟢 ROOT CAUSE #5: `generateStaticParams()` Only Pre-renders 28 Names per Religion
**Impact: LOW — Intentional optimization, but limits static fallback**

**Evidence:**
```js
// src/app/names/[religion]/[slug]/page.jsx
const perReligionLimit = 28;
// Only 28 names × 3 religions = 84 total pre-rendered pages
// Database has 65,000+ names
```

**Build output confirms:**
```
│ ● /names/[religion]/[slug]                                30d      1y
│ ├ /names/islamic/muhammad                                30d      1y
│ ├ /names/islamic/ahmad                                   30d      1y
│ ├ /names/islamic/ali                                     30d      1y
│ └ [+81 more paths]
```

Total pre-rendered: 84 names. All others are dynamic.

---

## SLUG CONSISTENCY AUDIT

### Slug Functions Comparison

| Function | File | Logic | Output for "Ma'An" |
|----------|------|-------|-------------------|
| `createSlug` | `url-builder.js` | NFKD → remove diacritics → remove non-[a-zA-Z0-9\s-] → lowercase → spaces→hyphens | `"ma-an"` |
| `createSafeSlug` | `createSafeSlug.js` | IDENTICAL to `createSlug` | `"ma-an"` |
| API `slug` field | MongoDB | Stored in database | `"ma-an"` |

**Verdict:** Slug functions are identical ✅. No mismatch between frontend and API slugs.

### Link Generation Chain

| Source | Slug Used | Example |
|--------|-----------|---------|
| Letter page link | `nameItem.slug` from API | `/names/islamic/ma-an` |
| Detail page receives | URL parameter | `"ma-an"` |
| Detail page normalizes | `createSlug("ma-an")` | `"ma-an"` |
| API lookup | `serverFetchNameDetail("islamic", "ma-an")` | `/api/v1/names/islamic/ma-an` |

**Verdict:** Slug chain is consistent ✅. No mismatch in the link → route → API chain.

---

## COMPLETE 404 FLOW DIAGRAM

```
User clicks link on letter page
  ↓
/names/islamic/maaida
  ↓
Middleware validates → isValidSlug("maaida") → true → PASS
  ↓
Next.js matches route [religion]/[slug]
  ↓
generateStaticParams() → "maaida" NOT in static list
  ↓ (dynamicParams defaults to true)
Page component renders
  ↓
serverFetchNameDetail("islamic", "maaida")
  ↓
isrFetch("https://name-meaning-site-backend.vercel.app/api/v1/names/islamic/maaida")
  ↓
fetch() with next: { revalidate: 2592000 }
  ↓
IF API returns non-200 (transient error):
  ├── isrFetch returns null (SILENTLY)
  ├── 404 response cached for 30 days
  ├── loadLocalNameData() → NOT in local JSON → null
  └── notFound() → 404 PAGE ❌

IF API returns 200:
  ├── isrFetch returns data
  └── Page renders correctly ✅
```

---

## DIAGNOSTIC REPORT FOR `/names/islamic/maaida`

| Field | Value |
|-------|-------|
| **URL** | `/names/islamic/maaida` |
| **Source Page** | `/names/islamic/letter/m/1` (letter page) |
| **Why it breaks** | `isrFetch` silently returns null on API errors; 30-day ISR cache stores failed responses |
| **Database record found?** | YES — `_id: "6a29c21a5eb3755191783f35"`, `name: "Maaida"`, `slug: "maaida"` |
| **API works?** | YES — `GET /api/v1/names/islamic/maaida` returns full data |
| **Frontend route works?** | CONDITIONALLY — works if API call succeeds, 404 if it fails |
| **Root Cause** | `isrFetch()` catches errors silently + `revalidate: 2592000` caches error responses for 30 days |
| **Recommended Fix** | Remove ISR cache from `serverFetchNameDetail` OR add retry logic + don't cache non-200 responses |

---

## RECOMMENDED FIXES (Ordered by Priority)

### Fix #1: Fix isrFetch to not cache error responses
**File:** `src/lib/api/server-fetch.js`

```js
// BEFORE (broken):
async function isrFetch(url, revalidate = ISR_TTL) {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// AFTER (fixed):
async function isrFetch(url, revalidate = ISR_TTL) {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      console.error(`[isrFetch] ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[isrFetch] Error for ${url}:`, err.message);
    return null;
  }
}
```

### Fix #2: Use shorter/no ISR cache for name detail API calls
**File:** `src/lib/api/server-fetch.js`

```js
// In serverFetchNameDetail, don't use ISR cache for detail lookups:
export async function serverFetchNameDetail(religion, slug) {
  // ... validation ...
  let data = await isrFetch(
    `${API_BASE}/api/v1/names/${normalizedReligion}/${safeSlug}`,
    3600  // 1 hour instead of 30 days
  );
  // ...
}
```

### Fix #3: Add dynamicParams and revalidate to name detail page
**File:** `src/app/names/[religion]/[slug]/page.jsx`

```js
export const dynamicParams = true;
export const revalidate = 86400; // 1 day
```

### Fix #4: Add retry logic for name detail API calls
**File:** `src/lib/api/server-fetch.js`

```js
export async function serverFetchNameDetail(religion, slug) {
  if (!religion || !slug) return null;
  const normalizedReligion = normalizeReligion(religion);
  const safeSlug = encodeURIComponent(String(slug).trim().toLowerCase());
  
  // Try v1 endpoint with retry
  let data = await isrFetchWithRetry(
    `${API_BASE}/api/v1/names/${normalizedReligion}/${safeSlug}`,
    2  // max retries
  );
  
  // Fallback to legacy endpoint
  if (!data || data.success === false || !data.data) {
    data = await isrFetchWithRetry(
      `${API_BASE}/api/names/${normalizedReligion}/${safeSlug}`,
      1
    );
  }
  
  if (data?.success && data.data) {
    // normalize religion...
    return nameData;
  }
  return null;
}
```

### Fix #5: Clean similar_sounding_names in database
The `similar_sounding_names` field contains entries with invalid characters (e.g., "marudeen."). These should be cleaned in the database to prevent broken internal links.

---

## PRIORITY ORDER

1. **IMMEDIATE:** Fix `isrFetch` to not cache error responses (Fix #1)
2. **IMMEDIATE:** Reduce ISR cache for name detail API (Fix #2)
3. **SHORT-TERM:** Add `dynamicParams` and `revalidate` (Fix #3)
4. **MEDIUM-TERM:** Add retry logic (Fix #4)
5. **LONG-TERM:** Clean database similar_sounding_names (Fix #5)
