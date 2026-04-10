import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const NUM_PARTICLES = 30;
const PARTICLES = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
  x: (i * 37) % 100,
  yStart: 110 + ((i * 29) % 50),
  yEnd: (110 + ((i * 29) % 50)) - (300 * (0.15 + ((i % 5) * 0.05))),
  size: 1.5 + (i % 3),
  opacity: 0.2 + ((i % 10) * 0.04),
}));

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [0, 150, 300], [0.8, 1, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, rgba(13, 13, 13, ${pulse}) 0%, #000000 100%)`,
      }}
    >
      <ParticleField />
    </AbsoluteFill>
  );
};

const ParticleField: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {PARTICLES.map((p, i) => {
        const yPos = interpolate(frame, [0, 300], [p.yStart, p.yEnd], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              backgroundColor: '#C9A84C',
              borderRadius: '50%',
              opacity: p.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const HorizontalLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleX = spring({
    fps,
    frame,
    config: { damping: 14, mass: 0.8 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: 700,
          height: 3,
          backgroundColor: '#C9A84C',
          transform: `scaleX(${scaleX})`,
          opacity,
          boxShadow: '0px 0px 15px rgba(201, 168, 76, 0.5)',
        }}
      />
    </AbsoluteFill>
  );
};

const AceText: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 1], [0.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize: 180,
          fontFamily: 'serif',
          fontWeight: 900,
          color: '#FFD700',
          letterSpacing: 45,
          transform: `translateY(-130px) scale(${scale})`,
          marginLeft: 45,
          opacity: progress,
          textShadow: '0px 0px 30px rgba(201, 168, 76, 0.4)',
        }}
      >
        ACE
      </div>
    </AbsoluteFill>
  );
};

const MagnatesText: React.FC = () => {
  const frame = useCurrentFrame();
  const text = 'MAGNATES';

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          transform: 'translateY(65px)',
          paddingLeft: 30,
        }}
      >
        {text.split('').map((char, i) => {
          const startFrame = 80 + i * 3;
          const opacity = interpolate(
            frame,
            [startFrame, startFrame + 15],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );
          const yOffset = interpolate(
            frame,
            [startFrame, startFrame + 15],
            [20, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.ease),
            }
          );

          return (
            <span
              key={i}
              style={{
                fontSize: 55,
                fontFamily: 'serif',
                fontWeight: 600,
                color: '#C9A84C',
                letterSpacing: 30,
                opacity,
                transform: `translateY(${yOffset}px)`,
                textShadow: '0px 0px 15px rgba(201, 168, 76, 0.3)',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Diamond: React.FC = () => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(frame, [120, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const dashLength = 2000;
  const strokeDashoffset = interpolate(drawProgress, [0, 1], [dashLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [120, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotation = interpolate(frame, [120, 300], [0, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
      <svg
        width="600"
        height="600"
        viewBox="0 0 600 600"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <rect
          x="100"
          y="100"
          width="400"
          height="400"
          fill="none"
          stroke="rgba(201, 168, 76, 0.3)"
          strokeWidth="4"
          strokeDasharray={dashLength}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(45 300 300)"
        />
        <rect
          x="120"
          y="120"
          width="360"
          height="360"
          fill="none"
          stroke="rgba(255, 215, 0, 0.8)"
          strokeWidth="1"
          strokeDasharray={dashLength}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(45 300 300)"
        />
      </svg>
    </AbsoluteFill>
  );
};

const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const stats = [
    { label: 'WEALTH', value: 145, suffix: 'B' },
    { label: 'POWER', value: 100, suffix: '%' },
    { label: 'LEGACY', value: 2050, suffix: '' },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 150,
      }}
    >
      {stats.map((stat, i) => {
        const startFrame = 180 + i * 20;

        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 15],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        const counterVal = interpolate(
          frame,
          [startFrame, startFrame + 40],
          [0, stat.value],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.ease),
          }
        );

        const barWidth = interpolate(
          frame,
          [startFrame + 10, startFrame + 40],
          [0, 100],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.ease),
          }
        );

        const globalFadeOut = interpolate(frame, [240, 255], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              width: 800,
              display: 'flex',
              flexDirection: 'column',
              opacity: opacity * globalFadeOut,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 12,
                fontFamily: 'sans-serif',
                color: '#fff',
                fontSize: 22,
                letterSpacing: 6,
              }}
            >
              <span style={{ color: '#888' }}>{stat.label}</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                {Math.floor(counterVal)}
                {stat.suffix}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: `${barWidth}%`,
                  height: '100%',
                  backgroundColor: '#C9A84C',
                  boxShadow: '0px 0px 10px rgba(201, 168, 76, 0.5)',
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const EndingPhase: React.FC = () => {
  const frame = useCurrentFrame();

  const overlayOpacity = interpolate(frame, [280, 290], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scaleDot = interpolate(frame, [280, 300], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{ backgroundColor: '#000000', opacity: overlayOpacity }}
      />
      {frame >= 280 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#FFD700',
              transform: `scale(${scaleDot})`,
              opacity: overlayOpacity,
              boxShadow: '0px 0px 20px rgba(255, 215, 0, 0.8)',
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const MainSequence: React.FC = () => {
  const frame = useCurrentFrame();

  const globalScale = interpolate(frame, [240, 260], [1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  const pullY = interpolate(frame, [240, 260], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  const glowOpacity = interpolate(frame, [240, 260, 280], [0, 1, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${globalScale}) translateY(${pullY}px)`,
          alignItems: 'center',
          justifyContent: 'center',
          filter: `drop-shadow(0px 0px 80px rgba(255, 215, 0, ${glowOpacity * 0.5}))`,
        }}
      >
        <Diamond />
        <HorizontalLine />
        <AceText />
        <MagnatesText />
      </AbsoluteFill>
      <Stats />
      <EndingPhase />
    </AbsoluteFill>
  );
};

export default function AceMagnates() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <Background />
      <Sequence from={0} durationInFrames={300}>
        <MainSequence />
      </Sequence>
    </AbsoluteFill>
  );
}
