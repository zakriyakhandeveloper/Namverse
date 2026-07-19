import fs from 'node:fs';
import path from 'node:path';
import { buildExpectedUrls, parseSitemapUrls } from '../src/lib/seo/sitemap-data.mjs';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function parseIndex(xml) {
  const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
  const urls = [];
  for (const loc of locs) {
    if (loc.includes('/sitemap-') && loc.endsWith('.xml')) {
      const file = path.basename(new URL(loc).pathname);
      urls.push(...parseSitemapUrls(readText(path.join(publicDir, file))));
    } else {
      urls.push(loc);
    }
  }
  return urls;
}

const expected = new Set(buildExpectedUrls().map((url) => `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.site'}${url}`));
const sitemapXml = readText(path.join(publicDir, 'sitemap.xml'));
const sitemapUrls = sitemapXml.includes('<sitemapindex') ? parseIndex(sitemapXml) : parseSitemapUrls(sitemapXml);
const actual = new Set(sitemapUrls);
const missing = Array.from(expected).filter((url) => !actual.has(url)).sort();
const orphan = Array.from(actual).filter((url) => !expected.has(url)).sort();
const duplicates = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
const report = {
  generatedAt: new Date().toISOString(),
  expectedUrlCount: expected.size,
  sitemapUrlCount: actual.size,
  missingCount: missing.length,
  orphanCount: orphan.length,
  duplicateCount: duplicates.length,
  missing,
  orphan,
  duplicates: Array.from(new Set(duplicates)).sort(),
  passed: missing.length === 0 && orphan.length === 0 && duplicates.length === 0,
};
fs.writeFileSync(path.join(rootDir, 'seo-sitemap-validation-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ passed: report.passed, expectedUrlCount: report.expectedUrlCount, sitemapUrlCount: report.sitemapUrlCount, missingCount: report.missingCount, orphanCount: report.orphanCount, duplicateCount: report.duplicateCount }, null, 2));
if (!report.passed) process.exitCode = 1;
