'use client';

export default function Hero() {
  return (
    <section className="hero">
      <p className="eyebrow">
        <span className="dot"></span> Spatial computing layer
      </p>
      <h1>PARALLAX</h1>
      <p className="tagline">
        An ambient interface layer that organizes your tools, agents and presence
        by how close they are to your attention — not by which app they live in.
      </p>
      <div className="hero-ctas">
        <a href="#access" className="btn btn-primary">
          Request Access
        </a>
        <a href="#manifesto" className="btn btn-ghost">
          Read the manifesto
        </a>
      </div>
      <p className="hud-corner left">
        <span className="dot"></span> Z-000 · FIELD STABLE
      </p>
      <div className="scroll-cue">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeOpacity="0.5" />
          <circle cx="8" cy="7" r="2" fill="currentColor" />
        </svg>
        SCROLL
      </div>
    </section>
  );
}
