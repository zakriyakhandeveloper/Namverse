export const revalidate = 31536000; // 365 days

import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { EEAT_CONFIG, SOURCES } from '@/lib/seo/enterprise-seo-config';
import { BookOpen, Globe, Shield, Users, Award, CheckCircle2, ExternalLink, Quote } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('About NameVerse — Editorial Team, Mission & Verification Process | NameVerse'),
  description: validateMetaDescription(
    'NameVerse is a trusted baby name knowledge base reviewed by linguists, scholars, and researchers. Meet our editorial team, explore our verification process, and discover why parents rely on our 65K+ name records.'
  ),
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: validateMetaTitle('About NameVerse — Editorial Team, Mission & Verification Process | NameVerse'),
    description: validateMetaDescription(
      'NameVerse is a trusted baby name knowledge base reviewed by linguists, scholars, and researchers. Meet our editorial team and verification process.'
    ),
    url: `${siteUrl}/about`,
    type: 'website',
    siteName: 'NameVerse',
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

function TeamCard({ member }) {
  return (
    <div className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 p-6 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)] transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start gap-4 mb-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[color:var(--nv-ink)] text-white text-lg font-bold">
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className="text-base font-bold text-[color:var(--nv-ink)]">{member.name}</h3>
          <p className="text-sm font-semibold text-[color:var(--nv-accent-2)]">{member.title}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-[color:var(--nv-muted)] mb-4">{member.bio}</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-[color:var(--nv-muted)]">
          <Award className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
          <span>{member.credentials}</span>
        </div>
        <div className="flex items-center gap-2 text-[color:var(--nv-muted)]">
          <Globe className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
          <span>{member.languages.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-[color:var(--nv-muted)]">
          <BookOpen className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
          <span>{member.expertise.join(', ')}</span>
        </div>
      </div>
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[color:var(--nv-accent-2)] transition hover:text-[color:var(--nv-accent)]"
        >
          View LinkedIn Profile <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function ReviewerCard({ reviewer }) {
  return (
    <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700 font-bold">
        {reviewer.name.split(' ').map(n => n[0]).join('')}
      </div>
      <h3 className="mt-3 text-sm font-bold text-[color:var(--nv-ink)]">{reviewer.name}</h3>
      <p className="text-xs font-semibold text-[color:var(--nv-accent-2)]">{reviewer.title}</p>
      <p className="mt-2 text-xs text-[color:var(--nv-muted)]">{reviewer.credentials}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--nv-ink)] text-white text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[color:var(--nv-ink)]">{title}</h3>
        <p className="mt-1 text-sm text-[color:var(--nv-muted)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SourceItem({ source }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[color:var(--nv-muted)]">
      <CheckCircle2 className="h-4 w-4 text-[color:var(--nv-accent-2)] mt-0.5 shrink-0" />
      <span>
        <strong className="text-[color:var(--nv-ink)]">{source.name}</strong>
        {' '}({source.type})
        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--nv-accent-2)] hover:underline ml-1">
            <ExternalLink className="h-3 w-3 inline" />
          </a>
        )}
      </span>
    </li>
  );
}

export default function AboutPage() {
  const team = EEAT_CONFIG.editorialTeam;
  const reviewers = EEAT_CONFIG.reviewers;
  const sources = SOURCES;

  return (
    <main className="min-h-screen bg-[color:var(--nv-canvas)] nv-body">
      <div className="nv-container nv-stack">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,rgba(14,165,164,0.20),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(79,70,229,0.18),transparent_44%),radial-gradient(circle_at_30%_90%,rgba(245,158,11,0.20),transparent_46%)]" />
          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <BookOpen className="h-4 w-4" /> About NameVerse
            </div>
            <h1 className="nv-display mt-5 text-3xl font-bold leading-[0.98] tracking-tight text-[color:var(--nv-ink)] sm:text-4xl md:text-5xl lg:text-6xl">
              Trusted name research for parents worldwide.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--nv-muted)] sm:text-lg">
              NameVerse is a cultural name knowledge base combining 65,000+ name records with verified meanings, origins, and cultural context across Islamic, Hindu, Christian, and global traditions.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <div className="text-2xl font-bold text-[color:var(--nv-ink)]">65K+</div>
                <div className="text-xs font-semibold text-[color:var(--nv-muted)]">Name records</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <div className="text-2xl font-bold text-[color:var(--nv-ink)]">4</div>
                <div className="text-xs font-semibold text-[color:var(--nv-muted)]">Traditions covered</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <div className="text-2xl font-bold text-[color:var(--nv-ink)]">{sources.length}+</div>
                <div className="text-xs font-semibold text-[color:var(--nv-muted)]">Authoritative sources</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading
            icon={Shield}
            eyebrow="Our Mission"
            title="Building the most trustworthy name resource on the internet."
            description="Every name carries a story — a linguistic history, a cultural tradition, and a meaning that connects generations."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Accuracy', desc: 'Every meaning verified against authoritative linguistic sources.' },
              { title: 'Cultural Respect', desc: 'Names presented within authentic cultural and religious contexts.' },
              { title: 'Transparency', desc: 'Editorial process, sources, and methodology publicly documented.' },
              { title: 'Inclusivity', desc: 'Equal depth across Islamic, Hindu, Christian, and global traditions.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-[color:var(--nv-accent-2)]" />
                  <h3 className="text-sm font-bold text-[color:var(--nv-ink)]">{item.title}</h3>
                </div>
                <p className="text-sm text-[color:var(--nv-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Team Section */}
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading
            icon={Users}
            eyebrow="Editorial Team"
            title="Linguists, scholars, and researchers."
            description="Our team specializes in Arabic, Sanskrit, Hebrew, Greek, and Latin name traditions."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Reviewers Section */}
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading
            icon={Award}
            eyebrow="Fact-Checking & Review"
            title="Independent verification by subject-matter experts."
            description="Every name entry is cross-referenced by specialists in the relevant linguistic tradition."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {reviewers.map((reviewer) => (
              <ReviewerCard key={reviewer.id} reviewer={reviewer} />
            ))}
          </div>
        </section>

        {/* Editorial Process Section */}
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading
            icon={BookOpen}
            eyebrow="Editorial Process"
            title="How we verify every name."
            description="A five-step process ensures accuracy, cultural respect, and transparent sourcing."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <ProcessStep number={1} title="Research" description="Each name is researched using authoritative linguistic sources including classical dictionaries, religious texts, and academic references." />
            <ProcessStep number={2} title="Verification" description="Meanings, origins, and cultural context are cross-referenced against multiple sources to ensure accuracy." />
            <ProcessStep number={3} title="Review" description="Content is reviewed by subject-matter experts specializing in the relevant linguistic and cultural tradition." />
            <ProcessStep number={4} title="Publication" description="Approved content is published with clear attribution, publication dates, and source citations." />
            <ProcessStep number={5} title="Ongoing Review" description="All content is periodically reviewed and updated to maintain accuracy and relevance." />
          </div>
        </section>

        {/* Sources Section */}
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading
            icon={Globe}
            eyebrow="Sources"
            title="Authoritative references we rely on."
            description="NameVerse draws from dictionaries, lexicons, encyclopedias, and academic databases."
          />
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
              <SourceItem key={source.name} source={source} />
            ))}
          </ul>
          <p className="mt-4 text-xs text-[color:var(--nv-muted)]">
            Last reviewed: {EEAT_CONFIG.lastReviewed} · Published: {EEAT_CONFIG.publishedDate}
          </p>
        </section>

        {/* Quote / Authority Section */}
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <Quote className="h-8 w-8 text-[color:var(--nv-accent-2)]" />
            <p className="mt-5 text-xl font-semibold leading-relaxed text-[color:var(--nv-ink)]">
              A great name should be easy to search, simple to understand and rich enough to connect a child to family, faith and culture.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--nv-muted)]">
              NameVerse is built for E-E-A-T: Experience, Expertise, Authoritativeness, and Trustworthiness. Every page is designed to answer parent questions before they leave the site — what names mean, where they come from, which are popular, and how to choose with confidence.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 className="nv-display text-2xl font-semibold text-[color:var(--nv-ink)] sm:text-3xl">Get in Touch</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-[color:var(--nv-muted)] sm:text-base">
              Have questions, suggestions, or corrections? We welcome feedback from linguists, parents, and cultural experts.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-[color:var(--nv-ink)] px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
