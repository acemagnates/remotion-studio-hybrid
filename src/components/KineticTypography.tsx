import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── TYPES ──────────────────────────────────────────────

type KineticMode = 'slam' | 'counter' | 'typewriter' | 'letterReveal' | 'wordStagger';

interface KineticTypographyProps {
  text: string;
  mode: KineticMode;
  color?: string;
  fontSize?: number;
  fontFamily?: 'serif' | 'sans-serif' | 'monospace';
  counterRange?: [number, number];
  counterPrefix?: string;
  counterSuffix?: string;
  /** Frame within the sequence when the animation starts (default 0) */
  startFrame?: number;
}

// ── HELPERS ────────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const formatNumber = (n: number): string =>
  Math.floor(n).toLocaleString('en-US');

// ── SUB-COMPONENTS ─────────────────────────────────────

const Slam: React.FC<{ text: string; color: string; fontSize: number; fontFamily: string; start: number }> = ({
  text, color, fontSize, fontFamily, start,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - start,
    fps,
    from: 2.5,
    to: 1,
    config: { damping: 10, stiffness: 120 },
  });

  const opacity = interpolate(frame, [start, start + 3], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize,
          fontFamily,
          fontWeight: 'bold',
          color,
          transform: `scale(${scale})`,
          opacity,
          textShadow: `0 0 40px ${color}44`,
          letterSpacing: 2,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Counter: React.FC<{
  from: number; to: number; prefix: string; suffix: string;
  color: string; fontSize: number; fontFamily: string; start: number;
}> = ({ from, to, prefix, suffix, color, fontSize, fontFamily, start }) => {
  const frame = useCurrentFrame();

  const value = interpolate(frame, [start, start + 45], [from, to], {
    ...CLAMP,
    easing: Easing.out(Easing.ease),
  });

  const opacity = interpolate(frame, [start, start + 5], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize,
          fontFamily,
          fontWeight: 'bold',
          color,
          opacity,
          letterSpacing: -1,
          textShadow: `0 0 30px ${color}33`,
        }}
      >
        {prefix}{formatNumber(value)}{suffix}
      </div>
    </AbsoluteFill>
  );
};

const Typewriter: React.FC<{ text: string; color: string; fontSize: number; fontFamily: string; start: number }> = ({
  text, color, fontSize, fontFamily, start,
}) => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [start, start + text.length * 2], [0, text.length], CLAMP)
  );

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontSize,
          fontFamily,
          fontWeight: 600,
          color,
          letterSpacing: 1,
        }}
      >
        {text.substring(0, charCount)}
        <span style={{ opacity: frame % 10 < 5 ? 1 : 0 }}>|</span>
      </div>
    </AbsoluteFill>
  );
};

const LetterReveal: React.FC<{ text: string; color: string; fontSize: number; fontFamily: string; start: number }> = ({
  text, color, fontSize, fontFamily, start,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex' }}>
        {text.split('').map((char, i) => {
          const s = spring({
            frame: frame - (start + i * 4),
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });

          return (
            <span
              key={i}
              style={{
                fontSize,
                fontFamily,
                fontWeight: 'bold',
                color,
                transform: `scale(${s})`,
                display: 'inline-block',
                minWidth: char === ' ' ? fontSize * 0.3 : undefined,
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

const WordStagger: React.FC<{ text: string; color: string; fontSize: number; fontFamily: string; start: number }> = ({
  text, color, fontSize, fontFamily, start,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: fontSize * 0.3, maxWidth: '85%' }}>
        {words.map((word, i) => {
          const delay = start + i * 8;
          const scale = spring({
            frame: frame - delay,
            fps,
            from: 1.4,
            to: 1,
            config: { damping: 10 },
          });
          const opacity = interpolate(frame, [delay, delay + 5], [0, 1], CLAMP);

          return (
            <span
              key={i}
              style={{
                fontSize,
                fontFamily,
                fontWeight: 'bold',
                color,
                transform: `scale(${scale})`,
                opacity,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── MAIN EXPORT ────────────────────────────────────────

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text,
  mode,
  color = '#C9A84C',
  fontSize = 120,
  fontFamily = 'serif',
  counterRange = [0, 1000000],
  counterPrefix = '$',
  counterSuffix = '',
  startFrame = 0,
}) => {
  switch (mode) {
    case 'slam':
      return <Slam text={text} color={color} fontSize={fontSize} fontFamily={fontFamily} start={startFrame} />;
    case 'counter':
      return <Counter from={counterRange[0]} to={counterRange[1]} prefix={counterPrefix} suffix={counterSuffix} color={color} fontSize={fontSize} fontFamily={fontFamily} start={startFrame} />;
    case 'typewriter':
      return <Typewriter text={text} color={color} fontSize={fontSize} fontFamily={fontFamily} start={startFrame} />;
    case 'letterReveal':
      return <LetterReveal text={text} color={color} fontSize={fontSize} fontFamily={fontFamily} start={startFrame} />;
    case 'wordStagger':
      return <WordStagger text={text} color={color} fontSize={fontSize} fontFamily={fontFamily} start={startFrame} />;
    default:
      return null;
  }
};
