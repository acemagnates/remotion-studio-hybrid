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

// ==========================================
// GLOBAL ELEMENTS
// ==========================================

const BackgroundLayers: React.FC = () => {
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 4px)',
          opacity: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [60, 90], [0, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          color: '#FFFFFF',
          fontSize: 13,
          letterSpacing: 6,
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          opacity,
        }}
      >
        ACE MAGNATES
      </div>
    </AbsoluteFill>
  );
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [
    { left: '20%', speed: 0.5, startY: 110 },
    { left: '40%', speed: 0.3, startY: 120 },
    { left: '60%', speed: 0.6, startY: 105 },
    { left: '80%', speed: 0.4, startY: 115 },
    { left: '30%', speed: 0.7, startY: 125 },
    { left: '70%', speed: 0.5, startY: 100 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {dots.map((dot, i) => {
        const yPos = interpolate(
          frame,
          [0, 210],
          [dot.startY, dot.startY - dot.speed * 210],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: dot.left,
              top: `${yPos}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#C9A84C',
              opacity: 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ==========================================
// SCENES
// ==========================================

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frame 20
  const moneyScale = spring({
    frame: frame - 20,
    fps,
    from: 3.0,
    to: 1.0,
    config: { damping: 12 },
  });
  const moneyOpacity = interpolate(frame, [20, 21], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Frame 60
  const subtitleOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Frame 100
  const lineWidth = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  // Frame 130
  const phrase1 = 'No degree. No inheritance. No permission.'.split(' ');

  // Frame 170
  const phrase2Opacity = interpolate(frame, [170, 190], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Particles />

      {frame >= 20 && (
        <div
          style={{
            fontSize: 180,
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: '#C9A84C',
            transform: `scale(${moneyScale})`,
            opacity: moneyOpacity,
            lineHeight: 1,
            textShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
          }}
        >
          $10,000,000
        </div>
      )}

      {frame >= 60 && (
        <div
          style={{
            fontSize: 40,
            fontFamily: 'sans-serif',
            fontWeight: 300,
            color: '#FFFFFF',
            opacity: subtitleOpacity,
            marginTop: 10,
          }}
        >
          built by a 22-year-old.
        </div>
      )}

      {frame >= 100 && (
        <div
          style={{
            width: '60%',
            height: 2,
            backgroundColor: '#C9A84C',
            transform: `scaleX(${lineWidth})`,
            marginTop: 50,
            marginBottom: 50,
          }}
        />
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        {phrase1.map((word, i) => {
          const wordOpacity = interpolate(frame, [130 + i * 8, 130 + i * 8 + 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                color: '#888888',
                fontSize: 32,
                fontFamily: 'serif',
                opacity: wordOpacity,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {frame >= 170 && (
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontFamily: 'serif',
            fontStyle: 'italic',
            letterSpacing: 2,
            opacity: phrase2Opacity,
            marginTop: 40,
          }}
        >
          None of it came from what he was selling.
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frame 0 (local global 210)
  const titleX = spring({
    frame,
    fps,
    from: -80,
    to: 0,
    config: { damping: 14 },
  });
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cards = ['SHOPIFY', 'PRINT-ON-DEMAND', 'AFFILIATE MARKETING'];

  // Frame 250 (local 460)
  const outOpacity = interpolate(frame, [250, 290], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          color: '#C9A84C',
          fontSize: 52,
          fontFamily: 'serif',
          fontWeight: 'bold',
          transform: `translateX(${titleX}px)`,
          opacity: titleOpacity,
          marginBottom: 60,
        }}
      >
        2 years. Every playbook.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'center' }}>
        {cards.map((card, i) => {
          const appearFrame = 60 + i * 30; // Global 270, 300, 330 -> Local 60, 90, 120
          
          const cardScale = spring({
            frame: frame - appearFrame,
            fps,
            from: 0.9,
            to: 1,
            config: { damping: 15 },
          });
          const cardOpacity = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const strikeFrame = 210 + i * 10; // Global 420
          const strikeScaleX = interpolate(frame, [strikeFrame, strikeFrame + 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.ease),
          });

          return (
            <div
              key={i}
              style={{
                width: '75%',
                backgroundColor: '#161616',
                borderLeft: '4px solid #C9A84C',
                padding: 20,
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ color: '#FFFFFF', fontSize: 24, fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                {card}
              </span>
              <span style={{ color: '#FF4444', fontSize: 16, fontFamily: 'sans-serif', marginTop: 8 }}>
                ❌ Dead
              </span>

              {/* Strikethrough */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  width: '100%',
                  height: 4,
                  backgroundColor: '#FF4444',
                  transform: `scaleX(${strikeScaleX})`,
                  transformOrigin: 'left',
                  zIndex: 10,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          color: '#FFFFFF',
          fontSize: 44,
          fontFamily: 'serif',
          opacity: outOpacity,
          marginTop: 60,
        }}
      >
        All of it died.
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local 0: Flash
  const flashOpacity = interpolate(frame, [0, 3, 6], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Local 5: Then one thing worked
  const y1 = spring({ frame: frame - 5, fps, from: 60, to: 0, config: { damping: 14 } });
  const op1 = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 60: AGENCY
  const word = 'AGENCY'.split('');

  // Local 150: vertical line
  const lineScaleY = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  // Local 180: But the agency...
  const op2 = interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 220: The failure was.
  const scaleFail = spring({
    frame: frame - 220,
    fps,
    from: 0.5,
    to: 1.0,
    config: { damping: 8, stiffness: 80 },
  });
  const opFail = interpolate(frame, [220, 221], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 250: Every dead store...
  const finalWords = 'Every dead store. Every wasted month. Packaged. Sold.'.split(' ');

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: flashOpacity, zIndex: 100 }} />

      <div
        style={{
          color: '#FFFFFF',
          fontSize: 48,
          fontFamily: 'serif',
          transform: `translateY(${y1}px)`,
          opacity: op1,
          position: 'absolute',
          top: '15%',
        }}
      >
        Then one thing worked.
      </div>

      <div style={{ display: 'flex', position: 'absolute', top: '25%' }}>
        {word.map((char, i) => {
          const s = spring({
            frame: frame - (60 + i * 6),
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });
          return (
            <span
              key={i}
              style={{
                color: '#FFD700',
                fontSize: 110,
                fontFamily: 'serif',
                fontWeight: 'bold',
                transform: `scale(${s})`,
                display: 'inline-block',
                textShadow: '0px 0px 20px rgba(255, 215, 0, 0.4)',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      <div
        style={{
          width: 2,
          height: 120,
          backgroundColor: '#C9A84C',
          transform: `scaleY(${lineScaleY})`,
          transformOrigin: 'top',
          position: 'absolute',
          top: '45%',
        }}
      />

      <div
        style={{
          color: '#FFFFFF',
          fontSize: 30,
          fontFamily: 'sans-serif',
          opacity: op2,
          position: 'absolute',
          top: '60%',
        }}
      >
        But the agency wasn't the product.
      </div>

      {frame >= 220 && (
        <div
          style={{
            color: '#C9A84C',
            fontSize: 52,
            fontFamily: 'serif',
            fontWeight: 'bold',
            transform: `scale(${scaleFail})`,
            opacity: opFail,
            position: 'absolute',
            top: '68%',
          }}
        >
          The failure was.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, position: 'absolute', top: '80%', flexWrap: 'wrap', justifyContent: 'center', width: '80%' }}>
        {finalWords.map((w, i) => {
          const wOp = interpolate(frame, [250 + i * 6, 250 + i * 6 + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span key={i} style={{ color: '#FFFFFF', fontSize: 24, fontFamily: 'serif', opacity: wOp }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local 10: Two columns
  const colOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 50: Counters
  const prodVal = interpolate(frame, [50, 150], [0, 340000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  const courseVal = interpolate(frame, [50, 120], [0, 10000000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  // Local 150: Gold line
  const lineX = interpolate(frame, [150, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });

  // Local 170: The course sold faster
  const tOp1 = interpolate(frame, [170, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 190: Every. Single. Time.
  const est = ['Every.', 'Single.', 'Time.'];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      
      <div style={{ display: 'flex', width: '80%', justifyContent: 'space-between', opacity: colOpacity, position: 'absolute', top: '25%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%' }}>
          <span style={{ color: '#888888', fontSize: 22, fontFamily: 'sans-serif', fontWeight: 'bold' }}>PRODUCTS</span>
          <span style={{ color: '#FFFFFF', fontSize: 64, fontFamily: 'monospace', letterSpacing: -1, marginTop: 20 }}>
            ${Math.floor(prodVal).toLocaleString('en-US')}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%' }}>
          <span style={{ color: '#C9A84C', fontSize: 22, fontFamily: 'sans-serif', fontWeight: 'bold' }}>COURSE</span>
          <span style={{ color: '#FFD700', fontSize: 64, fontFamily: 'monospace', letterSpacing: -1, marginTop: 20, textShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}>
            ${Math.floor(courseVal).toLocaleString('en-US')}
          </span>
          <div style={{ width: '100%', height: 4, backgroundColor: '#C9A84C', marginTop: 15, transform: `scaleX(${lineX})`, transformOrigin: 'center' }} />
        </div>
      </div>

      <div style={{ color: '#FFFFFF', fontSize: 38, fontFamily: 'serif', opacity: tOp1, position: 'absolute', top: '55%' }}>
        The course sold faster.
      </div>

      <div style={{ display: 'flex', gap: 15, position: 'absolute', top: '65%' }}>
        {est.map((w, i) => {
          const sFrame = 190 + i * 15;
          const pulsing = spring({
            frame: frame - sFrame,
            fps,
            from: 1.3,
            to: 1.0,
            config: { damping: 10 },
          });
          const op = interpolate(frame, [sFrame, sFrame + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <span key={i} style={{ color: '#C9A84C', fontSize: 32, fontFamily: 'serif', fontWeight: 'bold', opacity: op, transform: `scale(${pulsing})` }}>
              {w}
            </span>
          );
        })}
      </div>

    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local 10: He didnt succeed
  const slideX = spring({ frame: frame - 10, fps, from: 100, to: 0, config: { damping: 14 } });
  const tOp1 = interpolate(frame, [10, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dimOp = interpolate(frame, [90, 100], [1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const combinedOpText1 = frame >= 90 ? dimOp : tOp1;

  // Local 100: He succeeded
  const slideY = spring({ frame: frame - 100, fps, from: 50, to: 0, config: { damping: 14 } });
  const tOp2 = interpolate(frame, [100, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 160: ripple 1
  const rip1S = interpolate(frame, [160, 200], [0, 1.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
  const rip1O = interpolate(frame, [160, 200], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 200: To everyone
  const wordsFail = 'To everyone still failing at it.'.split(' ');

  // Local 230: ripple 2
  const rip2S = interpolate(frame, [230, 270], [0, 1.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
  const rip2O = interpolate(frame, [230, 270], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 260: Horizontal line
  const hlX = interpolate(frame, [260, 280], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Ripple 1 */}
      {frame >= 160 && frame < 200 && (
         <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: '50%', border: '1px solid #C9A84C', transform: `scale(${rip1S})`, opacity: rip1O, pointerEvents: 'none' }} />
      )}
      
      {/* Ripple 2 */}
      {frame >= 230 && frame < 270 && (
         <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: '50%', border: '1px solid #C9A84C', transform: `scale(${rip2S})`, opacity: rip2O, pointerEvents: 'none' }} />
      )}

      {frame >= 10 && (
        <div style={{ color: '#FFFFFF', fontSize: 42, fontFamily: 'serif', transform: `translateX(${slideX}px)`, opacity: combinedOpText1, position: 'absolute', top: '35%' }}>
          He didn't succeed at the side hustle.
        </div>
      )}

      {frame >= 100 && (
        <div style={{ color: '#C9A84C', fontSize: 46, fontFamily: 'serif', fontWeight: 'bold', transform: `translateY(${slideY}px)`, opacity: tOp2, position: 'absolute', top: '48%' }}>
          He succeeded at selling the dream of it.
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, position: 'absolute', top: '65%' }}>
        {wordsFail.map((w, i) => {
          const wFrame = 200 + i * 12;
          const wY = interpolate(frame, [wFrame, wFrame + 10], [-40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
          const wOp = interpolate(frame, [wFrame, wFrame + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <span key={i} style={{ color: '#FF4444', fontSize: 36, fontFamily: 'serif', transform: `translateY(${wY}px)`, opacity: wOp }}>
              {w}
            </span>
          );
        })}
      </div>

      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', top: '80%' }}>
        <div style={{ width: '40%', height: 1, backgroundColor: '#C9A84C', transform: `scaleX(${hlX})`, transformOrigin: 'right' }} />
        <div style={{ width: '40%', height: 1, backgroundColor: '#C9A84C', transform: `scaleX(${hlX})`, transformOrigin: 'left' }} />
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local 15: Typewriter
  const targetText = "You didn't buy a course.";
  const typeIndex = Math.floor(interpolate(frame, [15, 60], [0, targetText.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const visibleText = targetText.substring(0, typeIndex);
  
  // Local 80: fades to 30%
  const tOp1 = interpolate(frame, [80, 90], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 90: mirror
  const scaleMirrorText = spring({ frame: frame - 90, fps, from: 0.7, to: 1.0, config: { damping: 14 } });
  const tOp2 = interpolate(frame, [90, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 120: Rectangle mirror frame
  const frameScaleX = spring({ frame: frame - 120, fps, from: 0, to: 1, config: { damping: 16 } });
  const frameScaleY = spring({ frame: frame - 125, fps, from: 0, to: 1, config: { damping: 16 } }); // slightly offset

  // Local 140: And someone got rich
  const tOp3 = interpolate(frame, [140, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 155: reflection
  const upDrift = interpolate(frame, [155, 175], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) });
  const tOp4 = interpolate(frame, [155, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Global Fade (Local 170-180, wait: 1490-1500 is local 170-180)
  const globalFadeOut = interpolate(frame, [170, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Local 180: Gold dot pulse
  const dotScale = spring({ frame: Math.max(0, frame - 180), fps, from: 0, to: 1, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Content wrapper to apply global fade out */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: 1 - globalFadeOut }}>
        
        {frame >= 15 && (
          <div style={{ color: '#FFFFFF', fontSize: 38, fontFamily: 'serif', opacity: tOp1, position: 'absolute', top: '25%' }}>
            {visibleText}
          </div>
        )}

        {frame >= 90 && (
          <div style={{ color: '#C9A84C', fontSize: 56, fontFamily: 'serif', fontWeight: 'bold', transform: `scale(${scaleMirrorText})`, opacity: tOp2, position: 'absolute', top: '50%', marginTop: -30 }}>
            You bought a mirror.
          </div>
        )}

        {frame >= 120 && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 180, marginLeft: -300, marginTop: -90, border: '1px solid #C9A84C', transform: `scale(${frameScaleX}, ${frameScaleY})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {frame >= 140 && (
              <div style={{ color: '#FFFFFF', fontSize: 28, fontFamily: 'sans-serif', opacity: tOp3, marginTop: -20, marginBottom: 10 }}>
                And someone got rich
              </div>
            )}
            {frame >= 155 && (
              <div style={{ color: '#C9A84C', fontSize: 34, fontFamily: 'serif', fontStyle: 'italic', letterSpacing: 3, opacity: tOp4, transform: `translateY(${upDrift}px)` }}>
                selling you the reflection.
              </div>
            )}
          </div>
        )}
      </AbsoluteFill>

      {/* Final Dot Black Overlay Override */}
      {frame >= 170 && (
         <AbsoluteFill style={{ backgroundColor: `rgba(10,10,10,${globalFadeOut})`, zIndex: 100 }} />
      )}

      {frame >= 180 && (
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FFD700', transform: `scale(${dotScale})`, position: 'absolute', left: '50%', top: '50%', marginLeft: -3, marginTop: -3, zIndex: 200, boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }} />
      )}

    </AbsoluteFill>
  );
};

// ==========================================
// MAIN COMPOSITION
// ==========================================

export default function ImanGadzhi() {
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <BackgroundLayers />
      
      <Sequence from={0} durationInFrames={210}>
        <Scene1 />
      </Sequence>
      
      <Sequence from={210} durationInFrames={300}>
        <Scene2 />
      </Sequence>

      <Sequence from={510} durationInFrames={300}>
        <Scene3 />
      </Sequence>

      <Sequence from={810} durationInFrames={210}>
        <Scene4 />
      </Sequence>

      <Sequence from={1020} durationInFrames={300}>
        <Scene5 />
      </Sequence>

      <Sequence from={1320} durationInFrames={181}>
        <Scene6 />
      </Sequence>

      <Watermark />
    </AbsoluteFill>
  );
}
