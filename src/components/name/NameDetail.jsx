import NameHero from './NameHero';
import LinguisticOriginPanel from './Meaning';
import FAQ from './FAQ';
import RelatedNames from './RelatedNames';
import KnowledgeGraph from './KnowledgeGraph';
import SitePage from '@/components/Layout/SitePage';
import NativeBanner from '@/components/Ads/NativeBanner';
import Link from 'next/link';
import { ArrowRight, Sparkles, Share2, Bookmark, TrendingUp } from 'lucide-react';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

function cleanText(text = '') {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function getReligionLabel(religion) {
  if (religion === 'islamic') return 'Islamic';
  if (religion === 'christian') return 'Christian';
  if (religion === 'hindu') return 'Hindu';
  return cleanText(religion);
}

function getGenderLabel(gender) {
  const value = cleanText(gender).toLowerCase();
  if (value.includes('male')) return 'Boy';
  if (value.includes('female')) return 'Girl';
  if (value.includes('unisex') || value.includes('neutral')) return 'Unisex';
  return cleanText(gender) || 'Baby';
}

function getGenderPath(religion, gender) {
  const value = cleanText(gender).toLowerCase();
  if (value.includes('male')) return `/${religion}/boy-names`;
  if (value.includes('female')) return `/${religion}/girl-names`;
  return null;
}

function normalizeTrendingName(name, religion) {
  const label = cleanText(typeof name === 'object' ? name.name : name);
  if (!label) return null;
  const slug = cleanText(typeof name === 'object' ? name.slug : '') || createSafeSlug(label);
  if (!slug || slug.length < 2) return null;
  return { name: label, slug };
}

function QuickNav({ religion, genderPath, genderLabel, data }) {
  const letter = cleanText(data.name).charAt(0).toUpperCase();
  const originSlug = createSafeSlug(data.origin);

  const links = [
    ...(genderPath ? [{ label: `${genderLabel} Names`, href: genderPath, desc: 'Browse all' }] : []),
    { label: `Letter ${letter}`, href: `/names/${religion}/letter/${letter}/1`, desc: 'Same starting letter' },
    { label: data.origin || 'Origin', href: originSlug ? `/names/${religion}/origin/${originSlug}/1` : '#', desc: 'Same origin' },
    { label: 'Search', href: '/search', desc: 'Find more names' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nv-border)] bg-white/60 px-3.5 py-2 text-sm font-medium text-[color:var(--nv-ink)] transition hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-sm"
        >
          {link.label}
          <span className="text-xs text-[color:var(--nv-muted)] hidden sm:inline">· {link.desc}</span>
        </Link>
      ))}
    </div>
  );
}

function TrendingStrip({ names, religion, source }) {
  if (!names.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Trending:</span>
      {names.map((item) => (
        <Link
          key={item.slug}
          href={`/names/${religion}/${item.slug}`}
          className="rounded-full bg-white/60 px-3 py-1.5 text-sm font-medium text-[color:var(--nv-ink)] border border-[color:var(--nv-border)] transition hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)]"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default function CulturalNameAnalysisCard({ data, faqData = [], pageUrl, trendingNames = [], trendingNamesSource = 'suggested' }) {
  const safeFaqData = Array.isArray(faqData)
    ? faqData.filter((item) => item && typeof item === 'object' && item.q && item.a)
    : [];
  const religion = cleanText(data.religion || 'islamic').toLowerCase();
  const religionLabel = getReligionLabel(religion);
  const genderLabel = getGenderLabel(data.gender);
  const genderPath = getGenderPath(religion, data.gender);
  const normalizedTrending = trendingNames
    .map(name => normalizeTrendingName(name, religion))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Names', href: '/names' },
        { label: `${religionLabel} Names`, href: `/names/religion/${religion}/1` },
        { label: data.name },
      ]}
    >
      <div className="nv-stack">
        {/* Topic Cluster — subtle breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[color:var(--nv-muted)]">
          <Link href={`/names/${religion}`} className="font-medium hover:text-[color:var(--nv-ink)] transition">{religionLabel} Names</Link>
          <span>/</span>
          <span className="text-[color:var(--nv-ink)] font-medium">{data.name}</span>
        </nav>

        {/* Hero */}
        <NameHero data={data} pageUrl={pageUrl} />

        {/* Quick Navigation */}
        <QuickNav religion={religion} genderPath={genderPath} genderLabel={genderLabel} data={data} />

        {/* Trending strip */}
        {normalizedTrending.length > 0 && (
          <TrendingStrip names={normalizedTrending} religion={religion} source={trendingNamesSource} />
        )}

        {/* Main Content: Meaning + Knowledge Graph side by side on desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="nv-stack">
              <LinguisticOriginPanel data={data} nativeBanner={
                <NativeBanner className="my-6" minHeight="90px" instanceId="name-detail-mid" />
              } />
            </div>
          </div>
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-24 space-y-4">
              <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
                <KnowledgeGraph data={data} religion={religion} />
              </section>
            </div>
          </div>
        </div>

        {/* Related Names + Trending Names combined */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
            <RelatedNames data={data} />
          </section>
          {normalizedTrending.length > 0 && (
            <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="nv-display text-xl font-semibold text-[color:var(--nv-ink)]">Trending Now</h2>
                  <p className="mt-1 text-sm text-[color:var(--nv-muted)]">Names gaining popularity</p>
                </div>
              </div>
              <div className="space-y-2">
                {normalizedTrending.slice(0, 5).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/names/${religion}/${item.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-3 transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:shadow-sm"
                  >
                    <span className="text-sm font-bold text-[color:var(--nv-ink)]">{item.name}</span>
                    <ArrowRight className="h-4 w-4 text-[color:var(--nv-muted)] opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* FAQ */}
        <FAQ faqData={safeFaqData} name={data.name} />
      </div>
    </SitePage>
  );
}
