'use client';

import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

export default function HoloPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const layers = panel.querySelectorAll<HTMLElement>('.holo-layer');
    let pendingPx = 0;
    let pendingPy = 0;
    let needsUpdate = false;

    const applyTilt = () => {
      const px = pendingPx;
      const py = pendingPy;
      panel.style.transform = `perspective(1100px) rotateY(${(px * 9).toFixed(2)}deg) rotateX(${(-py * 9).toFixed(2)}deg)`;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-depth') || '0');
        layer.style.transform = `translate3d(${(px * depth).toFixed(2)}px,${(py * depth).toFixed(2)}px,0)`;
      });
      needsUpdate = false;
    };

    const scheduleTilt = (px: number, py: number) => {
      pendingPx = px;
      pendingPy = py;
      if (!needsUpdate) {
        needsUpdate = true;
        rafRef.current = requestAnimationFrame(applyTilt);
      }
    };

    const resetTilt = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      needsUpdate = false;
      panel.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)';
      layers.forEach((layer) => { layer.style.transform = 'translate3d(0,0,0)'; });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      scheduleTilt(px, py);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = panel.getBoundingClientRect();
      const px = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
      const py = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
      scheduleTilt(px, py);
    };

    panel.addEventListener('mousemove', onMouseMove);
    panel.addEventListener('mouseleave', resetTilt);
    panel.addEventListener('touchmove', onTouchMove, { passive: true });
    panel.addEventListener('touchend', resetTilt);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      panel.removeEventListener('mousemove', onMouseMove);
      panel.removeEventListener('mouseleave', resetTilt);
      panel.removeEventListener('touchmove', onTouchMove as EventListener);
      panel.removeEventListener('touchend', resetTilt);
    };
  }, []);

  return (
    <section className="field-demo" id="field">
      <div className="wrap">
        <ScrollReveal>
          <div className="section-head">
            <span className="section-tag">Try It</span>
            <h2>Tilt it. That&apos;s the whole interaction.</h2>
            <p>
              Move your cursor across the panel below. Every layer inside answers at its own depth —
              closer elements shift more, farther ones barely move.
            </p>
          </div>
        </ScrollReveal>

        <div className="holo-stage">
          <div className="holo-panel" ref={panelRef} id="holoPanel">
            <div className="holo-top holo-layer" data-depth="10">
              <div className="holo-status">
                <span className="dot"></span> FOCUS · live session
              </div>
              <div className="holo-dots">
                <span></span><span></span><span></span>
              </div>
            </div>

            <div className="holo-chart holo-layer" data-depth="4">
              <svg viewBox="0 0 400 90" preserveAspectRatio="none" role="img" aria-label="Depth field activity chart">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7b61ff" />
                    <stop offset="100%" stopColor="#34f5e4" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 60 C 40 50, 60 20, 100 35 S 160 70, 200 45 S 260 10, 300 30 S 360 55, 400 25"
                  fill="none"
                  stroke="url(#g1)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="holo-rows holo-layer" data-depth="18">
              <div className="holo-row">
                <span className="avatar a"></span>
                Auto-agent · listening
                <span className="depth-val">Z-001</span>
              </div>
              <div className="holo-row">
                <span className="avatar b"></span>
                R. Chen · drafting reply
                <span className="depth-val">Z-002</span>
              </div>
              <div className="holo-row">
                <span className="avatar c"></span>
                Session memory · idle
                <span className="depth-val">Z-003</span>
              </div>
            </div>

            <div className="holo-foot holo-layer" data-depth="24">
              <span>depth field: stable</span>
              <span>3,482 points tracked</span>
            </div>
          </div>
        </div>
        <p className="demo-hint">⤷ hover or touch-drag the panel above</p>
      </div>
    </section>
  );
}
