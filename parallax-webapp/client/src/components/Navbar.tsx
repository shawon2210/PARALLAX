'use client';

export default function Navbar() {
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <a className="brand" href="#main" aria-label="PARALLAX — Home">
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect className="a" x="9" y="3" width="14" height="14" rx="2" transform="rotate(10 16 16)" fill="#7b61ff" opacity="0.85" />
            <rect className="b" x="7" y="9" width="14" height="14" rx="2" transform="rotate(-6 16 16)" fill="#34f5e4" opacity="0.65" />
            <rect className="c" x="11" y="15" width="14" height="14" rx="2" transform="rotate(18 16 16)" fill="#ff4fd8" opacity="0.5" />
          </svg>
          PARALLAX
        </a>
        <nav className="nav-links" aria-label="Section links">
          <a href="#layers">Layers</a>
          <a href="#field">Field</a>
          <a href="#access">Access</a>
        </nav>
        <a href="#access" className="btn btn-primary btn-sm">
          Request Access
        </a>
      </div>
    </header>
  );
}
