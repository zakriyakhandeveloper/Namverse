import Link from 'next/link';
import { BookOpen, Heart, Clock, ArrowRight, Calendar, User, Tag, ChevronDown, ChevronUp, ExternalLink, ArrowLeft, Sparkles, TrendingUp, Award } from 'lucide-react';
import { readFileSync } from 'fs';
import { join } from 'path';
import StructuredData from '@/components/SEO/StructuredData';
import BlogImageWithFallback from '@/components/Blog/BlogImageWithFallback';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import NativeBanner from '@/components/Ads/NativeBanner';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

export const revalidate = 31536000;

const blogPostsData = JSON.parse(
  readFileSync(join(process.cwd(), 'public', 'data', 'blog-posts.json'), 'utf8')
);

const blogFaq = [
  { question: 'How do I choose the perfect baby name?', answer: 'Choose a baby name by balancing meaning, cultural relevance, pronunciation, and family tradition. Our guides help you compare Islamic, Christian, Hindu, and global name choices with trusted origin notes.' },
  { question: 'What are the most popular Islamic baby names?', answer: 'The most popular Islamic baby names include Muhammad, Ali, Yusuf, Aisha, Fatima, Zainab and Maryam — names with Quranic meaning and modern appeal.' },
  { question: 'What baby names are trending in 2026?', answer: 'Trending baby names for 2026 include names with spiritual meaning, short modern forms, and cross-cultural appeal such as Rayan, Noor, Elias, Leila, Vihaan, and Zara.' },
  { question: 'How important is name meaning?', answer: 'Name meaning is very important for cultural identity and long-term satisfaction; choose a name with a positive meaning that reflects your family values and heritage.' }
];

const blogCollection = {
  name: 'NameVerse Blog: Baby Names & Guides',
  description: 'Explore expert baby naming advice, trends, and naming traditions for Islamic, Christian, Hindu, and global names.',
  url: `${getSiteUrl()}/blog`,
  items: [
    { name: 'Islamic Boy Names', path: 'islamic/boy-names' },
    { name: 'Islamic Girl Names', path: 'islamic/girl-names' },
    { name: 'Christian Boy Names', path: 'christian/boy-names' },
    { name: 'Christian Girl Names', path: 'christian/girl-names' },
    { name: 'Hindu Boy Names', path: 'hindu/boy-names' },
    { name: 'Hindu Girl Names', path: 'hindu/girl-names' }
  ]
};

export const metadata = {
  title: 'Baby Names Blog & Expert Guides | Naming Tips, Trends & Advice | NameVerse',
  description: 'Expert guides and articles on choosing the perfect baby name. Learn about Islamic, Christian, and Hindu naming traditions, 2026 baby name trends, and expert naming tips.',
  keywords: 'baby names blog, naming guides, baby name trends 2026, Islamic naming guide, Christian naming guide, Hindu naming guide, how to choose baby name, baby naming tips',
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Baby Names Blog & Expert Guides | Naming Tips, Trends & Advice | NameVerse',
    description: 'Expert guides and articles on choosing the perfect baby name. Learn about Islamic, Christian, and Hindu naming traditions, 2026 baby name trends, and expert naming tips.',
    type: 'website',
    url: `${getSiteUrl()}/blog`,
    images: [`${getSiteUrl()}/opengraph-image`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Names Blog & Expert Guides | Naming Tips, Trends & Advice | NameVerse',
    description: 'Expert guides and articles on choosing the perfect baby name. Learn about Islamic, Christian, and Hindu naming traditions, 2026 baby name trends, and expert naming tips.',
    images: [`${getSiteUrl()}/opengraph-image`],
  },
};

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">{eyebrow}</p>}
        <h2 className="nv-display text-xl font-semibold text-[color:var(--nv-ink)]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[color:var(--nv-muted)]">{description}</p>}
      </div>
    </div>
  );
}

function FeaturedCard({ post }) {
  return (
    <article className="group rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)] overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <BlogImageWithFallback
          alt={post.title}
          containerClassName="h-full w-full"
        >
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="rounded-full bg-[color:var(--nv-ink)] px-3 py-1 text-xs font-bold text-white">
              {post.category}
            </span>
            {post.featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                Featured
              </span>
            )}
          </div>
        </BlogImageWithFallback>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-[color:var(--nv-ink)] mb-2 line-clamp-2 group-hover:text-[color:var(--nv-accent-2)] transition">
          {post.title}
        </h3>
        <p className="text-sm text-[color:var(--nv-muted)] mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[color:var(--nv-muted)]">{post.author}</span>
          <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--nv-accent-2)] transition hover:text-[color:var(--nv-accent)]">
            Read <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ListCard({ post }) {
  return (
    <article className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/60 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-40 h-32 flex-shrink-0 overflow-hidden rounded-2xl">
          <BlogImageWithFallback
            alt={post.title}
            containerClassName="w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nv-muted)] border border-[color:var(--nv-border)]">
            {post.category}
          </span>
          <h3 className="mt-2 text-base font-bold text-[color:var(--nv-ink)] line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm text-[color:var(--nv-muted)] line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-[color:var(--nv-muted)]">{post.readTime}</span>
            <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-[color:var(--nv-accent-2)]">
              Read <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const featuredPosts = blogPostsData.filter(p => p.featured);
  const recentPosts = blogPostsData.filter(p => !p.featured);

  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Blog', href: '/blog' },
      ]}
    >
      <div className="nv-stack">
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <BookOpen className="h-4 w-4" /> Blog
            </div>
            <h1 className="nv-display mt-5 text-3xl font-bold leading-[0.98] tracking-tight text-[color:var(--nv-ink)] sm:text-4xl md:text-5xl">
              Baby Names Blog & Expert Guides
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--nv-muted)] sm:text-lg">
              Expert advice, naming traditions, cultural insights, and the latest trends to help you choose the perfect name for your baby.
            </p>
          </div>
        </section>

        <NativeBanner className="my-6" minHeight="90px" instanceId="blog-index-1" />

        <section>
          <SectionHeading icon={BookOpen} eyebrow="Collections" title="Explore Name Collections" description="Jump directly to curated baby name collections for every tradition." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Islamic Boy Names', href: '/islamic/boy-names', desc: 'Quranic, Arabic, modern Muslim boy names' },
              { label: 'Islamic Girl Names', href: '/islamic/girl-names', desc: 'Meaningful Islamic girl names' },
              { label: 'Christian Boy Names', href: '/christian/boy-names', desc: 'Biblical and contemporary Christian boy names' },
              { label: 'Christian Girl Names', href: '/christian/girl-names', desc: 'Popular Christian girl names' },
              { label: 'Hindu Boy Names', href: '/hindu/boy-names', desc: 'Sanskrit, Vedic, devotional boy names' },
              { label: 'Hindu Girl Names', href: '/hindu/girl-names', desc: 'Beautiful Hindu girl names' },
              { label: 'All Islamic Names', href: '/names/religion/islamic/1', desc: 'Complete Islamic names directory' },
              { label: 'All Christian Names', href: '/names/religion/christian/1', desc: 'Full Christian names directory' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:shadow-md">
                <div className="text-sm font-bold text-[color:var(--nv-ink)] group-hover:text-[color:var(--nv-accent-2)] transition">{item.label}</div>
                <div className="mt-1 text-xs text-[color:var(--nv-muted)]">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <NativeBanner className="my-6" minHeight="90px" instanceId="blog-index-2" />

        {featuredPosts.length > 0 && (
          <section>
            <SectionHeading icon={Sparkles} eyebrow="Featured" title="Featured Guides" description="Hand-picked expert guides for modern parents." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredPosts.map((post) => (
                <FeaturedCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <NativeBanner className="my-6" minHeight="90px" instanceId="blog-index-3" />

        <section>
          <SectionHeading icon={BookOpen} eyebrow="Latest" title="More Articles" description="Latest guides, tips, and naming advice." />
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <ListCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <div className="p-6 sm:p-8">
            <h2 className="nv-display text-xl font-semibold text-[color:var(--nv-ink)] mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {blogFaq.map((item, index) => (
                <div key={index} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-5">
                  <h3 className="text-sm font-bold text-[color:var(--nv-ink)] mb-2">{item.question}</h3>
                  <p className="text-sm leading-6 text-[color:var(--nv-muted)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-center rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 className="nv-display text-2xl font-semibold text-[color:var(--nv-ink)] sm:text-3xl">Ready to Find the Perfect Name?</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-[color:var(--nv-muted)] sm:text-base">
              Explore our database of 60,000+ baby names with detailed meanings and origins.
            </p>
            <Link
              href="/names/religion/islamic/1"
              className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-[color:var(--nv-ink)] px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Heart className="h-5 w-5" />
              Browse All Names
            </Link>
          </div>
        </section>
      </div>
    </SitePage>
  );
}
