import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const GoldGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Reveal animation for the line graph
  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 90,
  });

  // Calculate the path of the graph
  const points = [
    { x: 0.1 * width, y: 0.8 * height },
    { x: 0.3 * width, y: 0.75 * height },
    { x: 0.5 * width, y: 0.5 * height },
    { x: 0.7 * width, y: 0.6 * height },
    { x: 0.9 * width, y: 0.2 * height },
  ];

  const pathContent = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const strokeDasharray = 3000;
  const strokeDashoffset = interpolate(progress, [0, 1], [strokeDasharray, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={width} height={height} style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cf9f33" />
            <stop offset="50%" stopColor="#f3dca0" />
            <stop offset="100%" stopColor="#b48325" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* The glowing gold line */}
        <path
          d={pathContent}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          filter="url(#glow)"
        />
        
        {/* Draw the points appearing over time */}
        {points.map((p, i) => {
          const pointFrameDelay = i * 15;
          const pointScale = spring({
            frame: frame - pointFrameDelay,
            fps,
            config: {
              damping: 12,
            },
          });
          
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={12 * pointScale}
              fill="#f3dca0"
              stroke="#0B0F19"
              strokeWidth="4"
              style={{
                opacity: pointScale > 0 ? 1 : 0
              }}
            />
          );
        })}
      </svg>
      
      {/* Dynamic Text fading and sliding up */}
      <div style={{
        position: 'absolute',
        top: height * 0.1,
        color: '#f3dca0',
        fontSize: '8em',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 'bold',
        opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(frame, [30, 60], [100, 0], { extrapolateRight: 'clamp' })}px)`
      }}>
        THE UPSIDE
      </div>
    </AbsoluteFill>
  );
};
