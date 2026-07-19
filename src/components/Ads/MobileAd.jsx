'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * MobileAd — Renders a mobile-specific native ad container
 *
 * Uses a separate ad unit ID from the desktop version so the ad network
 * can serve mobile-optimized creatives. The container is hidden on desktop
 * via responsive classes and only visible on mobile screens.
 *
 * Default mobile ad unit: 1b543736c10a38ea4ca3f6f7bc8a7a9b
 * Replace with your Revolthem mobile ad unit ID.
 */

const MOBILE_AD_ID = '1b543736c10a38ea4ca3f6f7bc8a7a9b';
const CONTAINER_ID = 'container-' + MOBILE_AD_ID;

function isAdFreePage() {
  if (typeof window === 'undefined') return false;
  var pathname = window.location.pathname.toLowerCase();
  var adFreePaths = ['/privacy', '/terms', '/login', '/signup', '/dashboard', '/admin'];
  return adFreePaths.some(function (path) { return pathname.startsWith(path); });
}

export default function MobileAd(props) {
  var className = props.className || '';
  var minHeight = props.minHeight || '90px';

  var containerRef = useRef(null);
  var inViewState = useState(false);
  var inView = inViewState[0];
  var setInView = inViewState[1];

  var canRenderState = useState(false);
  var canRender = canRenderState[0];
  var setCanRender = canRenderState[1];

  useEffect(function () {
    setCanRender(!isAdFreePage());
  }, []);

  useEffect(function () {
    if (!canRender) return;

    var el = containerRef.current;
    if (!el) return;

    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return function () { observer.disconnect(); };
  }, [canRender]);

  if (!canRender) return null;

  return (
    <div
      ref={containerRef}
      className={
        'w-full mx-auto px-2 sm:px-4 overflow-hidden select-none lg:hidden ' + className
      }
      style={{ minHeight: inView ? minHeight : '0px' }}
    >
      {inView && (
        <div
          id={CONTAINER_ID}
          style={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            marginTop: '12px',
            marginBottom: '16px',
          }}
        />
      )}
    </div>
  );
}
