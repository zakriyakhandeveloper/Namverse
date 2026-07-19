'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ({ faqData = [], name }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqs = faqData.length > 0 ? faqData : [
    {
      q: `What does ${name} mean?`,
      a: `${name} is a meaningful name that carries a positive origin and cultural significance.`,
    },
  ];

  return (
    <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
          <ChevronDown className="h-5 w-5" />
        </div>
        <div>
          <h2 className="nv-display text-xl font-semibold text-[color:var(--nv-ink)]">Frequently Asked Questions</h2>
          <p className="mt-1 text-sm text-[color:var(--nv-muted)]">Common questions about the meaning and origin of {name}.</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 transition hover:shadow-md">
            <button
              type="button"
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              className="flex w-full items-start justify-between gap-4 text-left p-4 text-sm font-semibold text-[color:var(--nv-ink)]"
            >
              <span>{item.q}</span>
              {activeIndex === idx ? <ChevronUp className="h-5 w-5 shrink-0 text-[color:var(--nv-accent-2)]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[color:var(--nv-muted)]" />}
            </button>
            <div className={`${activeIndex === idx ? 'mt-3 block' : 'hidden'} text-sm leading-6 text-[color:var(--nv-muted)] px-4 pb-4`}>
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
