import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── TYPES ──────────────────────────────────────────────

type TransitionType = 'chromaticSplit' | 'zoomThrough' | 'glitchBurst';

interface TransitionClipProps {
  type: TransitionType;
  intensity?: number;
  direction?: 'horizontal' | 'vertical';
  durationFrames?: number;
}

// ── CONSTANTS ──────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ── CHROMATIC SPLIT ────────────────────────────────────

const ChromaticSplit: React.FC<{ intensity: number; direction: string }> = ({ intensity, direction }) => {
  const frame = useCurrentFrame();

  const split = interpolate(frame, [0, 4, 8, 12], [0, intensity * 15, intensity * 8, 0], CLAMP);
  const opacity = interpolate(frame, [0, 2, 10, 14], [0, 1, 1, 0], CLAMP);

  const isH = direction === 'horizontal';

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      {/* Red channel */}
      <AbsoluteFill
        style={{
          backgroundColor: '#FF0000',
          opacity: 0.15,
          transform: isH ? `translateX(${split}px)` : `translateY(${split}px)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* Blue channel */}
      <AbsoluteFill
        style={{
          backgroundColor: '#0000FF',
          opacity: 0.15,
          transform: isH ? `translateX(${-split}px)` : `translateY(${-split}px)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* Scanline burst */}
      <AbsoluteFill
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.03) 1px, transparent 2px, transparent 4px)',
          opacity: split > 2 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

// ── ZOOM THROUGH ───────────────────────────────────────

const ZoomThrough: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = spring({
    frame,
    fps,
    from: 1,
    to: 1 + intensity * 3,
    config: { damping: 8, stiffness: 100 },
  });

  const opacity = interpolate(frame, [0, 3, 10, 15], [0, 1, 1, 0], CLAMP);

  const blur = interpolate(frame, [0, 5, 10, 15], [0, 8, 4, 0], CLAMP);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Zoom ring effect */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, transparent 0%, transparent ${30 / zoom}%, rgba(201, 168, 76, ${0.1 * intensity}) ${60 / zoom}%, transparent 80%)`,
          transform: `scale(${zoom})`,
          opacity,
          filter: `blur(${blur}px)`,
        }}
      />
      {/* Speed lines */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, transparent 20%, rgba(255, 255, 255, ${0.03 * intensity * zoom}) 50%, transparent 70%)`,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ── GLITCH BURST ───────────────────────────────────────

const GlitchBurst: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();

  const glitchOpacity = interpolate(frame, [0, 2, 6, 10], [0, 1, 0.5, 0], CLAMP);

  // Pseudo-random glitch slice positions (deterministic)
  const slices = [0.15, 0.35, 0.55, 0.72, 0.88].map((pos, i) => {
    const shift = interpolate(
      frame,
      [i, i + 2, i + 5],
      [0, (i % 2 === 0 ? 1 : -1) * intensity * 30, 0],
      CLAMP
    );
    return { top: `${pos * 100}%`, height: `${3 + i * 2}%`, shift };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: glitchOpacity }}>
      {slices.map((slice, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: slice.top,
            left: 0,
            width: '100%',
            height: slice.height,
            backgroundColor: i % 2 === 0 ? '#C9A84C' : '#FFFFFF',
            opacity: 0.08 * intensity,
            transform: `translateX(${slice.shift}px)`,
          }}
        />
      ))}

      {/* Flash */}
      <AbsoluteFill
        style={{
          backgroundColor: '#FFFFFF',
          opacity: interpolate(frame, [0, 1, 3], [0, 0.3 * intensity, 0], CLAMP),
        }}
      />
    </AbsoluteFill>
  );
};

// ── MAIN EXPORT ────────────────────────────────────────

export const TransitionClip: React.FC<TransitionClipProps> = ({
  type,
  intensity = 0.8,
  direction = 'horizontal',
}) => {
  switch (type) {
    case 'chromaticSplit':
      return <ChromaticSplit intensity={intensity} direction={direction} />;
    case 'zoomThrough':
      return <ZoomThrough intensity={intensity} />;
    case 'glitchBurst':
      return <GlitchBurst intensity={intensity} />;
    default:
      return null;
  }
};
