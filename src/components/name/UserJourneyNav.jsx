'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { USER_JOURNEYS } from '@/lib/seo/topical-authority-architecture';
import { Compass, ArrowRight, ArrowLeft, Search, BookOpen, Heart, Share2, Sparkles, TrendingUp, Globe } from 'lucide-react';

function getEntityIcon(type) {
  const icons = {
    [ENTITY_TYPES.RELIGION]: BookOpen,
    [ENTITY_TYPES.ORIGIN]: Globe,
    [ENTITY_TYPES.LANGUAGE]: Languages,
    [ENTITY_TYPES.COUNTRY]: MapPin,
    [ENTITY_TYPES.THEME]: Sparkles,
    [ENTITY_TYPES.MEANING]: Heart,
    [ENTITY_TYPES.LETTER]: 'A',
    [ENTITY_TYPES.GENDER]: Users,
    [ENTITY_TYPES.CULTURE]: Users,
    [ENTITY_TYPES.ERA]: History,
    [ENTITY_TYPES.PROFESSION]: Shield,
    [ENTITY_TYPES.PERSONALITY]: Heart,
    [ENTITY_TYPES.NUMEROLOGY]: Sparkles,
    [ENTITY_TYPES.ZODIAC]: Star,
    [ENTITY_TYPES.ELEMENT]: Sun,
    [ENTITY_TYPES.COLOR]: Palette,
    [ENTITY_TYPES.NATURE]: Sun,
    [ENTITY_TYPES.FLOWER]: Flower2,
    [ENTITY_TYPES.ANIMAL]: '🐾',
    [ENTITY_TYPES.VIRTUE]: Heart,
    [ENTITY_TYPES.ROYAL]: Crown,
    [ENTITY_TYPES.BIBLICAL]: BookOpen,
    [ENTITY_TYPES.QURANIC]: BookOpen,
    [ENTITY_TYPES.VEDIC]: BookOpen,
  };
  return icons[type] || Sparkles;
}

function getEntityColor(type) {
  const colors = {
    [ENTITY_TYPES.RELIGION]: 'bg-amber-50 text-amber-800 border-amber-200',
    [ENTITY_TYPES.ORIGIN]: 'bg-blue-50 text-blue-800 border-blue-200',
    [ENTITY_TYPES.LANGUAGE]: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    [ENTITY_TYPES.COUNTRY]: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    [ENTITY_TYPES.THEME]: 'bg-purple-50 text-purple-800 border-purple-200',
    [ENTITY_TYPES.MEANING]: 'bg-rose-50 text-rose-800 border-rose-200',
    [ENTITY_TYPES.CULTURE]: 'bg-teal-50 text-teal-800 border-teal-200',
    [ENTITY_TYPES.ERA]: 'bg-orange-50 text-orange-800 border-orange-200',
    [ENTITY_TYPES.VIRTUE]: 'bg-pink-50 text-pink-800 border-pink-200',
    [ENTITY_TYPES.NATURE]: 'bg-green-50 text-green-800 border-green-200',
    [ENTITY_TYPES.FLOWER]: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
    [ENTITY_TYPES.ANIMAL]: 'bg-lime-50 text-lime-800 border-lime-200',
    [ENTITY_TYPES.ROYAL]: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    [ENTITY_TYPES.BIBLICAL]: 'bg-sky-50 text-sky-800 border-sky-200',
    [ENTITY_TYPES.QURANIC]: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    [ENTITY_TYPES.VEDIC]: 'bg-orange-50 text-orange-800 border-orange-200',
    [ENTITY_TYPES.ELEMENT]: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    [ENTITY_TYPES.COLOR]: 'bg-violet-50 text-violet-800 border-violet-200',
    [ENTITY_TYPES.PROFESSION]: 'bg-slate-50 text-slate-800 border-slate-200',
  };
  return colors[type] || 'bg-gray-50 text-gray-800 border-gray-200';
}

function getEntityTypeLabel(type) {
  const labels = {
    [ENTITY_TYPES.RELIGION]: 'Religion',
    [ENTITY_TYPES.ORIGIN]: 'Origin',
    [ENTITY_TYPES.LANGUAGE]: 'Language',
    [ENTITY_TYPES.COUNTRY]: 'Country',
    [ENTITY_TYPES.THEME]: 'Theme',
    [ENTITY_TYPES.MEANING]: 'Meaning',
    [ENTITY_TYPES.CULTURE]: 'Culture',
    [ENTITY_TYPES.ERA]: 'Era',
    [ENTITY_TYPES.VIRTUE]: 'Virtue',
    [ENTITY_TYPES.NATURE]: 'Nature',
    [ENTITY_TYPES.FLOWER]: 'Flower',
    [ENTITY_TYPES.ANIMAL]: 'Animal',
    [ENTITY_TYPES.ROYAL]: 'Royal',
    [ENTITY_TYPES.BIBLICAL]: 'Biblical',
    [ENTITY_TYPES.QURANIC]: 'Quranic',
    [ENTITY_TYPES.VEDIC]: 'Vedic',
    [ENTITY_TYPES.ELEMENT]: 'Element',
    [ENTITY_TYPES.COLOR]: 'Color',
    [ENTITY_TYPES.PROFESSION]: 'Profession',
  };
  return labels[type] || 'Entity';
}

const stageIcons = {
  discovery: Compass,
  research: Search,
  compare: ArrowRight,
  decision: Heart,
  share: Share2,
  explore: Sparkles,
  'choose-religion': BookOpen,
  'browse-gender': Globe,
  'browse-collections': BookOpen,
  'view-name': Heart,
  'explore-related': Sparkles,
  'browse-meanings': Search,
  'filter-meaning': Search,
  'view-names': BookOpen,
  'explore-more': Sparkles,
};

const stageColors = {
  discovery: 'border-blue-200 bg-blue-50 text-blue-700',
  research: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  compare: 'border-amber-200 bg-amber-50 text-amber-700',
  decision: 'border-rose-200 bg-rose-50 text-rose-700',
  share: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  explore: 'border-purple-200 bg-purple-50 text-purple-700',
};

function getJourneyForPage(pathname) {
  for (const [journeyId, journey] of Object.entries(USER_JOURNEYS)) {
    for (let i = 0; i < journey.stages.length; i++) {
      const stage = journey.stages[i];
      const matches = stage.pages.some(pattern => {
        if (pattern.includes('{')) {
          const regex = new RegExp('^' + pattern.replace(/\{[^}]+\}/g, '[^/]+') + '$');
          return regex.test(pathname);
        }
        return pathname === pattern || pathname.startsWith(pattern);
      });
      if (matches) {
        return { journeyId, journey, currentStageIndex: i };
      }
    }
  }
  return null;
}

export default function UserJourneyNav({ pathname, variant = 'sidebar' }) {
  const journeyContext = useMemo(() => getJourneyForPage(pathname), [pathname]);

  if (!journeyContext) return null;

  const { journey, currentStageIndex } = journeyContext;
  const currentStage = journey.stages[currentStageIndex];
  const prevStage = currentStageIndex > 0 ? journey.stages[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < journey.stages.length - 1 ? journey.stages[currentStageIndex + 1] : null;
  const progress = ((currentStageIndex + 1) / journey.stages.length) * 100;

  if (variant === 'sidebar') {
    return (
      <div className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[color:var(--nv-ink)]">Your Journey</h3>
            <p className="text-xs text-[color:var(--nv-muted)]">{journey.name}</p>
          </div>
        </div>

        <div className="mb-4 h-2 rounded-full bg-white/60">
          <div
            className="h-2 rounded-full bg-[color:var(--nv-accent-2)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          {journey.stages.map((stage, index) => {
            const Icon = stageIcons[stage.stage] || Compass;
            const isActive = index === currentStageIndex;
            const isComplete = index < currentStageIndex;
            const colorClass = stageColors[stage.stage] || 'border-[color:var(--nv-border)] bg-white/60 text-[color:var(--nv-muted)]';

            return (
              <div
                key={stage.stage}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition ${isActive ? 'border-amber-300 bg-amber-50 ring-1 ring-amber-200' : isComplete ? 'border-emerald-200 bg-emerald-50' : colorClass}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-amber-100 text-amber-700' : isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-white/60 text-[color:var(--nv-muted)]'}`}>
                  {isComplete ? (
                    <span className="text-sm font-bold">✓</span>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className={`block text-xs font-bold uppercase tracking-wider ${isActive ? 'text-amber-800' : isComplete ? 'text-emerald-700' : 'text-[color:var(--nv-muted)]'}`}>
                    {stage.stage.replace(/-/g, ' ')}
                  </span>
                  <span className={`block text-xs mt-0.5 ${isActive ? 'text-amber-700' : 'text-[color:var(--nv-muted)]'}`}>
                    {isActive ? 'Current step' : isComplete ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          {prevStage && (
            <Link
              href={prevStage.pages[0]}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-3 py-2 text-xs font-semibold text-[color:var(--nv-ink)] transition hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)]"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </Link>
          )}
          {nextStage && (
            <Link
              href={nextStage.pages[0]}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[color:var(--nv-ink)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Next Step
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--nv-border)] bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Compass className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
          <span className="text-xs font-semibold text-[color:var(--nv-muted)]">
            Step {currentStageIndex + 1} of {journey.stages.length}: {currentStage.stage.replace(/-/g, ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {prevStage && (
            <Link
              href={prevStage.pages[0]}
              className="inline-flex items-center gap-1 rounded-2xl border border-[color:var(--nv-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--nv-ink)] hover:bg-white/60"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          )}
          {nextStage && (
            <Link
              href={nextStage.pages[0]}
              className="inline-flex items-center gap-1 rounded-2xl bg-[color:var(--nv-ink)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Next <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
