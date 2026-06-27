# PARALLAX

**An Interface With Depth** — PARALLAX is an ambient spatial computing layer that organizes your tools, agents, and presence by **how close they are to your attention** — not by which app they live in.

---

## Overview

> "Flat interfaces ask you to choose what matters.  
> PARALLAX lets distance decide —  
> what's close stays sharp, what's far stays quiet."

PARALLAX reimagines the interface paradigm through **depth as a first-class dimension**. Every surface sits at a real spatial coordinate the system keeps track of, producing a natural hierarchy of attention:

| Depth | Zone   | Distance     | Layer              |
|-------|--------|--------------|--------------------|
| 0     | Z-000  | 0.0m — Foreground | **Active Focus** — full clarity, zero clutter |
| 1     | Z-001  | 0.4m         | **Ambient Agents** — helpers hover just behind your focus |
| 2     | Z-002  | 1.2m         | **Shared Presence** — teammates at conversational distance |
| 3     | Z-003  | 3.0m — Far Field | **Spatial Memory** — past sessions, fading but never gone |

---

## Tech Stack

### Client — `client/`

| Layer       | Technology                                        |
|-------------|---------------------------------------------------|
| Framework   | **[Next.js 14](https://nextjs.org/)** (App Router) |
| UI Library  | **React 18** with TypeScript                      |
| 3D Engine   | **[Three.js](https://threejs.org/)** (`r160`)     |
| Styling     | CSS custom properties + fluid responsive design   |

### Server — `server/`

| Layer       | Technology                                              |
|-------------|----------------------------------------------------------|
| Framework   | **[NestJS 10](https://nestjs.com/)** (MVC architecture)  |
| Runtime     | Node.js + TypeScript                                     |
| Rate Limit  | `@nestjs/throttler` — 10 requests / 60s                  |
| Validation  | `class-validator` + `class-transformer`                  |
| Config      | `@nestjs/config` with `.env` support                     |
| Cache (opt) | Redis via `ioredis` (available for horizontal scaling)   |

---

## Features

- **WebGL Particle System** — 3,200-point ambient starfield with parallax depth, scroll-aware camera, and mouse-reactive motion (responsive: 1,300 on mobile, respects `prefers-reduced-motion`).
- **Holographic Depth Panel** — Interactive 3D tilt card where layers respond at real parallax depths.
- **Depth Layer Cascade** — Four-layer card system with mouse-responsive parallax offset per element.
- **Live HUD** — Polling-based live point counter with visibility-aware throttling.
- **Access Request System** — Email-based waitlist with queue position tracking.
- **Scroll-Reveal Animations** — Intersection Observer-powered fade-in animations.
- **Custom Cursor Glow** — Radial gradient trails the pointer on fine-pointer devices.
- **Scroll Progress Bar** — Fixed top progress indicator with ARIA accessibility.
- **Keyboard & Screen Reader Accessible** — Skip-to-content link, semantic HTML, ARIA roles/live regions, focus-visible outlines.
- **Performance Optimized** — Pixel-ratio capping, cleanup on unmount, visibility-change pause.

---

## Project Structure

```
parallax-webapp/
├── client/                          # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css          # Global styles + design tokens
│   │   │   ├── layout.tsx           # Root layout with WebGL bg, cursor glow, scroll progress
│   │   │   └── page.tsx             # Home page composing all sections
│   │   ├── components/
│   │   │   ├── AccessForm.tsx       # Email access request form
│   │   │   ├── CursorGlow.tsx       # Mouse-following radial glow
│   │   │   ├── DepthLayers.tsx      # Four depth layer cards with parallax
│   │   │   ├── Footer.tsx           # Site footer
│   │   │   ├── Hero.tsx             # Hero section with HUD corner
│   │   │   ├── HoloPanel.tsx        # Interactive 3D tilt holographic panel
│   │   │   ├── HudPoints.tsx        # Live polling points counter
│   │   │   ├── Manifesto.tsx        # Manifesto section
│   │   │   ├── Navbar.tsx           # Fixed navigation bar
│   │   │   ├── ScrollProgress.tsx   # Scroll progress bar (ARIA progressbar)
│   │   │   ├── ScrollReveal.tsx     # Intersection Observer reveal wrapper
│   │   │   └── WebGLBackground.tsx  # Three.js particle system background
│   │   ├── services/
│   │   │   └── api.ts               # API client (fetch wrapper)
│   │   └── types/
│   │       └── index.ts             # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── next-env.d.ts
│
├── server/                          # NestJS backend
│   ├── src/
│   │   ├── app.module.ts            # Root module (config, throttler, feature modules)
│   │   ├── controllers/
│   │   │   └── health.controller.ts # Health check endpoint
│   │   ├── dto/
│   │   │   └── create-access-request.dto.ts
│   │   ├── models/
│   │   │   ├── access-request.model.ts
│   │   │   └── depth-point.model.ts
│   │   ├── modules/
│   │   │   ├── access/
│   │   │   │   ├── access.controller.ts   # POST /api/access/request, GET /api/access/queue
│   │   │   │   ├── access.module.ts
│   │   │   │   └── access.service.ts      # In-memory queue management
│   │   │   └── points/
│   │   │       ├── points.controller.ts   # GET /api/points/live, GET /api/points/field
│   │   │       ├── points.module.ts
│   │   │       └── points.service.ts      # Simulated live point data
│   │   └── utils/
│   │       └── exceptions/
│   │           └── http-exception.filter.ts
│   ├── package.json
│   └── tsconfig.json
│
├── install.sh                       # Unix install script
├── start-client.bat                 # Windows: start client dev server
├── start-server.bat                 # Windows: start server dev server
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

**Unix/macOS:**
```bash
chmod +x install.sh
./install.sh
```

**Windows (manual):**
```bash
cd client
npm install

cd ../server
npm install
```

### Running the Application

Start both the server and client in separate terminals:

**Terminal 1 -- Server (NestJS):**
```bash
cd server
npm run start:dev        # watches for changes
```

The server starts on `http://localhost:4000` by default.

**Terminal 2 -- Client (Next.js):**
```bash
cd client
npm run dev
```

The client starts on `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=4000
NODE_ENV=development
```

The client reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000/api`) for API calls.

---

## API Endpoints

| Method | Endpoint              | Description                        | Rate Limited |
|--------|-----------------------|------------------------------------|--------------|
| GET    | `/api/health`         | Health check (status, timestamp, version, uptime) | No |
| POST   | `/api/access/request` | Submit an email for early access    | Yes (10/min) |
| GET    | `/api/access/queue`   | Get queue position by email         | Yes (10/min) |
| GET    | `/api/points/live`    | Get current simulated point count   | No           |
| GET    | `/api/points/field`   | Get field status                    | No           |

---

## Build for Production

```bash
cd client
npm run build
npm start

cd ../server
npm run build
npm run start:prod
```

---

## Design Philosophy

PARALLAX explores an alternative to the flat-window paradigm:

- **Depth over stacking** -- instead of fighting for z-index priority, let spatial distance organize attention naturally.
- **Ambient over assertive** -- tools and agents exist in peripheral space until deliberately brought into focus.
- **Presence over profiles** -- shared work is represented as spatial proximity, not as a list of names.

---

## Accessibility

PARALLAX is built with accessibility in mind:

- Skip-to-content link
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<footer>`, `<section>`)
- ARIA roles: `progressbar`, `status`, `aria-live="polite"`
- `prefers-reduced-motion` -- disables animations, scroll behavior, and cursor glow
- `pointer: fine` detection -- enables/disables mouse-dependent interactions
- Focus-visible outlines with cyan accent
- `visibilitychange` detection -- pauses CPU-intensive animation and polling when tab is hidden

---

## License

MIT



