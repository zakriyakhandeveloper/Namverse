'use client';

// Pure CSS visual block — no <img>, no network request, no next/image.
// Replaces the previous image-based blog cover with a lightweight gradient
// panel showing the article initial. Keeps zero bytes of image payload.

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-fuchsia-500 to-pink-600',
  'from-violet-500 to-indigo-600',
  'from-blue-500 to-cyan-600',
  'from-rose-500 to-orange-500',
  'from-emerald-500 to-teal-600',
];

function pickGradient(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export default function BlogImageWithFallback({ src, alt, className, containerClassName, children }) {
  const seed = alt || src || 'NameVerse Blog';
  const initial = (alt || 'N').trim().charAt(0).toUpperCase() || 'N';

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${pickGradient(seed)} ${containerClassName || ''}`}>
      {/* decorative visual, no image asset */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white,transparent_55%),radial-gradient(circle_at_80%_70%,white,transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/25 backdrop-blur-sm shadow-lg">
          <span className="text-3xl font-black text-white">{initial}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
