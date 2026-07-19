"use client"

import { useState } from 'react';
import { Copy, MessageCircle } from 'lucide-react';

const FacebookIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.28 4.28 0 0 0 1.88-2.36 8.57 8.57 0 0 1-2.72 1.04 4.26 4.26 0 0 0-7.27 3.88A12.08 12.08 0 0 1 3.16 4.5a4.26 4.26 0 0 0 1.32 5.69 4.24 4.24 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.17 4.3 4.3 0 0 1-1.92.07 4.26 4.26 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.05 12.05 0 0 0 6.52 1.91c7.83 0 12.11-6.49 12.11-12.11 0-.18-.01-.36-.02-.54A8.66 8.66 0 0 0 24 5.56a8.45 8.45 0 0 1-2.54.7z" />
  </svg>
);

const shareLinks = {
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  whatsapp: (text, url) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
};

export default function ShareButtons({ name, pageUrl, description }) {
  const [copied, setCopied] = useState(false);
  const shareText = description || `Discover the meaning, origin, and lucky details of ${name}.`;

  const handleShare = (platform) => {
    if (!pageUrl) return;

    if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      });
      return;
    }

    const url = shareLinks[platform];
    if (!url) return;

    const shareUrl = platform === 'facebook'
      ? url(pageUrl)
      : url(shareText, pageUrl);

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <div className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--nv-muted)]">Share this name</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--nv-ink)] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          aria-label="Share on Facebook"
        >
          <FacebookIcon className="h-4 w-4" /> Facebook
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--nv-ink)] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          aria-label="Share on Twitter"
        >
          <TwitterIcon className="h-4 w-4" /> Twitter
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--nv-ink)] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </button>
        <button
          onClick={() => handleShare('copy')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-3 py-2.5 text-sm font-bold text-[color:var(--nv-ink)] transition hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)]"
          aria-label="Copy page link"
        >
          <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
