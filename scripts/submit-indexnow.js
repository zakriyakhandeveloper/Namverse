import fs from 'node:fs';
import path from 'node:path';
import { submitIndexNowChanges } from '../src/lib/indexnow';

const apiKey = process.env.INDEXNOW_API_KEY;
const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.site';
const manifestPath = path.resolve('public/seo-sitemap-manifest.json');
const statePath = process.env.INDEXNOW_STATE_PATH || path.resolve('public/.indexnow-state.json');

if (!apiKey) {
  console.error('INDEXNOW_API_KEY is required');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const result = await submitIndexNowChanges(manifest.sitemaps || [], {
  apiKey,
  host,
  statePath,
  maxRetries: 3,
  batchSize: 50,
  rateLimitMs: 1500,
});
console.log(JSON.stringify(result, null, 2));
if (result.result.failed.length) process.exitCode = 1;
