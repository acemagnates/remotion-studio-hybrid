import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Easing,
  random,
} from 'remotion';

// Helper for formatting the number
const formatNumber = (n: number) => n.toLocaleString('en-US');

export const CourseVsProductsChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TIMING
  const riseDuration = 84; // 1.4s

  // ANIMATION: Gold bar rise (0 -> 75%) with overshoot
  // Using spring for the 5% overshoot and snapback
  const courseBarProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 12,
      stiffness: 90,
      mass: 1,
    },
  });
  const courseHeight = courseBarProgress * 75;

  // Counter
  const targetValue = 2400000;
  const currentCount = interpolate(
    Math.min(frame, riseDuration),
    [0, riseDuration],
    [0, targetValue],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease),
    }
  );

  // Particles: generate burst on completion
  // Burst happens when bar completes its rise (~frame 60 when spring peaks? Wait, rise duration is 1.4s = 84 frames. Let's start burst at frame 84 for simplicity)
  const burstFrame = 84;
  const showParticles = frame >= burstFrame;

  const particles = new Array(20).fill(0).map((_, i) => {
    // Generate random velocities for burst
    const angle = random('angle' + i) * Math.PI; // 0 to PI (upward arc)
    const speed = random('speed' + i) * 150 + 50; 
    return { angle, speed };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&family=Bebas+Neue&display=swap');`}
      </style>

      {/* Title */}
      <AbsoluteFill style={{ top: '10%', height: 'auto', textAlign: 'center' }}>
        <h1 style={{ color: '#FFFFFF', fontWeight: 500, fontSize: 40, margin: 0 }}>
          Products vs. Course Revenue
        </h1>
      </AbsoluteFill>

      {/* Chart Area */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          width: '100%',
          height: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '15%',
        }}
      >
        {/* Products Bar (Static) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
          <div
            style={{
              width: '100%',
              height: '30%', // static ~20%
              backgroundColor: '#888888',
              borderRadius: '8px 8px 0 0',
            }}
          />
          <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 52, marginTop: 20 }}>
            PRODUCTS
          </div>
        </div>

        {/* Course Bar (Animated) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
          {/* Counter element positioned right above the bar */}
          <div
            style={{
              color: '#C9A84C',
              fontWeight: 'bold',
              fontSize: 56, // Bold counter at top
              marginBottom: 10,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: 2,
            }}
          >
            ${formatNumber(Math.floor(currentCount))}
          </div>

          <div
            style={{
              width: '100%',
              height: `${courseHeight}%`,
              backgroundColor: '#C9A84C',
              borderRadius: '8px 8px 0 0',
              position: 'relative',
            }}
          >
            {/* Particles container anchored to top of bar */}
            {showParticles && (
              <div style={{ position: 'absolute', top: 0, left: '50%', width: 0, height: 0 }}>
                {particles.map((p, i) => {
                  const pFrame = frame - burstFrame;
                  const duration = 30; // 0.5s fade
                  
                  const pOpacity = interpolate(pFrame, [0, duration], [1, 0], { extrapolateRight: 'clamp' });
                  
                  // Simple physics
                  const timeSec = pFrame / fps;
                  const dx = Math.cos(p.angle) * p.speed * timeSec;
                  // upward velocity (negative y) + gravity
                  const dy = -Math.sin(p.angle) * p.speed * timeSec + (500 * timeSec * timeSec); 
                  
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        backgroundColor: '#C9A84C',
                        borderRadius: '50%',
                        opacity: pOpacity,
                        transform: `translate(${dx}px, ${dy}px)`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 52, marginTop: 20 }}>
            COURSE
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
