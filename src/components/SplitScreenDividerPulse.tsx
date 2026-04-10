import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

export const SplitScreenDividerPulse: React.FC = () => {
  const frame = useCurrentFrame();

  // TIMING:
  // Duration: 240 frames (4s)
  // Glow boom: 0.6s ease-in (36 frames), holds 0.3s (18 frames), fades 0.6s (36 frames)
  // Total line pulse = 90 frames.
  const pulseRampUpEnd = 36;
  const pulseHoldEnd = 54;
  const pulseFadeEnd = 90;

  // Fade-in text at 1.8s mark (frame 108), duration 0.5s (30 frames)
  // Holds 1.8s (108 frames), slow fade-out 0.4s (24 frames) before match cut
  const textStart = 108;
  const textFadeInEnd = 138;
  const textFadeOutStart = 216; 
  const textFadeOutEnd = 240;

  const glowWidthBytes = interpolate(
    frame,
    [0, pulseRampUpEnd, pulseHoldEnd, pulseFadeEnd],
    [0, 8, 8, 0], // Blooms 8px outward 
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  const glowOpacity = interpolate(
    frame,
    [0, pulseRampUpEnd, pulseHoldEnd, pulseFadeEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const textOpacity = interpolate(
    frame,
    [textStart, textFadeInEnd, textFadeOutStart, textFadeOutEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@1,500&display=swap');`}
      </style>

      {/* Main Container - transparent */}
      
      {/* Vertical Gold Line - dead center */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% - 1px)',
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#C9A84C',
          boxShadow: `0 0 ${glowWidthBytes}px ${glowWidthBytes / 2}px rgba(201,168,76,${glowOpacity})`,
        }}
      />

      {/* Lower Third Text */}
      <div
        style={{
          position: 'absolute',
          top: '88%',
          width: '100%',
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: "'Crimson Pro', serif",
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 38,
          opacity: textOpacity,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)', // Ensures legibility over any background
        }}
      >
        same dream. different side of the screen.
      </div>
    </AbsoluteFill>
  );
};
