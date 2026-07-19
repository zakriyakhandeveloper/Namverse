import { Globe, Languages, Volume2, Shield, Clock, Award, BookOpen, BookText, Sparkles, Hash, Calendar, Palette, Gem, Heart, TrendingUp } from 'lucide-react';

const getLanguageFlag = (langKey) => {
  const flags = {
    sanskrit: '🕉️', english: '🇺🇸', urdu: '🇵🇰', arabic: '🇸🇦', hindi: '🇮🇳', hebrew: '🇮🇱', greek: '🇬🇷', latin: '🇮🇹',
    pashto: '🇦🇫', tamil: '🇮🇳', telugu: '🇮🇳', marathi: '🇮🇳', bengali: '🇧🇩', punjabi: '🇮🇳', turkish: '🇹🇷', persian: '🇮🇷',
    malay: '🇲🇾', indonesian: '🇮🇩', french: '🇫🇷', spanish: '🇪🇸', german: '🇩🇪', italian: '🇮🇹', chinese: '🇨🇳', japanese: '🇯🇵', korean: '🇰🇷', russian: '🇷🇺'
  };
  return flags[langKey?.toLowerCase()] || '🌐';
};

const getLanguageName = (key) => {
  const names = {
    sanskrit: 'Sanskrit', english: 'English', urdu: 'Urdu', arabic: 'Arabic', hindi: 'Hindi', hebrew: 'Hebrew', greek: 'Greek', latin: 'Latin',
    pashto: 'Pashto', tamil: 'Tamil', telugu: 'Telugu', marathi: 'Marathi', bengali: 'Bengali', punjabi: 'Punjabi', turkish: 'Turkish', persian: 'Persian',
    malay: 'Malay', indonesian: 'Indonesian', french: 'French', spanish: 'Spanish', german: 'German', italian: 'Italian', chinese: 'Chinese', japanese: 'Japanese', korean: 'Korean', russian: 'Russian'
  };
  return names[key?.toLowerCase()] || key;
};

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

function getCoreMeaning(data) {
  const meaning = cleanText(data.short_meaning || data.meaning);
  if (!meaning) return 'meaningful cultural name';
  return cleanText(meaning.split(',')[0].split('·')[0].split(';')[0]);
}

function getLanguages(data) {
  const keys = ['in_sanskrit', 'in_english', 'in_urdu', 'in_arabic', 'in_hindi', 'in_hebrew', 'in_greek', 'in_latin', 'in_pashto', 'in_tamil', 'in_telugu', 'in_marathi', 'in_bengali', 'in_punjabi', 'in_turkish', 'in_persian', 'in_malay', 'in_indonesian', 'in_french', 'in_spanish', 'in_german', 'in_italian', 'in_chinese', 'in_japanese', 'in_korean', 'in_russian'];
  return keys
    .map((key) => ({ key, value: data[key] }))
    .filter(({ value }) => value && Object.keys(value).length > 0)
    .map(({ key, value }) => ({
      code: key.replace('in_', ''),
      flag: getLanguageFlag(key.replace('in_', '')),
      name: getLanguageName(key.replace('in_', '')),
      value,
    }));
}

function getOriginTranslation(data) {
  const origin = cleanText(data.origin).toLowerCase();
  const originMap = {
    arabic: 'in_arabic', urdu: 'in_urdu', hindi: 'in_hindi', sanskrit: 'in_sanskrit',
    english: 'in_english', hebrew: 'in_hebrew', greek: 'in_greek', latin: 'in_latin',
    biblical: 'in_greek', persian: 'in_persian', turkish: 'in_turkish',
  };
  const key = originMap[origin];
  if (key && data[key]) return { key, label: getLanguageName(key.replace('in_', '')), value: data[key] };

  const preferred = ['in_arabic', 'in_sanskrit', 'in_hindi', 'in_english', 'in_urdu', 'in_hebrew', 'in_greek', 'in_latin'];
  const found = preferred.find(item => data[item]);
  if (found) return { key: found, label: getLanguageName(found.replace('in_', '')), value: data[found] };
  return null;
}

function getTraits(data) {
  const traits = [];
  if (Array.isArray(data.emotional_traits)) traits.push(...data.emotional_traits.map(cleanText));
  if (Array.isArray(data.hidden_personality_traits)) traits.push(...data.hidden_personality_traits.map(cleanText));
  if (cleanText(data.personality_traits)) traits.push(cleanText(data.personality_traits));
  return Array.from(new Set(traits.filter(Boolean)));
}

function getLuckyColors(data) {
  return Array.isArray(data.lucky_colors) ? data.lucky_colors.map(cleanText).filter(Boolean) : [];
}

function getReferenceText(item) {
  if (typeof item === 'string') return item;
  if (!item || typeof item !== 'object') return '';
  return item.reference || item.notes || (item.name ? `${item.name}${item.profession ? ` — ${item.profession}` : ''}${item.country ? ` (${item.country})` : ''}` : '');
}

function getReferencePeriod(item) {
  return item && typeof item === 'object' ? cleanText(item.time_period) : '';
}

function hashString(str) {
  let hash = 0;
  const value = String(str || '');
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function shouldShowHistoricalReference(ref) {
  const fakePhrases = [
    'various islamic scholars', 'has been used throughout',
    'faithful believers who exemplified', 'carried significant weight in that era',
    'throughout islamic history', 'throughout christian history', 'throughout hindu history',
  ];

  const refText = String(ref?.reference || ref?.notes || ref || '').toLowerCase();
  const isFake = fakePhrases.some(phrase => refText.includes(phrase));
  const isTooShort = String(ref?.reference || ref?.notes || ref || '').length < 80;

  return !isFake && !isTooShort;
}

function isGenericSpiritualSymbolism(data) {
  const symbolism = String(data.spiritual_symbolism || '').toLowerCase();
  const longMeaning = String(data.long_meaning || '').toLowerCase();
  const shortMeaning = String(data.short_meaning || data.meaning || '').toLowerCase();

  if (!symbolism) return true;

  const repeatsLongMeaning = longMeaning.length > 20 && symbolism.includes(longMeaning.substring(0, 40).toLowerCase());
  const isTemplate = symbolism.includes('the meaning') && symbolism.includes('symbolizes') && (
    symbolism.includes('in christian spirituality') ||
    symbolism.includes('in islamic spirituality') ||
    symbolism.includes('in hindu spirituality')
  );

  return repeatsLongMeaning || isTemplate;
}

function isGenericModernUsage(modernContext) {
  const genericPhrases = [
    'remains relevant in modern', 'representing a bridge between traditional',
    'widely discussed on digital platforms', 'continues to be a popular choice',
    'is a name that embodies',
  ];

  const text = String(modernContext || '').toLowerCase();
  return genericPhrases.some(phrase => text.includes(phrase));
}

function hasRealPopularityData(popularityByRegion) {
  if (!popularityByRegion || popularityByRegion.length === 0) return false;
  const allRound = popularityByRegion.every(p => Number(p.score) % 5 === 0);
  return !allRound;
}

function buildSnippet(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = cleanText(data.origin) || 'multiple linguistic traditions';
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data.gender).toLowerCase();
  const languages = getLanguages(data).map(item => item.name);
  const pronunciation = cleanText(data.pronunciation?.english || data.pronunciation?.ipa);
  const luckyNumber = data.lucky_number || data.luckyNumber;
  let text = `${name} is a ${gender} name from ${origin} origin meaning "${meaning}". It is used in ${religion} naming contexts${languages.length ? ` and appears in ${languages.join(', ')}` : ''}.${pronunciation ? ` Pronunciation: ${pronunciation}.` : ''}${luckyNumber ? ` Lucky number: ${luckyNumber}.` : ''}`;

  if (data.emotional_traits?.length) {
    text += ` ${name} is sometimes associated with qualities such as ${data.emotional_traits.slice(0, 2).join(', ')} in different cultural interpretations.`;
  }

  return text.split(/\s+/).slice(0, 58).join(' ');
}

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
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

function TranslationCard({ language }) {
  if (!language?.value) return null;
  return (
    <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[color:var(--nv-ink)]">
        <span>{language.flag}</span>
        <span>{language.name}</span>
      </div>
      <p className="font-semibold text-[color:var(--nv-ink)]">{language.value.name || 'Name translation'}</p>
      {language.value.meaning ? <p className="mt-1 text-sm leading-6 text-[color:var(--nv-muted)]">{language.value.meaning}</p> : null}
      {language.value.long_meaning ? <p className="mt-2 text-sm leading-6 text-[color:var(--nv-muted)]">{language.value.long_meaning}</p> : null}
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-[color:var(--nv-ink)] leading-snug">{value}</p>
    </div>
  );
}

function StatTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-base font-semibold text-[color:var(--nv-ink)]">{value}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">{label}</div>
    </div>
  );
}

function Chip({ children, href, variant = 'default' }) {
  const base = 'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition';
  const variants = {
    default: `${base} border border-[color:var(--nv-border)] bg-white/60 text-[color:var(--nv-ink)] hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)]`,
    accent: `${base} bg-[color:var(--nv-accent-2)] text-white hover:bg-[color:var(--nv-accent)]`,
    muted: `${base} bg-white/60 text-[color:var(--nv-muted)]`,
  };

  if (href) {
    return (
      <Link href={href} className={variants[variant]}>
        {children}
      </Link>
    );
  }

  return <span className={variants[variant]}>{children}</span>;
}

export default function LinguisticOriginPanel({ data, nativeBanner }) {
  const languages = getLanguages(data);
  const originTranslation = getOriginTranslation(data);
  const traits = getTraits(data);
  const luckyColors = getLuckyColors(data);
  const pronunciation = data.pronunciation?.english || data.pronunciation?.ipa;
  const religionLabel = getReligionLabel(data.religion);
  const genderLabel = getGenderLabel(data.gender);
  const origin = cleanText(data.origin) || 'Multiple linguistic traditions';
  const meaning = getCoreMeaning(data);
  const luckyNumber = data.lucky_number || data.luckyNumber;
  const lifePathNumber = cleanText(data.life_path_number);
  const numerologyMeaning = cleanText(data.numerology_meaning);

  return (
    <div className="nv-stack">
      <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
        <SectionHeading icon={BookOpen} eyebrow="Quick Answer" title="Meaning Summary" description="A concise answer for featured snippets and voice search." />
        <div className="rounded-2xl bg-amber-50/80 p-5 ring-1 ring-amber-100">
          <h3 className="text-lg font-bold text-[color:var(--nv-ink)]">What does {data.name} mean?</h3>
          <p className="mt-2 leading-7 text-[color:var(--nv-muted)]">{buildSnippet(data)}</p>
        </div>
      </section>

      {data.in_urdu && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Languages} eyebrow="Translation" title="Meaning in Urdu" />
          <TranslationCard language={{ code: 'urdu', flag: getLanguageFlag('urdu'), name: 'Urdu', value: data.in_urdu }} />
        </section>
      )}

      {originTranslation && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Globe} eyebrow="Source Language" title={`Meaning in ${originTranslation.label}`} description={`${originTranslation.label} is used to show the source-language meaning and cultural nuance.`} />
          <TranslationCard language={originTranslation} />
        </section>
      )}

      <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
        <SectionHeading icon={Volume2} eyebrow="Pronunciation" title="How to Pronounce the Name" />
        <div className="grid gap-4 md:grid-cols-2">
          {data.pronunciation?.english && (
            <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">English Pronunciation</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--nv-ink)]">{data.pronunciation.english}</p>
            </div>
          )}
          {data.pronunciation?.ipa && (
            <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">IPA</p>
              <p className="mt-2 text-xl font-semibold text-[color:var(--nv-ink)]">{data.pronunciation.ipa}</p>
            </div>
          )}
          {!pronunciation && <p className="text-[color:var(--nv-muted)]">NameVerse does not list a pronunciation guide for this name.</p>}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
        <SectionHeading icon={Globe} eyebrow="Origin" title="Name Origin" />
        <div className="space-y-3">
          <InfoTile label="Root Origin" value={origin} />
          {data.language_family || data.origin_language ? (
            <InfoTile label="Source Language" value={data.language_family || data.origin_language} />
          ) : null}
          {languages.length > 0 && (
            <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)] mb-3">Language Usage</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <span key={language.code} className="rounded-full border border-[color:var(--nv-border)] bg-white/60 px-3 py-1 text-sm text-[color:var(--nv-ink)]">{language.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
        <SectionHeading icon={Shield} eyebrow="Religion" title={`${religionLabel} Name Context`} />
        <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 leading-7 text-[color:var(--nv-muted)]">
          {data.name} is listed as a {religionLabel.toLowerCase()} {genderLabel.toLowerCase()} name with {origin} origin. Its meaning is {meaning}.
          {data.category ? ` Category: ${data.category}.` : ''}
        </div>
      </section>

      {(luckyNumber || data.lucky_day || luckyColors.length > 0 || data.lucky_stone || lifePathNumber) && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Sparkles} eyebrow="Lucky Details" title="Lucky Number, Day and Color" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {luckyNumber && (
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Lucky Number</p>
                <p className="mt-2 text-3xl font-semibold text-[color:var(--nv-ink)]">{luckyNumber}</p>
              </div>
            )}
            {data.lucky_day && (
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Lucky Day</p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--nv-ink)]">{data.lucky_day}</p>
              </div>
            )}
            {luckyColors.length > 0 && (
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Lucky Colors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {luckyColors.map((color) => (
                    <span key={color} className="rounded-full border border-[color:var(--nv-border)] bg-white/60 px-3 py-1 text-sm text-[color:var(--nv-ink)]">{color}</span>
                  ))}
                </div>
              </div>
            )}
            {data.lucky_stone && (
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Lucky Stone</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--nv-ink)]">{data.lucky_stone}</p>
              </div>
            )}
            {lifePathNumber && (
              <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Life Path Number</p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--nv-ink)]">{lifePathNumber}</p>
              </div>
            )}
          </div>
          {numerologyMeaning && (
            <div className="mt-4 rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-sm leading-6 text-[color:var(--nv-muted)]">
              <span className="font-semibold text-[color:var(--nv-ink)]">Numerology meaning:</span> {numerologyMeaning}
            </div>
          )}
        </section>
      )}

      {traits.length > 0 && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Heart} eyebrow="Personality" title="Personality Traits" />
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => (
              <span key={trait} className="rounded-full border border-[color:var(--nv-border)] bg-white/60 px-3 py-2 text-sm font-medium text-[color:var(--nv-ink)]">{trait}</span>
            ))}
          </div>
        </section>
      )}

      {data.spiritual_meaning && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={BookText} eyebrow="Spiritual" title="Spiritual Significance" />
          <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-[color:var(--nv-muted)] leading-7">
            {data.spiritual_meaning}
          </div>
        </section>
      )}

      {(data.cultural_impact || data.spiritual_significance || data.islamic_reference || data.vedic_reference || data.biblical_reference || data.saint_reference) && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Shield} eyebrow="Cultural Context" title="Cultural Significance" />
          <div className="space-y-3 text-[color:var(--nv-muted)] leading-7">
            {data.cultural_impact && <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">{data.cultural_impact}</div>}
            {data.spiritual_significance && <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">{data.spiritual_significance}</div>}
            {data.islamic_reference && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-800">
                {data.islamic_reference.is_quranic ? 'Quranic Arabic origin' : 'Traditional Islamic naming context'}{data.islamic_reference.note ? ` — ${data.islamic_reference.note}` : ''}
              </div>
            )}
            {data.vedic_reference && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-800">
                {data.vedic_reference.is_vedic ? 'Vedic Sanskrit origin' : 'Cultural Hindu name'}{data.vedic_reference.root_origin ? ` · Root: ${data.vedic_reference.root_origin}` : ''}{data.vedic_reference.note ? ` · ${data.vedic_reference.note}` : ''}
              </div>
            )}
            {data.biblical_reference?.is_biblical && data.biblical_reference?.verse_reference && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-800">
                Biblical reference: {data.biblical_reference.verse_reference}{data.biblical_reference.note ? ` — ${data.biblical_reference.note}` : ''}
              </div>
            )}
            {data.saint_reference?.is_saint_name && data.saint_reference?.saint_name && (
              <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 text-sm text-purple-800">
                Saint connection: {data.saint_reference.saint_name}{data.saint_reference.note ? ` — ${data.saint_reference.note}` : ''}
              </div>
            )}
          </div>
        </section>
      )}

      {nativeBanner}

      {data.historical_references?.length > 0 && (() => {
        const validRefs = data.historical_references.filter(ref => shouldShowHistoricalReference(ref));
        if (validRefs.length === 0) return null;
        return (
          <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
            <SectionHeading icon={Clock} eyebrow="Historical Usage" title="Historical References" />
            <div className="space-y-3">
              {validRefs.map((item, idx) => {
                const refText = getReferenceText(item);
                const refPeriod = getReferencePeriod(item);
                if (!refText) return null;
                return (
                  <div key={idx} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                    <p className="text-sm leading-6 text-[color:var(--nv-muted)]">{refText}</p>
                    {refPeriod && <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">{refPeriod}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {data.spiritual_symbolism && !isGenericSpiritualSymbolism(data) && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Sparkles} eyebrow="Spiritual" title="Spiritual Symbolism" />
          <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-[color:var(--nv-muted)] leading-7">
            {data.spiritual_symbolism}
          </div>
        </section>
      )}

      {data.modern_usage && !isGenericModernUsage(data.modern_usage?.modern_context) && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={TrendingUp} eyebrow="Modern Usage" title="Modern Usage" />
          <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-[color:var(--nv-muted)] leading-7">
            {data.modern_usage.modern_context || JSON.stringify(data.modern_usage)}
          </div>
        </section>
      )}

      {hasRealPopularityData(data.popularity_by_region) && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={TrendingUp} eyebrow="Popularity" title="Popularity by Region" />
          <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 text-[color:var(--nv-muted)] leading-7">
            {data.popularity_by_region.map((region, idx) => (
              <div key={idx} className="flex justify-between py-2.5 border-b border-[color:var(--nv-border)] last:border-0">
                <span className="font-semibold text-[color:var(--nv-ink)]">{region.region || region.country || 'Region'}</span>
                <span className="text-[color:var(--nv-muted)]">Score: {region.score}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.celebrity_usage?.length > 0 && (() => {
        const realCelebrities = data.celebrity_usage.filter(person => {
          const text = String(typeof person === 'object' ? JSON.stringify(person) : person).toLowerCase();
          return !text.includes('fictional') && !text.includes('example') && !text.includes('sample');
        });
        if (realCelebrities.length === 0) return null;
        return (
          <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
            <SectionHeading icon={Award} eyebrow="Famous People" title="Famous People and Real-World Usage" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)] mb-3">Historical Figures & Cultural References</p>
            <div className="flex flex-wrap gap-2">
              {realCelebrities.map((person, idx) => {
                const label = typeof person === 'object' ? JSON.stringify(person) : person;
                return <span key={idx} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-3 py-2 text-sm text-[color:var(--nv-ink)]">{label}</span>;
              })}
            </div>
          </section>
        );
      })()}

      {data.name_variations?.length > 0 && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Languages} eyebrow="Variations" title="Name Variations" />
          <div className="flex flex-wrap gap-2">
            {data.name_variations.map((variation, idx) => (
              <span key={idx} className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-3 py-2 text-sm text-[color:var(--nv-ink)]">{variation}</span>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="rounded-[2rem] border border-[color:var(--nv-border)] bg-white/62 backdrop-blur shadow-[0_22px_60px_-44px_var(--nv-shadow)]">
          <SectionHeading icon={Languages} eyebrow="Translations" title="Name Translations" description="Additional language translations available for this name." />
          <div className="grid gap-4 sm:grid-cols-2">
            {languages.map((language) => (
              <TranslationCard key={language.code} language={language} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
