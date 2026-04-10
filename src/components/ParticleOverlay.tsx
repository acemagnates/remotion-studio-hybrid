import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';

// ── TYPES ──────────────────────────────────────────────

type ParticleType = 'dust' | 'embers' | 'paper' | 'goldRain' | 'burst';

interface ParticleOverlayProps {
  type: ParticleType;
  count?: number;
  direction?: 'up' | 'down' | 'outward';
  speed?: number;
  color?: string;
  opacity?: number;
}

// ── CONSTANTS ──────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ── SEED GENERATOR (deterministic) ─────────────────────

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

// ── PARTICLE GENERATORS ────────────────────────────────

interface ParticleDef {
  x: number;       // 0-100%
  startY: number;  // 0-150%
  endY: number;
  size: number;
  opacity: number;
  drift: number;   // horizontal drift
  rotation: number;
}

const generateParticles = (
  count: number,
  type: ParticleType,
  direction: 'up' | 'down' | 'outward',
  speed: number,
): ParticleDef[] => {
  return Array.from({ length: count }).map((_, i) => {
    const r = seededRandom;
    const x = r(i * 37 + 7) * 100;
    const baseY = direction === 'up' ? 110 + r(i * 53) * 40 : -10 - r(i * 53) * 40;
    const travel = (200 + r(i * 19) * 100) * speed * (direction === 'up' ? -1 : 1);

    let size = 2;
    if (type === 'dust') size = 1.5 + r(i * 11) * 2;
    if (type === 'embers') size = 2 + r(i * 11) * 3;
    if (type === 'paper') size = 6 + r(i * 11) * 8;
    if (type === 'goldRain') size = 1 + r(i * 11) * 1.5;
    if (type === 'burst') size = 2 + r(i * 11) * 4;

    return {
      x,
      startY: direction === 'outward' ? 50 : baseY,
      endY: direction === 'outward' ? (r(i * 23) > 0.5 ? -20 : 120) : baseY + travel,
      size,
      opacity: 0.15 + r(i * 71) * 0.5,
      drift: (r(i * 41) - 0.5) * 30,
      rotation: r(i * 61) * 360,
    };
  });
};

// ── RENDER PARTICLE ────────────────────────────────────

const renderParticle = (
  p: ParticleDef,
  progress: number,
  type: ParticleType,
  color: string,
  globalOpacity: number,
): React.CSSProperties => {
  const y = p.startY + (p.endY - p.startY) * progress;
  const x = p.x + p.drift * progress;
  const rot = p.rotation * progress;
  const fadeIn = Math.min(progress * 5, 1);
  const fadeOut = Math.max(1 - (progress - 0.85) * 6.67, 0);
  const alpha = p.opacity * fadeIn * fadeOut * globalOpacity;

  const base: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    opacity: alpha,
    pointerEvents: 'none',
  };

  if (type === 'paper') {
    return {
      ...base,
      width: p.size * 2,
      height: p.size * 2.5,
      backgroundColor: color,
      transform: `rotate(${rot}deg)`,
      borderRadius: 1,
    };
  }

  if (type === 'embers') {
    return {
      ...base,
      width: p.size,
      height: p.size,
      backgroundColor: color,
      borderRadius: '50%',
      boxShadow: `0 0 ${p.size * 2}px ${color}`,
    };
  }

  // dust, goldRain, burst — simple circles
  return {
    ...base,
    width: p.size,
    height: p.size,
    backgroundColor: color,
    borderRadius: '50%',
  };
};

// ── MAIN EXPORT ────────────────────────────────────────

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({
  type = 'dust',
  count = 25,
  direction = 'up',
  speed = 1,
  color = '#C9A84C',
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = { durationInFrames: 300 }; // fallback, overridden by Sequence

  const particles = React.useMemo(
    () => generateParticles(count, type, direction, speed),
    [count, type, direction, speed]
  );

  const progress = interpolate(frame, [0, 300], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <div key={i} style={renderParticle(p, progress, type, color, opacity)} />
      ))}
    </AbsoluteFill>
  );
};
