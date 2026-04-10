import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';

export const MirrorLineFade: React.FC = () => {
  const frame = useCurrentFrame();

  // TIMING:
  // Duration: 240 frames (4s)
  // Mirror line fade in: 0.5s mark (30 frames) to 1.3s (78 frames)
  const lineStart = 30;
  const lineEnd = 78;

  // Handle fade in: 2.8s mark (168 frames) to 3.2s (192 frames)
  const handleStart = 168;
  const handleEnd = 192;

  const lineOpacity = interpolate(
    frame,
    [lineStart, lineEnd],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const handleOpacity = interpolate(
    frame,
    [handleStart, handleEnd],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap');`}
      </style>

      {/* Main Container - transparent overlay */}
      
      {/* Mirror Line */}
      <div
        style={{
          position: 'absolute',
          top: '80%',
          width: '100%',
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 44,
          opacity: lineOpacity,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        someone got rich selling you the reflection.
      </div>

      {/* Handle */}
      <div
        style={{
          position: 'absolute',
          top: '86%',
          width: '100%',
          textAlign: 'center',
          color: '#C9A84C', // Gold
          fontFamily: "'Inter', sans-serif",
          fontWeight: 'bold',
          fontSize: 36,
          opacity: handleOpacity,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        @acemagnates
      </div>
    </AbsoluteFill>
  );
};
