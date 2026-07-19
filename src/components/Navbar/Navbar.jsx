'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  Globe,
  Hash,
  Heart,
  Home,
  List,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  TrendingUp,
  X,
} from 'lucide-react';

const categoryLinks = [
  { name: 'All Baby Names', href: '/names', icon: List, description: 'Browse the full name directory' },
  { name: 'Islamic Names', href: '/islamic/boy-names', icon: BookOpen, description: 'Quranic, Arabic and Urdu names', badge: 'Popular' },
  { name: 'Islamic Boy Names', href: '/islamic/boy-names', icon: BookOpen, description: 'Male Islamic names' },
  { name: 'Islamic Girl Names', href: '/islamic/girl-names', icon: BookOpen, description: 'Female Islamic names' },
  { name: 'Christian Names', href: '/christian/boy-names', icon: BookOpen, description: 'Biblical and modern names', badge: 'Popular' },
  { name: 'Christian Boy Names', href: '/christian/boy-names', icon: BookOpen, description: 'Male Christian names' },
  { name: 'Christian Girl Names', href: '/christian/girl-names', icon: BookOpen, description: 'Female Christian names' },
  { name: 'Hindu Names', href: '/hindu/boy-names', icon: Sparkles, description: 'Sanskrit and Vedic names', badge: 'Popular' },
  { name: 'Hindu Boy Names', href: '/hindu/boy-names', icon: Sparkles, description: 'Male Hindu names' },
  { name: 'Hindu Girl Names', href: '/hindu/girl-names', icon: Sparkles, description: 'Female Hindu names' },
  { name: 'Biblical Names', href: '/names/christian/categories/biblical/1', icon: BookOpen, description: 'Names from the Bible' },
  { name: 'Quranic Names', href: '/names/islamic/categories/quranic/1', icon: BookOpen, description: 'Names from the Quran' },
];

const exploreLinks = [
  { name: 'By Meaning', href: '/names-by-meaning', icon: Heart, description: 'Browse names by their meanings' },
  { name: 'By Origin', href: '/names-by-origin', icon: Globe, description: 'Names by linguistic origin' },
  { name: 'By Letter', href: '/names/islamic/letter/a/1', icon: Hash, description: 'A–Z name browsing' },
  { name: 'Trending Names', href: '/trending-names', icon: TrendingUp, description: 'Names gaining search interest', badge: 'Hot' },
  { name: 'Unique Names', href: '/unique-names', icon: Sparkles, description: 'Distinctive naming ideas' },
  { name: 'Popular Names', href: '/popularity', icon: Heart, description: 'Popularity and discovery tools' },
  { name: 'Name Meanings', href: '/name-meanings', icon: BookOpen, description: 'Meaning-led research' },
  { name: 'Advanced Search', href: '/advanced-search', icon: Search, description: 'Filter by meaning and origin' },
  { name: 'Knowledge Graph', href: '/names-by-meaning', icon: Sparkles, description: 'Entity relationships and connections' },
];

const resourceLinks = [
  { name: 'Blog', href: '/blog', icon: BookOpen, description: 'Expert naming guides' },
  { name: 'Expert Naming Guide', href: '/guides/expert-naming-guide', icon: Sparkles, description: 'Decision framework' },
  { name: 'Popular by State', href: '/popular-by-state', icon: Globe, description: 'US state popularity' },
  { name: 'Saved Names', href: '/my-names', icon: Heart, description: 'Your personal shortlist' },
  { name: 'About NameVerse', href: '/about', icon: BookOpen, description: 'Our mission and team' },
];

const directLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: BookOpen },
];

function normalizePath(pathnameValue) {
  if (!pathnameValue) return '/';
  const withoutQuery = pathnameValue.split('?')[0];
  if (withoutQuery !== '/' && withoutQuery.endsWith('/')) return withoutQuery.slice(0, -1);
  return withoutQuery || '/';
}

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSection, setMobileSection] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('nameverse-theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (activeDropdown && navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [activeDropdown]);

  const currentPath = normalizePath(pathname);
  const isActive = (href) => {
    const target = normalizePath(href);
    if (target === '/') return currentPath === '/';
    return currentPath === target || currentPath.startsWith(`${target}/`);
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nameverse-theme', nextDark ? 'dark' : 'light');
    }
  };

  const navItems = useMemo(() => [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Names', href: '/names', dropdown: categoryLinks, icon: List },
    { name: 'Categories', href: '/names', dropdown: exploreLinks, icon: Sparkles },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'About', href: '/about', icon: BookOpen },
  ], []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-[100] border-b border-nv-border bg-nv-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="h-8 w-28 rounded-full bg-nv-surface-subtle" />
          <div className="hidden h-9 w-40 rounded-full bg-nv-surface-subtle lg:block" />
        </div>
      </nav>
    );
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-[100] border-b border-nv-border bg-nv-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="NameVerse home">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-nv-primary text-white shadow-sm">
            <span className="text-lg font-black leading-none">N</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-black tracking-tight text-nv-text leading-none">NameVerse</div>
            <div className="text-xs font-medium text-nv-text-muted leading-tight mt-0.5">Meanings & origins</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasDropdown = Boolean(item.dropdown);
            const active = hasDropdown
              ? item.dropdown.some((link) => isActive(link.href)) || isActive(item.href)
              : isActive(item.href);

            return (
              <div key={item.name} className="relative">
                {hasDropdown ? (
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    aria-expanded={activeDropdown === item.name}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-nv-accent-subtle text-nv-accent'
                        : 'text-nv-text-secondary hover:bg-nv-surface-subtle hover:text-nv-text'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                    <ChevronDown className={`h-3.5 w-3.5 transition ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-nv-accent-subtle text-nv-accent'
                        : 'text-nv-text-secondary hover:bg-nv-surface-subtle hover:text-nv-text'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )}

                {hasDropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-nv-border bg-nv-surface p-1.5 shadow-lg">
                    {item.dropdown.map((link) => {
                      const LinkIcon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-start gap-2.5 rounded-lg p-2.5 transition ${
                            isActive(link.href) ? 'bg-nv-accent-subtle' : 'hover:bg-nv-surface-subtle'
                          }`}
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-nv-surface-subtle text-nv-accent">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <div className="text-sm font-semibold text-nv-text truncate">{link.name}</div>
                              {link.badge && (
                                <span className="shrink-0 rounded-full bg-nv-accent-subtle px-1.5 py-0.5 text-[10px] font-bold text-nv-accent uppercase tracking-wide">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-xs leading-relaxed text-nv-text-muted line-clamp-1">{link.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-lg border border-nv-border bg-nv-surface text-nv-text-secondary transition hover:border-nv-accent hover:bg-nv-accent-subtle hover:text-nv-accent"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg border border-nv-border bg-nv-surface px-3.5 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent hover:bg-nv-accent-subtle hover:text-nv-accent"
            aria-label="Search names"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-lg bg-nv-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-nv-primary-hover"
          >
            Start searching
          </Link>
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <Link
            href="/search"
            className="grid h-9 w-9 place-items-center rounded-lg border border-nv-border bg-nv-surface text-nv-text-secondary"
            aria-label="Search names"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-nv-border bg-nv-surface text-nv-text-secondary"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-[101] bg-nv-text/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-x-0 top-14 z-[102] flex max-h-[calc(100vh-3.5rem)] flex-col bg-nv-surface shadow-xl lg:hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-lg border border-nv-border bg-nv-surface-subtle px-3 py-2.5 text-sm font-semibold text-nv-text-secondary"
                >
                  {isDark ? 'Light mode' : 'Dark mode'}
                </button>
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg bg-nv-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Search
                </Link>
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const hasDropdown = Boolean(item.dropdown);
                  return (
                    <div key={item.name} className="overflow-hidden rounded-xl border border-nv-border bg-nv-surface">
                      <button
                        type="button"
                        onClick={() => hasDropdown ? setMobileSection(mobileSection === item.name ? null : item.name) : setIsMenuOpen(false)}
                        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-nv-accent-subtle text-nv-accent">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-nv-text">{item.name}</div>
                            <div className="text-xs text-nv-text-muted">{hasDropdown ? 'Open section' : 'Open page'}</div>
                          </div>
                        </div>
                        {hasDropdown && <ChevronDown className={`h-4 w-4 text-nv-text-muted transition ${mobileSection === item.name ? 'rotate-180' : ''}`} />}
                      </button>

                      {hasDropdown && mobileSection === item.name && (
                        <div className="space-y-1 border-t border-nv-border bg-nv-surface-subtle px-2.5 py-2.5">
                          {item.dropdown.map((link) => {
                            const LinkIcon = link.icon;
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium text-nv-text-secondary hover:bg-nv-surface"
                              >
                                <LinkIcon className="h-4 w-4 text-nv-accent" />
                                {link.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {directLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl border border-nv-border bg-nv-surface px-3 py-3 text-sm font-semibold text-nv-text-secondary"
                    >
                      <Icon className="h-4 w-4 text-nv-accent" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-nv-border bg-nv-surface px-4 py-3 text-sm font-semibold text-nv-text-secondary"
                >
                  Search names
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-nv-accent px-4 py-3 text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}