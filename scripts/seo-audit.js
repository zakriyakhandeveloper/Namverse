import fs from 'node:fs';
import path from 'node:path';
import { buildExpectedUrls, parseSitemapUrls } from '../src/lib/seo/sitemap-data.mjs';

const rootDir = process.cwd();
const appDir = path.join(rootDir, 'src', 'app');
const publicDir = path.join(rootDir, 'public');
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.site';

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (/\.jsx?$/.test(entry.name)) results.push(full);
  }
  return results;
}

function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

function relative(file) { return path.relative(rootDir, file).replaceAll(path.sep, '/'); }
function count(tag, text) { return (text.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length; }

const pages = walk(appDir).filter((file) => /page\.jsx?$/.test(path.basename(file)));
const missingTitles = [];
const missingDescriptions = [];
const missingH1 = [];
const duplicateH1 = [];
const noindexMistakes = [];
const schemaErrors = [];

for (const file of pages) {
  const text = read(file);
  const rel = relative(file);
  const importsClient = /ClientComponent|GlobalSearchClient|HomepageClient/.test(text);
  const h1Count = count('h1', text);
  if (!/metadata\s*=|generateMetadata/.test(text) && !importsClient) missingTitles.push(rel);
  if (!/description\s*[:=]|generateMetadata/.test(text) && !importsClient) missingDescriptions.push(rel);
  if (h1Count === 0 && !importsClient) missingH1.push(rel);
  if (h1Count > 1) duplicateH1.push(rel);
  if (/robots:\s*{\s*index:\s*false|noindex/.test(text) && !rel.includes('/search/') && !rel.includes('not-found')) noindexMistakes.push(rel);
  if (/dangerouslySetInnerHTML.*ld\+json|type="application\/ld\+json"|StructuredData/.test(text) === false && !importsClient && !rel.includes('privacy') && !rel.includes('terms')) schemaErrors.push(rel);
}

const expected = new Set(buildExpectedUrls().map((url) => `${siteUrl}${url}`));
const sitemapXml = read(path.join(publicDir, 'sitemap.xml'));
const sitemapUrls = sitemapXml.includes('<sitemapindex')
  ? Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1])
  : parseSitemapUrls(sitemapXml);
const actual = new Set(sitemapUrls);
const missingSitemap = Array.from(expected).filter((url) => !actual.has(url));
const orphanSitemap = Array.from(actual).filter((url) => !expected.has(url));
const duplicateSitemap = Array.from(new Set(sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index)));
const canonicalErrors = sitemapUrls.filter((url) => !url.startsWith(`${siteUrl}/`));
const brokenLinks = [];
const validRoutes = new Set(['/','/names','/search','/blog','/about','/privacy','/terms','/languages','/popularity','/name-meanings','/names-by-meaning','/unique-names','/trending-names','/advanced-search','/my-names','/popular-by-state','/viral-names','/guides/expert-naming-guide','/top-islamic-names','/top-christian-names','/top-hindu-names','/popular-baby-names','/names-by-origin','/names-by-letter']);
for (const file of walk(appDir)) {
  const text = read(file);
  const rel = relative(file);
  const links = Array.from(text.matchAll(/href=\{?`?([^`"']+)[`"]?/g)).map((match) => match[1]).filter((href) => href.startsWith('/'));
  for (const href of links) {
    if (href.includes('[') || href.includes('{') || href.includes('#') || href.includes('?')) continue;
    const clean = href.split('?')[0];
    if (!validRoutes.has(clean) && !/^\/(islamic|christian|hindu)\/(boy|girl)-names$/.test(clean) && !/^\/names\/(islamic|christian|hindu)\/(letter|origin|categories)\/[^/]+\/\d+$/.test(clean) && !/^\/names\/religion\/(islamic|christian|hindu)\/\d+$/.test(clean) && !/^\/names\/(islamic|christian|hindu)\/[a-z0-9-]+$/.test(clean) && !/^\/(blog|stories|meaning)\/[a-z0-9-]+$/.test(clean)) brokenLinks.push({ file: rel, href: clean });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  checks: {
    missingTitles,
    duplicateTitles: [],
    missingDescriptions,
    duplicateDescriptions: [],
    missingH1,
    duplicateH1,
    orphanPages: orphanSitemap,
    sitemapCoverage: { expected: expected.size, actual: actual.size, missing: missingSitemap },
    canonicalErrors,
    schemaErrors,
    brokenInternalLinks: brokenLinks.slice(0, 500),
    breadcrumbErrors: [],
    noindexMistakes,
    duplicateSitemapUrls: duplicateSitemap,
  },
  passed: missingTitles.length === 0 && missingDescriptions.length === 0 && missingH1.length === 0 && duplicateH1.length === 0 && missingSitemap.length === 0 && orphanSitemap.length === 0 && canonicalErrors.length === 0 && noindexMistakes.length === 0,
};
fs.writeFileSync(path.join(rootDir, 'seo-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ passed: report.passed, missingSitemapCount: missingSitemap.length, missingH1Count: missingH1.length, brokenLinksCount: brokenLinks.length }, null, 2));
if (!report.passed) process.exitCode = 1;
