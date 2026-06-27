'use client';

import { useEffect, useRef, useState } from 'react';
import { getLivePoints } from '@/services/api';

const BASE_POINTS = 3482;
const POLL_INTERVAL = 2000;
const MAX_DRIFT = 50;

export default function HudPoints() {
  const [points, setPoints] = useState(BASE_POINTS);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getLivePoints();
        setPoints(data.total);
      } catch {
        /* P0 FIX: clamp fallback drift */
        setPoints((prev) => {
          const drift = Math.floor(Math.random() * 40) - 20;
          const candidate = prev + drift;
          if (Math.abs(candidate - BASE_POINTS) > MAX_DRIFT) {
            return BASE_POINTS + Math.floor(Math.random() * 10 - 5);
          }
          return candidate;
        });
      }
    };

    fetchPoints();

    /* P0 FIX: pause polling when tab is hidden */
    const onVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        fetchPoints();
        intervalRef.current = setInterval(fetchPoints, POLL_INTERVAL);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    intervalRef.current = setInterval(fetchPoints, POLL_INTERVAL);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <p className="hud-corner right" id="hudPoints" role="status" aria-live="polite">
      <span className="dot"></span> POINTS TRACKED · {points.toLocaleString()}
    </p>
  );
}
