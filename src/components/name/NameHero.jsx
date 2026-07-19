import ShareButtons from './ShareButtons';
import { Volume2, Globe, Star, Hash, Calendar, BookOpen } from 'lucide-react';

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
  return cleanText(gender) || 'Unisex';
}

function getLanguages(data) {
  const languages = Array.isArray(data.language) ? data.language.map(cleanText).filter(Boolean) : [];
  const translationKeys = {
    in_arabic: 'Arabic', in_urdu: 'Urdu', in_hindi: 'Hindi', in_sanskrit: 'Sanskrit',
    in_english: 'English', in_hebrew: 'Hebrew', in_greek: 'Greek', in_latin: 'Latin',
    in_pashto: 'Pashto', in_tamil: 'Tamil', in_telugu: 'Telugu', in_marathi: 'Marathi',
    in_bengali: 'Bengali', in_punjabi: 'Punjabi', in_turkish: 'Turkish', in_persian: 'Persian',
    in_malay: 'Malay', in_indonesian: 'Indonesian', in_french: 'French', in_spanish: 'Spanish',
    in_german: 'German', in_italian: 'Italian', in_chinese: 'Chinese', in_japanese: 'Japanese',
    in_korean: 'Korean', in_russian: 'Russian',
  };

  Object.entries(translationKeys).forEach(([key, label]) => {
    if (data[key]?.name || data[key]?.meaning) languages.push(label);
  });

  return Array.from(new Set(languages));
}

const statItems = (data) => [
  (data.lucky_number || data.luckyNumber) && { label: 'Lucky Number', value: data.lucky_number || data.luckyNumber, icon: Hash },
  data.lucky_day && { label: 'Lucky Day', value: data.lucky_day, icon: Calendar },
  data.origin && { label: 'Origin', value: data.origin, icon: Globe },
  data.gender && { label: 'Gender', value: getGenderLabel(data.gender), icon: Star },
].filter(Boolean);

export default function NameHero({ data, pageUrl }) {
  const religion = cleanText(data.religion || 'islamic').toLowerCase();
  const religionDisplay = getReligionLabel(religion);
  const genderDisplay = getGenderLabel(data.gender);
  const subtitleMeaning = data.short_meaning || data.meaning || 'Meaningful cultural name';
  const pronunciation = data.pronunciation?.english || data.pronunciation?.ipa || '';
  const languages = getLanguages(data);
  const h1Label = [religionDisplay, genderDisplay, data.origin].filter(Boolean).join(' ');

  const infoItems = [
    { label: 'Name', value: data.name },
    { label: 'Meaning', value: subtitleMeaning },
    { label: 'Origin', value: data.origin },
    { label: 'Religion', value: religionDisplay },
    { label: 'Language', value: languages.length ? languages.join(', ') : 'Not listed' },
    { label: 'Gender', value: genderDisplay },
    { label: 'Pronunciation', value: pronunciation || 'Not listed' },
    { label: 'Lucky Number', value: data.lucky_number || data.luckyNumber || 'Not listed' },
  ].filter(item => cleanText(item.value));

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]" aria-label={`${data.name} name meaning, origin, pronunciation and lucky number`}>
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,rgba(14,165,164,0.20),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(79,70,229,0.18),transparent_44%),radial-gradient(circle_at_30%_90%,rgba(245,158,11,0.20),transparent_46%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between p-6 sm:p-8">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            <BookOpen className="h-4 w-4" /> {religionDisplay} Name Meaning & Origin Guide
          </div>
          <div className="relative mt-5">
            <h1 className="nv-display text-4xl font-bold leading-[0.98] tracking-tight text-[color:var(--nv-ink)] sm:text-5xl md:text-6xl">
              {data.name}
            </h1>
            <span className="absolute -right-2 -top-4 text-8xl font-black leading-none opacity-[0.04] select-none sm:text-9xl" aria-hidden="true">
              {data.name.charAt(0)}
            </span>
          </div>
          {h1Label && (
            <p className="mt-2 text-base sm:text-lg font-normal text-[color:var(--nv-muted)]">
              {h1Label} name meaning
            </p>
          )}
          <p className="nv-lead mt-4 max-w-2xl">{subtitleMeaning}</p>
          {pronunciation && (
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[color:var(--nv-muted)]">
              <Volume2 className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
              <span className="font-semibold text-[color:var(--nv-ink)]">Pronunciation:</span> {pronunciation}
            </p>
          )}
        </div>

        <div className="w-full lg:w-[320px] lg:sticky lg:top-24 shrink-0">
          <div className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/70 backdrop-blur p-5 shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
            <ShareButtons
              name={data.name}
              pageUrl={pageUrl}
              description={`${data.name} name meaning, ${data.origin || 'origin'}, pronunciation, lucky number and ${religionDisplay.toLowerCase()} context.`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {infoItems.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">{item.label}</div>
            <div className="mt-1.5 text-base font-semibold text-[color:var(--nv-ink)] leading-snug">{item.value}</div>
          </div>
        ))}
      </div>

      {statItems(data).length > 0 ? (
        <div className="relative mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statItems(data).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold text-[color:var(--nv-ink)]">{item.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--nv-muted)]">{item.label}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
