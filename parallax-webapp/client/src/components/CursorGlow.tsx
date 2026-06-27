'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const rafId = useRef<number>(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (!finePointer || reducedMotion) return;

    const el = document.getElementById('cursorGlow');
    if (!el) return;

    let glowX = 0;
    let glowY = 0;
    let curX = 0;
    let curY = 0;
    let glowActive = false;

    const onPointerMove = (e: PointerEvent) => {
      glowX = e.clientX;
      glowY = e.clientY;
      if (!glowActive) {
        glowActive = true;
        el.style.opacity = '0.6';
      }
    };
    window.addEventListener('pointermove', onPointerMove);

    const glowLoop = () => {
      curX += (glowX - curX) * 0.12;
      curY += (glowY - curY) * 0.12;
      el.style.transform = `translate(${curX}px,${curY}px) translate(-50%,-50%)`;
      rafId.current = requestAnimationFrame(glowLoop);
    };
    rafId.current = requestAnimationFrame(glowLoop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return null;
}
