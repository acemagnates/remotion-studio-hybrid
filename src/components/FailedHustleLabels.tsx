import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Sequence,
} from 'remotion';

// Helper component for individual label
const Label: React.FC<{ text: string; delay: number; duration: number }> = ({ text, delay, duration }) => {
  const frame = useCurrentFrame();
  
  // Animation: slide in from left (0.15s = 9 frames)
  const translateX = interpolate(
    frame - delay,
    [0, 9],
    [-200, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease),
    }
  );

  const opacity = interpolate(
    frame - delay,
    [0, 9],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease),
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '75%',
        left: 80,
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: '10px 20px',
        transform: `translateX(${translateX}px)`,
        opacity: opacity,
      }}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue', 'sans-serif'",
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontSize: 52,
          letterSpacing: '1px',
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const FailedHustleLabels: React.FC = () => {
  const frame = useCurrentFrame();

  const cut1 = 0;
  const cut2 = 108; // 1.8s
  const cut3 = 216; // 3.6s
  
  // "All of it died." fades in under the 3rd label. (0.4s fade = 24 frames)
  // Let's start the fade somewhat after the 3rd label appears.
  const finalLineFadeStart = cut3 + 30; 
  
  const finalLineOpacity = interpolate(
    frame,
    [finalLineFadeStart, finalLineFadeStart + 24],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}
      </style>

      {/* Label 1 */}
      {frame >= cut1 && frame < cut2 && (
        <Label text="Shopify." delay={cut1} duration={cut2 - cut1} />
      )}

      {/* Label 2 */}
      {frame >= cut2 && frame < cut3 && (
        <Label text="Print-on-demand." delay={cut2} duration={cut3 - cut2} />
      )}

      {/* Label 3 */}
      {frame >= cut3 && (
        <>
          <Label text="Affiliate marketing." delay={cut3} duration={144} />
          
          <div
            style={{
              position: 'absolute',
              top: 'calc(75% + 80px)', // Below the label
              left: 80,
              backgroundColor: 'rgba(0,0,0,0.35)',
              padding: '10px 20px',
              opacity: finalLineOpacity,
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', 'sans-serif'",
                fontWeight: 'bold',
                color: '#C9A84C', // Gold
                fontSize: 62,
                letterSpacing: '1px',
              }}
            >
              All of it died.
            </span>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
