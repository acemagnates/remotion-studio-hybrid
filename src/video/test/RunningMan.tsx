import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from 'remotion';

const TextPopup: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '80%', gap: '12px', zIndex: 10 }}>
      {words.map((word, i) => {
        const delay = i * 4;
        const wordBounce = spring({
          frame: frame - delay,
          fps,
          config: { damping: 12 },
        });

        return (
          <span
            key={i}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 800,
              fontSize: '48px',
              color: '#f3dca0',
              textShadow: '0 0 20px rgba(243, 220, 160, 0.4)',
              transform: `scale(${wordBounce}) translateY(${interpolate(wordBounce, [0, 1], [50, 0])}px)`,
              opacity: interpolate(wordBounce, [0, 1], [0, 1]),
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const RunningMan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Hit wall at frame 40
  const impactFrame = 40;
  
  // X translation: starts offscreen left, runs to center (width/2) and stops abruptly at impactFrame
  const runProgress = interpolate(frame, [0, impactFrame], [-width * 0.5, width * 0.45], {
    extrapolateRight: 'clamp',
  });

  // Small running bounce effect
  const runBounce = frame < impactFrame ? Math.abs(Math.sin(frame * 0.5)) * 40 : 0;

  // Impact recoil on the body
  const recoil = spring({
    frame: frame - impactFrame,
    fps,
    config: { damping: 10, mass: 2, stiffness: 200 },
  });
  
  const bodyX = runProgress - (recoil * 30); // Body bounces back slightly
  
  // Head rotates heavily down on impact
  const headRotation = interpolate(
    spring({ frame: frame - impactFrame, fps, config: { damping: 14 } }), 
    [0, 1], 
    [0, 80]
  );
  
  // Screen shake on impact
  const screenShakeX = frame >= impactFrame && frame < impactFrame + 10 ? (Math.random() - 0.5) * 20 : 0;
  const screenShakeY = frame >= impactFrame && frame < impactFrame + 10 ? (Math.random() - 0.5) * 20 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Container holding the shake effect */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', transform: `translate(${screenShakeX}px, ${screenShakeY}px)` }}>
        
        {/* Invisible Wall Line for visual context */}
        <div style={{
          position: 'absolute',
          left: width * 0.5,
          top: '20%',
          height: '60%',
          width: '6px',
          background: `linear-gradient(to bottom, transparent, rgba(230, 80, 80, ${interpolate(frame, [impactFrame, impactFrame + 10], [0, 0.8], { extrapolateRight: 'clamp'})}), transparent)`,
          boxShadow: '0 0 30px rgba(230,80,80,0.5)'
        }} />

        {/* The Running Guy Group */}
        <g style={{
          position: 'absolute',
          left: 0,
          top: height * 0.45,
          transform: `translate(${bodyX}px, ${runBounce}px)`
        }}>
          {/* Body SVG */}
          <svg width="200" height="300" viewBox="0 0 200 300" style={{ overflow: 'visible' }}>
            <circle cx="100" cy="80" r="30" fill="none" stroke="#cf9f33" strokeWidth="12"
              style={{ transformOrigin: '100px 110px', transform: `rotate(${headRotation}deg)` }} 
            />
            <line x1="100" y1="110" x2="100" y2="200" stroke="#cf9f33" strokeWidth="12" strokeLinecap="round" />
            {/* Arms - statically positioned as running for simplicity */}
            <path d="M 100 130 Q 150 120 160 160" fill="none" stroke="#cf9f33" strokeWidth="12" strokeLinecap="round" />
            <path d="M 100 130 Q 50 140 40 100" fill="none" stroke="#cf9f33" strokeWidth="12" strokeLinecap="round" />
            {/* Legs */}
            <path d="M 100 200 Q 140 250 150 280" fill="none" stroke="#cf9f33" strokeWidth="12" strokeLinecap="round" />
            <path d="M 100 200 Q 60 210 50 260" fill="none" stroke="#cf9f33" strokeWidth="12" strokeLinecap="round" />
          </svg>
        </g>
      </div>

      {/* Kinetic Typography pops up after impact */}
      <Sequence from={impactFrame + 15}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: '15%' }}>
          <TextPopup text="that's what happens when you don't look where you're going" />
        </AbsoluteFill>
      </Sequence>
      
    </AbsoluteFill>
  );
};
