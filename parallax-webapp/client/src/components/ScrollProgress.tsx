'use client';

import { useEffect } from 'react';

export default function ScrollProgress() {
  useEffect(() => {
    const el = document.getElementById('scrollProgress')!;

    /* P0 FIX: add ARIA attributes */
    el.setAttribute('role', 'progressbar');
    el.setAttribute('aria-label', 'Page scroll progress');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        el.style.width = pct + '%';
        el.setAttribute('aria-valuenow', Math.round(pct).toString());
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
