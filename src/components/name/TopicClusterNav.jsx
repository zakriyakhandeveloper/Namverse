'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { TOPIC_CLUSTERS } from '@/lib/seo/topical-authority-architecture';
import { ChevronRight, ArrowLeft, ArrowRight, LayoutDashboard } from 'lucide-react';

function getClusterBreadcrumbs(clusterId) {
  const breadcrumbs = [];
  let current = TOPIC_CLUSTERS[clusterId];

  while (current) {
    breadcrumbs.unshift(current);
    current = current.parent ? TOPIC_CLUSTERS[current.parent] : null;
  }

  return breadcrumbs;
}

function getSiblingClusters(clusterId) {
  const cluster = TOPIC_CLUSTERS[clusterId];
  if (!cluster || !cluster.parent) return [];

  const parent = TOPIC_CLUSTERS[cluster.parent];
  if (!parent) return [];

  return parent.children
    .filter(id => id !== clusterId)
    .map(id => TOPIC_CLUSTERS[id])
    .filter(Boolean);
}

function getChildClusters(clusterId) {
  const cluster = TOPIC_CLUSTERS[clusterId];
  if (!cluster) return [];

  return cluster.children
    .map(id => TOPIC_CLUSTERS[id])
    .filter(Boolean);
}

function getParentCluster(clusterId) {
  const cluster = TOPIC_CLUSTERS[clusterId];
  if (!cluster || !cluster.parent) return null;
  return TOPIC_CLUSTERS[cluster.parent] || null;
}

export default function TopicClusterNav({ clusterId, currentName, currentReligion }) {
  const parent = useMemo(() => getParentCluster(clusterId), [clusterId]);
  const siblings = useMemo(() => getSiblingClusters(clusterId), [clusterId]);
  const children = useMemo(() => getChildClusters(clusterId), [clusterId]);
  const breadcrumbs = useMemo(() => getClusterBreadcrumbs(clusterId), [clusterId]);

  const isNamePage = Boolean(currentName);

  if (isNamePage) {
    return (
      <div className="space-y-4">
        {parent && (
          <Link
            href={parent.url || '#'}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[color:var(--nv-accent-2)] transition hover:text-[color:var(--nv-accent)]"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to {parent.title}
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--nv-muted)]">
          <LayoutDashboard className="h-4 w-4" />
          {breadcrumbs.map((cluster, index) => (
            <span key={cluster.id} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-3 w-3" />}
              {index < breadcrumbs.length - 1 ? (
                <Link href={cluster.url || '#'} className="font-medium text-[color:var(--nv-ink)] transition hover:text-[color:var(--nv-accent-2)]">
                  {cluster.title}
                </Link>
              ) : (
                <span className="font-semibold text-[color:var(--nv-ink)]">{cluster.title}</span>
              )}
            </span>
          ))}
          {currentName && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-bold text-[color:var(--nv-accent-2)]">{currentName}</span>
            </>
          )}
        </div>

        {siblings.length > 0 && (
          <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">
              Explore Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {siblings.slice(0, 8).map((sibling) => (
                <Link
                  key={sibling.id}
                  href={sibling.url || '#'}
                  className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-3 py-1.5 text-sm font-medium text-[color:var(--nv-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-md"
                >
                  {sibling.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">
              Sub-Topics
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {children.slice(0, 6).map((child) => (
                <Link
                  key={child.id}
                  href={child.url || '#'}
                  className="rounded-xl border border-[color:var(--nv-border)] bg-white/60 p-2.5 text-sm font-medium text-[color:var(--nv-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-sm"
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--nv-muted)]">
        <LayoutDashboard className="h-4 w-4" />
        {breadcrumbs.map((cluster, index) => (
          <span key={cluster.id} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-3 w-3" />}
            {index < breadcrumbs.length - 1 ? (
              <Link href={cluster.url || '#'} className="font-medium text-[color:var(--nv-ink)] transition hover:text-[color:var(--nv-accent-2)]">
                {cluster.title}
              </Link>
            ) : (
              <span className="font-bold text-[color:var(--nv-ink)]">{cluster.title}</span>
            )}
          </span>
        ))}
      </div>

      {parent && (
        <Link
          href={parent.url || '#'}
          className="group inline-flex items-center gap-2 text-sm font-medium text-[color:var(--nv-accent-2)] transition hover:text-[color:var(--nv-accent)]"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to {parent.title}
        </Link>
      )}

      {children.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Link
              key={child.id}
              href={child.url || '#'}
              className="group rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:shadow-md"
            >
              <h3 className="text-sm font-bold text-[color:var(--nv-ink)] group-hover:text-[color:var(--nv-accent-2)] transition">
                {child.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--nv-muted)] line-clamp-2">
                {child.description}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--nv-accent-2)] opacity-0 transition group-hover:opacity-100">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {siblings.length > 0 && (
        <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 p-4">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {siblings.slice(0, 10).map((sibling) => (
              <Link
                key={sibling.id}
                href={sibling.url || '#'}
                className="rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-3 py-1.5 text-sm font-medium text-[color:var(--nv-ink)] transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-accent-2)] hover:shadow-sm"
              >
                {sibling.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
