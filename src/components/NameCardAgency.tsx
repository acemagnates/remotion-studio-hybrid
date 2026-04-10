import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';

export const NameCardAgency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TIMING
  const durationInFrames = 420; // 7s total clip
  const entranceStart = 0;
  const holdStart = 12; // 0.2s for line to draw
  const exitStart = durationInFrames - 60; // Approximate exit (clip is 7s, exits before transition)

  // 1. Accent line draws left-to-right (0.2s = 12 frames)
  // Retracts right-to-left on exit (0.15s = 9 frames)
  const drawProgress = interpolate(
    frame,
    [entranceStart, entranceStart + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const retractProgress = interpolate(
    frame,
    [exitStart + 18, exitStart + 27],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const lineWidth = interpolate(
    retractProgress,
    [0, 1],
    [drawProgress * 100, 0] // 100% width when drawn, shrinks to 0 on exit
  );

  // 2. Line 1 slide up with spring (0.15s = 9 frames setup but spring handles timing)
  const line1YOffset = spring({
    frame: frame - holdStart,
    fps,
    from: 50,
    to: 0,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  });

  // Fade out on exit (0.3s = 18 frames)
  const exitOpacity = interpolate(
    frame,
    [exitStart, exitStart + 18],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const line1Opacity = interpolate(
    frame,
    [holdStart, holdStart + 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) * exitOpacity;

  // 3. Line 2 fades in simultaneously (0.2s = 12 frames)
  const line2Opacity = interpolate(
    frame,
    [holdStart, holdStart + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) * exitOpacity;

  return (
    <AbsoluteFill>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400&display=swap');
        `}
      </style>
      
      <div style={{ position: 'absolute', bottom: '15%', left: 80, display: 'flex', flexDirection: 'column' }}>
        
        {/* Gold Accent Line */}
        <div
          style={{
            height: 2,
            width: `${lineWidth}%`,
            backgroundColor: '#C9A84C', // Gold
            marginBottom: 15,
            transformOrigin: 'left',
          }}
        />

        {/* Clip container to hide Line 1 before it slides up */}
        <div style={{ overflow: 'hidden', paddingBottom: 5 }}>
          <div
             style={{
               fontFamily: "'Bebas Neue', sans-serif",
               color: '#C9A84C',
               fontWeight: 'bold',
               fontSize: 68,
               transform: `translateY(${line1YOffset}px)`,
               opacity: line1Opacity,
               lineHeight: 1,
               textShadow: '0px 4px 10px rgba(0,0,0,0.5)',
             }}
          >
            IMAN GADZHI
          </div>
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#FFFFFF',
            fontWeight: 400,
            fontSize: 36,
            opacity: line2Opacity,
            marginTop: 10,
            textShadow: '0px 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          Built an agency. Then sold the story.
        </div>
        
      </div>
    </AbsoluteFill>
  );
};
