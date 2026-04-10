import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export const TenMillionDollarSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── FONTS ──
  // Import Bebas Neue dynamically for this component
  const bebasFontUrl = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";

  // ── TIMING CONSTANTS ──
  const slamDurationFrames = 4;
  const landFrame = slamDurationFrames;
  const subtextStartFrame = landFrame + 12;
  const subtextFadeDurationFrames = 24; // 0.4s at 60fps
  const zoomStartFrame = durationInFrames - 30; // Last 0.5s (30 frames at 60fps)

  // ── ANIMATION CALCULATIONS ──
  
  // 1. Slam Entrance (120% -> 100%)
  const numberScale = interpolate(
    frame,
    [0, slamDurationFrames],
    [1.2, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease), // ease-out, hard stop
    }
  );

  // 2. Continuous Slow Zoom at the end (100% -> 103%)
  const containerScale = interpolate(
    frame,
    [zoomStartFrame, durationInFrames],
    [1, 1.03],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.linear,
    }
  );

  // 3. Landing Tremor (±1.5px horizontal starting at landFrame)
  let translateX = 0;
  if (frame === landFrame + 1) translateX = 1.5;
  else if (frame === landFrame + 2) translateX = -1.5;
  else if (frame === landFrame + 3) translateX = 1.0;
  else if (frame === landFrame + 4) translateX = -1.0;

  // 4. White Flash
  // "a single-frame white flash fills the screen, then instantly cuts back"
  const showFlash = frame === landFrame;

  // 5. Sub-text Fade In
  const subtextOpacity = interpolate(
    frame,
    [subtextStartFrame, subtextStartFrame + subtextFadeDurationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', fontFamily: "'Bebas Neue', sans-serif" }}>
      {/* Import the font */}
      <style>
        {`@import url('${bebasFontUrl}');`}
      </style>

      {/* Main Container with slow zoom at the end */}
      <AbsoluteFill
        style={{
          transform: `scale(${containerScale})`,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Main Number Text */}
        <div
          style={{
            fontSize: 180,
            color: '#C9A84C', // Gold
            transform: `scale(${numberScale}) translateX(${translateX}px)`,
            letterSpacing: '-2px',
            lineHeight: 1,
            // To ensure pixel-perfect trembling isn't blurred
            willChange: 'transform',
          }}
        >
          $10,000,000
        </div>

        {/* Sub-text */}
        <div
          style={{
            fontSize: 48,
            color: '#FFFFFF', // White
            opacity: subtextOpacity,
            fontFamily: "sans-serif", // User wants lighter weight, we'll use standard sans
            fontWeight: 400,
            letterSpacing: '-0.5px',
            marginTop: 20,
          }}
        >
          not from what he was selling.
        </div>
      </AbsoluteFill>

      {/* Screen Flash Overlay */}
      {showFlash && (
        <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: 1, zIndex: 10 }} />
      )}
    </AbsoluteFill>
  );
};
