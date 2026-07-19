/**
 * NameVerse SEO Meta System (FULL UPGRADE)
 * Goals:
 * - Fix duplicate canonical issues
 * - Improve indexing quality
 * - Reduce template detection
 * - Increase CTR stability
 * - Control crawl budget waste
 */

import { getSiteUrl } from '@/lib/seo/site';

/* -----------------------------------
   CONFIG
----------------------------------- */
const SITE_NAME = 'NameVerse';
const DEFAULT_TITLE = 'NameVerse — Cultural Name Knowledge Base';

const CHAR_LIMIT_TITLE = 60;
const CHAR_LIMIT_DESC = 300;

/* -----------------------------------
   SAFE TEXT UTIL
----------------------------------- */
function cleanText(text = '') {
  return String(text)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '');
}

/* -----------------------------------
   TITLE VALIDATION (CTR OPTIMIZED)
----------------------------------- */
export function validateMetaTitle(title) {
  const t = cleanText(title);

  if (!t) return DEFAULT_TITLE;

  if (t.length <= CHAR_LIMIT_TITLE) return t;

  const cut = t.substring(0, CHAR_LIMIT_TITLE - 3);
  const lastSpace = cut.lastIndexOf(' ');

  return lastSpace > 10
    ? `${cut.substring(0, lastSpace)}...`
    : `${cut}...`;
}

/* -----------------------------------
   DESCRIPTION VALIDATION (ANTI-TEMPLATE)
----------------------------------- */
export function validateMetaDescription(description) {
  let d = cleanText(description);

  if (!d) {
    return `${SITE_NAME} provides structured cultural and linguistic analysis of personal names across civilizations.`;
  }

  // prevent thin content
  if (d.length < 140) {
    d += ` Explore ${SITE_NAME} for linguistic origin, cultural meaning, and historical naming patterns.`;
  }

  // enforce max limit
  if (d.length > CHAR_LIMIT_DESC) {
    d = d.substring(0, CHAR_LIMIT_DESC - 3) + '...';
  }

  return d;
}

/* -----------------------------------
   CANONICAL URL SYSTEM (FIXED)
----------------------------------- */
function normalizePath(path = '') {
  if (!path) return '';

  // external URL → return as-is
  if (/^https?:\/\//i.test(path)) return path;

  let p = cleanText(path);

  // REMOVE query params (CRITICAL FIX FOR DUPLICATE INDEXING)
  p = p.split('?')[0];

  // fix multiple slashes
  p = p.replace(/\/+/g, '/');

  // ensure leading slash
  if (!p.startsWith('/')) p = '/' + p;

  return p;
}

export function generateCanonicalUrl(path, baseUrl) {
  const base = (baseUrl || getSiteUrl()).replace(/\/+$/, '');
  const cleanPath = normalizePath(path);

  return `${base}${cleanPath}`;
}

/* -----------------------------------
   OG URL (SAFE)
----------------------------------- */
export function generateOgUrl(path = '/logo.svg') {
  return generateCanonicalUrl(path);
}

/* -----------------------------------
   META DESCRIPTION GENERATOR (UPGRADED)
   → removes template footprint
   → adds variation logic
----------------------------------- */
export function generateNameMetaDescription(data) {
  const name = cleanText(data.name || 'this name');
  const religion = cleanText(data.religion || 'cultural');
  const gender = cleanText(data.gender || 'personal');
  const meaning = cleanText(data.short_meaning || 'cultural significance');
  const origin = cleanText(data.origin || 'diverse linguistic traditions');

  const variants = [
    `${name} is a ${gender} name from ${origin} tradition meaning "${meaning}".`,
    `${name} originates from ${origin} cultural background with the meaning "${meaning}".`,
    `The name ${name} reflects ${religion} naming traditions and means "${meaning}".`,
    `${name} is associated with ${origin} heritage and carries the meaning "${meaning}".`,
  ];

  // stable but non-predictable selection
  let hash = 0;
  const key = name + religion;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  let desc = variants[hash % variants.length];

  return validateMetaDescription(desc);
}

/* -----------------------------------
   META TITLE CLEANER (OPTIONAL USE)
----------------------------------- */
export function generateSafeTitle(name, suffix = 'Name Meaning') {
  return validateMetaTitle(`${name} ${suffix}`);
}

/* -----------------------------------
   KEY SEO RULE HELPERS (IMPORTANT)
----------------------------------- */

/**
 * Use this BEFORE indexing a page (VERY IMPORTANT for your 75K pages)
 */
export function shouldIndexPage(data) {
  const name = data?.name;
  const meaning = data?.short_meaning;

  if (!name || name.length < 2) return false;
  if (!meaning || meaning.length < 30) return false;

  return true;
}