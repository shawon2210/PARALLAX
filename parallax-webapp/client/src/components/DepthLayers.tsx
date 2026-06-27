'use client';

import { useEffect, useRef, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';

interface LayerData {
  depth: number;
  zone: string;
  distance: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const layers: LayerData[] = [
  {
    depth: 0,
    zone: 'Z-000',
    distance: '0.0m · foreground',
    label: 'Active Focus',
    desc: 'Whatever you\'re doing right now stays locked at arm\'s length — full clarity, zero clutter around it.',
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.4" stroke="currentColor" />
        <path d="M3 9h18" strokeWidth="1.4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    depth: 1,
    zone: 'Z-001',
    distance: '0.4m',
    label: 'Ambient Agents',
    desc: 'Background AI helpers hover just behind your focus, listening for the moment they\'re actually useful.',
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" strokeWidth="1.4" stroke="currentColor" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" strokeWidth="1.4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    depth: 2,
    zone: 'Z-002',
    distance: '1.2m',
    label: 'Shared Presence',
    desc: 'Teammates appear as soft silhouettes at a conversational distance — present, never intrusive.',
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8" cy="9" r="3" strokeWidth="1.4" stroke="currentColor" />
        <circle cx="17" cy="11" r="2.4" strokeWidth="1.4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    depth: 3,
    zone: 'Z-003',
    distance: '3.0m · far field',
    label: 'Spatial Memory',
    desc: 'Past sessions drift into the far field, fading but never gone — pull them forward with a glance.',
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 17l5-9 4 5 3-4 4 8" strokeWidth="1.4" strokeLinejoin="round" stroke="currentColor" />
      </svg>
    ),
  },
];

export default function DepthLayers() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const d = parseFloat(card.getAttribute('data-depth') || '0');
        const factor = (4 - d) * 7;
        card.style.setProperty('--tx', `${(cx * factor).toFixed(2)}px`);
        card.style.setProperty('--ty', `${(cy * factor).toFixed(2)}px`);
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  return (
    <section className="layers" id="layers">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <span className="section-tag">Depth Layers</span>
            <h2>Four layers. One field of view.</h2>
            <p>
              Every surface in PARALLAX sits at a real depth — not a z-index in a stylesheet,
              an actual coordinate the system keeps track of as you move through your work.
            </p>
          </div>
        </ScrollReveal>

        <div className="depth-cascade">
          {layers.map((l, i) => (
            <article
              key={l.zone}
              className="depth-card"
              data-depth={l.depth}
              ref={setCardRef(i)}
            >
              <p className="tag">
                <span>{l.zone}</span>
                <span>{l.distance}</span>
              </p>
              {l.icon}
              <h3>{l.label}</h3>
              <p>{l.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
