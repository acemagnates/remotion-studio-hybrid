import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';

// ── TYPES ──────────────────────────────────────────────

interface BeatSyncVFXProps {
  /**
   * Array of frame numbers where VFX events should fire.
   * In auto mode, these would be computed from audio peaks.
   * In manual mode, the user specifies them directly.
   */
  peakFrames: number[];
  /** Type of visual effect to fire on each peak */
  effectType?: 'flash' | 'vignettePulse' | 'scalePop' | 'goldFlicker';
  /** Intensity multiplier (0-1) */
  intensity?: number;
}

// ── CONSTANTS ──────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ── SUB-EFFECTS ────────────────────────────────────────

const FlashEffect: React.FC<{ peakFrames: number[]; intensity: number }> = ({ peakFrames, intensity }) => {
  const frame = useCurrentFrame();

  let opacity = 0;
  for (const peak of peakFrames) {
    const dist = frame - peak;
    if (dist >= 0 && dist < 5) {
      const flash = interpolate(dist, [0, 2, 5], [intensity * 0.8, intensity * 0.6, 0], CLAMP);
      opacity = Math.max(opacity, flash);
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

const VignettePulse: React.FC<{ peakFrames: number[]; intensity: number }> = ({ peakFrames, intensity }) => {
  const frame = useCurrentFrame();

  let pulseStrength = 0;
  for (const peak of peakFrames) {
    const dist = frame - peak;
    if (dist >= 0 && dist < 12) {
      const pulse = interpolate(dist, [0, 4, 12], [0, intensity * 0.7, 0], CLAMP);
      pulseStrength = Math.max(pulseStrength, pulse);
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, ${pulseStrength}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

const ScalePop: React.FC<{ peakFrames: number[]; intensity: number }> = ({ peakFrames, intensity }) => {
  const frame = useCurrentFrame();

  let scale = 1;
  for (const peak of peakFrames) {
    const dist = frame - peak;
    if (dist >= 0 && dist < 8) {
      const pop = interpolate(dist, [0, 2, 8], [1, 1 + intensity * 0.08, 1], CLAMP);
      scale = Math.max(scale, pop);
    }
  }

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    />
  );
};

const GoldFlicker: React.FC<{ peakFrames: number[]; intensity: number }> = ({ peakFrames, intensity }) => {
  const frame = useCurrentFrame();

  let opacity = 0;
  for (const peak of peakFrames) {
    const dist = frame - peak;
    if (dist >= 0 && dist < 6) {
      const flicker = interpolate(dist, [0, 1, 3, 6], [0, intensity * 0.3, intensity * 0.15, 0], CLAMP);
      opacity = Math.max(opacity, flicker);
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#C9A84C',
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

// ── MAIN EXPORT ────────────────────────────────────────

export const BeatSyncVFX: React.FC<BeatSyncVFXProps> = ({
  peakFrames,
  effectType = 'flash',
  intensity = 1,
}) => {
  switch (effectType) {
    case 'flash':
      return <FlashEffect peakFrames={peakFrames} intensity={intensity} />;
    case 'vignettePulse':
      return <VignettePulse peakFrames={peakFrames} intensity={intensity} />;
    case 'scalePop':
      return <ScalePop peakFrames={peakFrames} intensity={intensity} />;
    case 'goldFlicker':
      return <GoldFlicker peakFrames={peakFrames} intensity={intensity} />;
    default:
      return null;
  }
};
