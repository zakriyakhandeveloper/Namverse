import Link from 'next/link';
import { notFound } from 'next/navigation';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { BookOpen, Heart, Clock, ArrowLeft, Calendar, User, ChevronDown, ChevronUp, Share2, ExternalLink, Bookmark, Printer } from 'lucide-react';
import blogPostsData from '../../../../public/data/blog-posts.json';
import BlogImageWithFallback from '@/components/Blog/BlogImageWithFallback';
import islamicNames from '../../../../public/islamic_names.json';
import hinduNames from '../../../../public/hindu_names.json';
import christianNames from '../../../../public/christians_names.json';
import SitePage from '@/components/Layout/SitePage';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';
import NativeBanner from '@/components/Ads/NativeBanner';
import Script from 'next/script';

export const revalidate = 31536000;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPostsData.find(p => p.id === slug);
  if (!post) return { title: 'Post Not Found | NameVerse' };

  const canonical = `${getSiteUrl()}/blog/${slug}`;
  const ogImage = post.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${getSiteUrl()}${post.featuredImage}`
    : `${getSiteUrl()}/opengraph-image`;

  return {
    title: validateMetaTitle(`${post.title} | NameVerse Blog`),
    description: validateMetaDescription(`${post.excerpt}`),
    alternates: { canonical, languages: { en: canonical, 'x-default': canonical } },
    openGraph: {
      title: validateMetaTitle(`${post.title} | NameVerse Blog`),
      description: validateMetaDescription(`${post.excerpt}`),
      type: 'article',
      url: canonical,
      images: [{ url: ogImage, alt: `${post.title} | NameVerse`, width: 1200, height: 630 }],
      publishedTime: post.publishDate,
      modifiedTime: post.lastUpdated,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: validateMetaTitle(`${post.title} | NameVerse Blog`),
      description: validateMetaDescription(`${post.excerpt}`),
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

const islamicNameSet = new Set(islamicNames.map(n => n.toLowerCase()));
const hinduNameSet = new Set(hinduNames.map(n => n.toLowerCase()));
const christianNameSet = new Set(christianNames.map(n => n.toLowerCase()));

function detectNameReligion(name) {
  const normalized = (typeof name === 'string' ? name : (name.name || name)).toLowerCase().trim();
  if (islamicNameSet.has(normalized)) return 'islamic';
  if (hinduNameSet.has(normalized)) return 'hindu';
  if (christianNameSet.has(normalized)) return 'christian';
  return 'islamic';
}

function getReligionFromCategory(category) {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('islamic') || categoryLower.includes('muslim')) return 'islamic';
  if (categoryLower.includes('christian') || categoryLower.includes('biblical')) return 'christian';
  if (categoryLower.includes('hindu') || categoryLower.includes('vedic') || categoryLower.includes('sanskrit')) return 'hindu';
  return 'islamic';
}

function FeaturedNameLink({ name, religion: blogReligion = 'islamic' }) {
  const displayName = typeof name === 'string' ? name : name.name;
  const nameSlug = createSafeSlug(displayName);
  const detectedReligion = detectNameReligion(name);
  const finalReligion = blogReligion !== 'islamic' ? blogReligion : detectedReligion;

  return (
    <Link
      href={`/names/${finalReligion}/${nameSlug}`}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[color:var(--nv-accent-subtle)] text-[color:var(--nv-accent)] rounded-full text-sm font-medium border border-[color:var(--nv-border)] transition hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)]"
    >
      {displayName}
      <ExternalLink className="w-3 h-3" />
    </Link>
  );
}

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

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPostsData.find(p => p.id === slug);
  if (!post) notFound();

  const religion = getReligionFromCategory(post.category);
  const relatedPosts = blogPostsData.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    alternativeHeadline: post.subtitle || post.title,
    description: post.excerpt,
    image: post.featuredImage || `${getSiteUrl()}/opengraph-image`,
    author: { "@type": "Person", name: post.author, jobTitle: post.authorCredentials || 'Baby Name Expert' },
    publisher: { "@type": "Organization", name: "NameVerse", url: getSiteUrl(), logo: { "@type": "ImageObject", url: `${getSiteUrl()}/logo.svg`, width: 192, height: 192 } },
    datePublished: post.publishDate,
    dateModified: post.lastUpdated || post.publishDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${getSiteUrl()}/blog/${post.id}` },
    keywords: post.seoKeywords || (post.tags || []).join(', '),
    articleSection: post.category,
    genre: 'Baby Naming Advice',
    inLanguage: 'en-US'
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getSiteUrl() },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${getSiteUrl()}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${getSiteUrl()}/blog/${post.id}` }
    ]
  };

  return (
    <>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {post.content.faqs && post.content.faqs.length > 0 && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.content.faqs.map(faq => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer }
              }))
            })
          }}
        />
      )}

      <SitePage
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      >
        <div className="nv-stack">
          {/* Article Header */}
          <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)] overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--nv-muted)] transition hover:text-[color:var(--nv-ink)] mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="rounded-full bg-[color:var(--nv-ink)] px-3 py-1 text-xs font-bold text-white">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="nv-display text-3xl font-bold leading-[0.98] tracking-tight text-[color:var(--nv-ink)] sm:text-4xl md:text-5xl">
                {post.title}
              </h1>

              {post.subtitle && (
                <p className="mt-3 text-lg font-medium text-[color:var(--nv-accent-2)]">
                  {post.subtitle}
                </p>
              )}

              <p className="mt-3 text-base leading-relaxed text-[color:var(--nv-muted)]">
                {post.excerpt}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[color:var(--nv-muted)]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--nv-ink)] text-white text-xs font-bold">
                    {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <span className="font-semibold text-[color:var(--nv-ink)] block">{post.author}</span>
                    {post.authorCredentials && <span className="text-xs">{post.authorCredentials}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Featured Image / Visual Block */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
              {post.featuredImage ? (
                <BlogImageWithFallback
                  src={post.featuredImage.startsWith('http') ? post.featuredImage : `${getSiteUrl()}${post.featuredImage}`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm shadow-lg mb-4">
                      <BookOpen className="h-10 w-10 text-white/90" />
                    </div>
                    <p className="text-lg font-semibold text-white/80">{post.category}</p>
                    <p className="text-sm text-white/50 mt-1">{post.title}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition">
                    <Bookmark className="h-3.5 w-3.5" /> Save
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition">
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <article className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Author Box */}
              <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-white/60 border border-[color:var(--nv-border)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--nv-ink)] text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[color:var(--nv-ink)]">{post.author}</div>
                  <div className="text-xs text-[color:var(--nv-muted)]">{post.authorCredentials}</div>
                </div>
              </div>

              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-lg leading-relaxed text-[color:var(--nv-muted)]">{post.content.introduction}</p>
              </div>

              <NativeBanner className="my-6" minHeight="90px" instanceId="blog-post-1" />

              {/* Table of Contents */}
              {post.content.sections && post.content.sections.length > 0 && (
                <div className="mb-10 p-5 rounded-2xl bg-white/60 border border-[color:var(--nv-border)]">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)] mb-3">Table of Contents</h3>
                  <nav className="space-y-2">
                    {post.content.sections.map((section, index) => (
                      <a
                        key={index}
                        href={`#section-${index}`}
                        className="flex items-center gap-2 text-sm text-[color:var(--nv-ink)] hover:text-[color:var(--nv-accent-2)] transition"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--nv-ink)] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Content Sections */}
              {post.content.sections && post.content.sections.map((section, index) => (
                <section key={index} id={`section-${index}`} className="mb-10 scroll-mt-24">
                  <h2 className="nv-display text-2xl font-semibold text-[color:var(--nv-ink)] mb-4">
                    {section.title}
                  </h2>
                  <div className="text-base leading-7 text-[color:var(--nv-muted)] space-y-4">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>

                  {section.featuredNames && section.featuredNames.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)] mb-3">Featured Names</h3>
                      <div className="flex flex-wrap gap-2">
                        {section.featuredNames.map((name, i) => {
                          const displayName = typeof name === 'string' ? name : name.name;
                          const nameSlug = createSafeSlug(displayName);
                          return <FeaturedNameLink key={nameSlug || i} name={name} religion={religion} />;
                        })}
                      </div>
                    </div>
                  )}

                  {section.subsections && section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="mt-4 ml-4 pl-4 border-l-2 border-[color:var(--nv-border)]">
                      <h3 className="nv-display text-lg font-semibold text-[color:var(--nv-ink)] mb-2">
                        {subsection.title}
                      </h3>
                      <div className="text-base leading-7 text-[color:var(--nv-muted)] space-y-3">
                        {subsection.content.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              ))}

              <NativeBanner className="my-6" minHeight="90px" instanceId="blog-post-2" />

              {/* FAQs Section */}
              {post.content.faqs && post.content.faqs.length > 0 && (
                <section className="mb-10">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="nv-display text-xl font-semibold text-[color:var(--nv-ink)]">Frequently Asked Questions</h2>
                      <p className="mt-1 text-sm text-[color:var(--nv-muted)]">Common questions about {post.title.toLowerCase()}.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {post.content.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group rounded-2xl border border-[color:var(--nv-border)] bg-white/60 transition hover:shadow-md"
                      >
                        <summary className="flex items-start justify-between gap-4 p-4 cursor-pointer text-left text-sm font-semibold text-[color:var(--nv-ink)]">
                          <span>{faq.question}</span>
                          <ChevronDown className="h-5 w-5 shrink-0 text-[color:var(--nv-muted)] transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-4 pb-4 text-sm leading-6 text-[color:var(--nv-muted)]">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <NativeBanner className="my-6" minHeight="90px" instanceId="blog-post-3" />

              {/* CTA */}
              <section className="text-center rounded-[2rem] border border-[color:var(--nv-border)] bg-white/60 p-6 sm:p-8 lg:p-10">
                <h2 className="nv-display text-2xl font-semibold text-[color:var(--nv-ink)] sm:text-3xl">Ready to Find the Perfect Name?</h2>
                <p className="mt-3 max-w-xl mx-auto text-sm text-[color:var(--nv-muted)] sm:text-base">
                  Explore our database of 60,000+ baby names with meanings, origins, and numerology.
                </p>
                <Link
                  href="/names/religion/islamic/1"
                  className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-[color:var(--nv-ink)] px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <Heart className="h-5 w-5" />
                  Browse All Names
                </Link>
              </section>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <SectionHeading icon={BookOpen} eyebrow="Related" title="Related Articles" description="More guides in the same category." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="group rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                    <span className="inline-block rounded-full bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--nv-muted)] border border-[color:var(--nv-border)] mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-base font-bold text-[color:var(--nv-ink)] group-hover:text-[color:var(--nv-accent-2)] transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-[color:var(--nv-muted)] line-clamp-2">{post.excerpt}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-bold text-[color:var(--nv-accent-2)] opacity-0 transition group-hover:opacity-100">
                      Read <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </SitePage>
    </>
  );
}
