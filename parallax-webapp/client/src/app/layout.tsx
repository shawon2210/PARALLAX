import type { Metadata, Viewport } from 'next';
import './globals.css';
import WebGLBackground from '@/components/WebGLBackground';
import CursorGlow from '@/components/CursorGlow';
import ScrollProgress from '@/components/ScrollProgress';

export const metadata: Metadata = {
  title: 'PARALLAX — An Interface With Depth',
  description:
    'PARALLAX is an ambient spatial computing layer that organizes your tools, agents and presence by depth — not by which app they live in.',
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <WebGLBackground />
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="cursor-glow" id="cursorGlow" aria-hidden="true" />
        <div className="scroll-progress" id="scrollProgress" />
        <CursorGlow />
        <ScrollProgress />

        {children}
      </body>
    </html>
  );
}
