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

type LowerThirdType = 'nameCard' | 'locationStamp' | 'yearTag' | 'evidenceQuote';

interface LowerThirdProps {
  type: LowerThirdType;
  primaryText: string;
  secondaryText?: string;
  position?: 'bottomLeft' | 'bottomCenter';
  accentColor?: string;
  startFrame?: number;
  holdFrames?: number;
}

// ── CONSTANTS ──────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ── MAIN EXPORT ────────────────────────────────────────

export const LowerThird: React.FC<LowerThirdProps> = ({
  type,
  primaryText,
  secondaryText,
  position = 'bottomLeft',
  accentColor = '#C9A84C',
  startFrame = 5,
  holdFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in
  const slideX = spring({
    frame: frame - startFrame,
    fps,
    from: position === 'bottomLeft' ? -40 : 0,
    to: 0,
    config: { damping: 16 },
  });

  const slideY = spring({
    frame: frame - startFrame,
    fps,
    from: 20,
    to: 0,
    config: { damping: 16 },
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], CLAMP);

  // Fade out
  const endFrame = startFrame + holdFrames;
  const fadeOut = interpolate(frame, [endFrame, endFrame + 10], [1, 0], CLAMP);

  const combinedOpacity = opacity * fadeOut;

  // Accent line reveal
  const lineScale = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.ease),
  });

  const isCenter = position === 'bottomCenter';

  // ── STYLES PER TYPE ────────────────────────────────

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 120,
    left: isCenter ? '50%' : 60,
    transform: isCenter
      ? `translateX(-50%) translateX(${slideX}px) translateY(${slideY}px)`
      : `translateX(${slideX}px) translateY(${slideY}px)`,
    opacity: combinedOpacity,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };

  if (type === 'nameCard') {
    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            {/* Gold accent bar */}
            <div style={{ width: 4, backgroundColor: accentColor, transform: `scaleY(${lineScale})`, transformOrigin: 'top', borderRadius: 2 }} />
            <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: 28, fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: 2 }}>
                {primaryText}
              </div>
              {secondaryText && (
                <div style={{ color: '#888888', fontSize: 18, fontFamily: 'sans-serif', letterSpacing: 1, marginTop: 4 }}>
                  {secondaryText}
                </div>
              )}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (type === 'locationStamp' || type === 'yearTag') {
    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 24, height: 1, backgroundColor: accentColor, transform: `scaleX(${lineScale})`, transformOrigin: 'left' }} />
            <div style={{ color: accentColor, fontSize: 20, fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' }}>
              {primaryText}
            </div>
          </div>
          {secondaryText && (
            <div style={{ color: '#888888', fontSize: 16, fontFamily: 'sans-serif', letterSpacing: 2, marginLeft: 36 }}>
              {secondaryText}
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // evidenceQuote
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={containerStyle}>
        <div style={{ backgroundColor: 'rgba(22, 22, 22, 0.9)', padding: '16px 24px', borderLeft: `3px solid ${accentColor}`, maxWidth: 700 }}>
          <div style={{ color: '#FFFFFF', fontSize: 22, fontFamily: 'serif', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{primaryText}"
          </div>
          {secondaryText && (
            <div style={{ color: accentColor, fontSize: 15, fontFamily: 'sans-serif', marginTop: 8, letterSpacing: 2 }}>
              — {secondaryText}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
