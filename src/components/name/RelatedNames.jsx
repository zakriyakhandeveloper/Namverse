import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';
import { createSlug, isValidSlug } from '@/lib/seo/url-builder';

const normalizeLink = (name, religion) => {
  if (!name || typeof name !== 'string') return null;
  const cleaned = name.trim();
  if (cleaned.length < 2) return null;
  const segment = createSlug(cleaned);
  if (!segment || !isValidSlug(segment)) return null;
  if (/^\d+$/.test(segment)) return null;
  const rel = (religion || 'islamic').toLowerCase();
  return `/names/${rel}/${segment}`;
};

function cleanName(value) {
  if (!value) return '';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

export default function RelatedNames({ data }) {
  const religionKey = data.religion?.toLowerCase() || 'islamic';
  const similarNames = Array.isArray(data.similar_sounding_names) ? data.similar_sounding_names : [];
  const variations = Array.isArray(data.name_variations) ? data.name_variations : [];
  const relatedNames = Array.isArray(data.related_names) ? data.related_names : [];
  const hasSimilar = similarNames.length > 0;
  const hasVariations = variations.length > 0;
  const hasRelated = relatedNames.length > 0;

  if (!hasSimilar && !hasVariations && !hasRelated) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]" aria-labelledby="similar-names-heading">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
          <LinkIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 id="similar-names-heading" className="nv-display text-xl font-semibold text-[color:var(--nv-ink)]">Similar Names</h2>
          <p className="mt-1 text-sm text-[color:var(--nv-muted)]">Explore names with the same sound, spelling, or origin.</p>
        </div>
      </div>

      <div className="space-y-6">
        {hasSimilar && (
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Similar sounding names</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {similarNames.slice(0, 12).map((name) => {
                const link = normalizeLink(name, religionKey);
                if (!link) return null;
                return (
                  <Link
                    key={name}
                    href={link}
                    className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-3 text-sm font-medium text-[color:var(--nv-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-md"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {hasRelated && (
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Related names</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {relatedNames.slice(0, 12).map((name) => {
                const link = normalizeLink(name, religionKey);
                if (!link) return null;
                return (
                  <Link
                    key={name}
                    href={link}
                    className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-3 text-sm font-medium text-[color:var(--nv-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-md"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {hasVariations && (
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Spelling variations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {variations.slice(0, 12).map((value) => {
                const link = normalizeLink(cleanName(value), religionKey);
                if (!link) {
                  return <span key={value} className="rounded-2xl border border-amber-200 bg-amber-50/60 px-3 py-2 text-sm text-amber-800">{cleanName(value)}</span>;
                }
                return (
                  <Link
                    key={value}
                    href={link}
                    className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-3 text-sm font-medium text-[color:var(--nv-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-md"
                  >
                    {cleanName(value)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
