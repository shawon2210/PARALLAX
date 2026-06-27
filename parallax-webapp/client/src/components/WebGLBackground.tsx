'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* P0 FIX: module-level cached glow texture */
let cachedGlowTexture: THREE.CanvasTexture | null = null;

function getGlowTexture(): THREE.CanvasTexture {
  if (cachedGlowTexture) return cachedGlowTexture;
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  cachedGlowTexture = new THREE.CanvasTexture(c);
  return cachedGlowTexture;
}

const FOG_COLOR = 0x060611;
const CAMERA_Z_BASE = 14;
const CAMERA_Z_SCROLL_OFFSET = 10;
const ROTATION_SPEED_Y = 0.6;
const ROTATION_SPEED_X = 0.18;
const CORE_ROTATION_Y = 0.0022;
const CORE_ROTATION_X = 0.0012;
const CAMERA_LERP = 0.04;
const CAMERA_Z_LERP = 0.06;
const CORE_RADIUS = 2.1;
const GLOW_RADIUS = 2.6;
const CORE_OPACITY = 0.5;
const GLOW_OPACITY = 0.1;
const HERO_FADE_FACTOR = 3;

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(FOG_COLOR, 0.032);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z_BASE);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* --- Particle system --- */
    const particleCount = window.innerWidth < 768 ? 1300 : 3200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorA = new THREE.Color(0x7b61ff);
    const colorB = new THREE.Color(0x34f5e4);

    for (let i = 0; i < particleCount; i++) {
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 8;
      const mix = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: getGlowTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* --- Core mesh --- */
    const coreGeo = new THREE.IcosahedronGeometry(CORE_RADIUS, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x9b8bff,
      wireframe: true,
      transparent: true,
      opacity: CORE_OPACITY,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 0, 2);
    scene.add(core);

    /* --- Glow mesh --- */
    const glowGeo = new THREE.IcosahedronGeometry(GLOW_RADIUS, 1);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x34f5e4,
      wireframe: true,
      transparent: true,
      opacity: GLOW_OPACITY,
    });
    const coreGlow = new THREE.Mesh(glowGeo, glowMat);
    coreGlow.position.copy(core.position);
    scene.add(coreGlow);

    /* --- Mouse tracking --- */
    let mouseX = 0;
    let mouseY = 0;
    let heroScrollT = 0;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove);

    const onScroll = () => {
      heroScrollT = Math.min(1, window.scrollY / (window.innerHeight * 0.9 || 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let visible = true;
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    /* P0 FIX: store RAF ID */
    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!visible) return;

      const t = performance.now() * 0.0001;

      if (!reducedMotion) {
        particles.rotation.y = t * ROTATION_SPEED_Y;
        particles.rotation.x = t * ROTATION_SPEED_X;
        core.rotation.y += CORE_ROTATION_Y;
        core.rotation.x += CORE_ROTATION_X;
        coreGlow.rotation.copy(core.rotation);
      }

      const targetX = finePointer ? mouseX * 0.6 : 0;
      const targetY = finePointer ? mouseY * 0.4 : 0;
      camera.position.x += (targetX - camera.position.x) * CAMERA_LERP;
      camera.position.y += (-targetY - camera.position.y) * CAMERA_LERP;

      const targetZ = CAMERA_Z_BASE - heroScrollT * CAMERA_Z_SCROLL_OFFSET;
      camera.position.z += (targetZ - camera.position.z) * CAMERA_Z_LERP;
      camera.lookAt(0, 0, 0);

      const heroFade = Math.max(0, 1 - heroScrollT * HERO_FADE_FACTOR);
      core.material.opacity = CORE_OPACITY * heroFade;
      coreGlow.material.opacity = GLOW_OPACITY * heroFade;

      renderer.render(scene, camera);
    }
    animate();

    /* P0 FIX: full cleanup */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);

      scene.remove(particles);
      particleGeo.dispose();
      particleMat.dispose();

      scene.remove(core);
      coreGeo.dispose();
      coreMat.dispose();

      scene.remove(coreGlow);
      glowGeo.dispose();
      glowMat.dispose();

      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="webgl-bg" aria-hidden="true" />;
}
