// Static gradient class map. Using literal strings (not template literals like
// `from-${color}-500`) is REQUIRED so Tailwind can see and tree-shake the
// classes at build time. Dynamically interpolated Tailwind classes force the
// compiler to emit the entire color palette (~160KB of unused CSS).
export const GRADIENT_BY_COLOR = {
  indigo: 'from-indigo-500 to-indigo-600',
  fuchsia: 'from-fuchsia-500 to-fuchsia-600',
  amber: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  rose: 'from-rose-500 to-rose-600',
  pink: 'from-pink-500 to-pink-600',
  teal: 'from-teal-500 to-teal-600',
  violet: 'from-violet-500 to-violet-600',
  sky: 'from-sky-500 to-sky-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  cyan: 'from-cyan-500 to-cyan-600',
  lime: 'from-lime-500 to-lime-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

export function gradientFor(color) {
  return GRADIENT_BY_COLOR[color] || 'from-indigo-500 to-indigo-600';
}
