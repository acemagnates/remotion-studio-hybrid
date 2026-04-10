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

interface BrandedEndframeProps {
  /** 'full' = logo + gradient + handle + CTA. 'watermark' = text only at 25% opacity */
  variant?: 'full' | 'watermark';
  handle?: string;
  cta?: string;
}

// ── CONSTANTS ──────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ── MAIN EXPORT ────────────────────────────────────────

export const BrandedEndframe: React.FC<BrandedEndframeProps> = ({
  variant = 'full',
  handle = '@AceMagnates',
  cta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── WATERMARK VARIANT ──────────────────────────────

  if (variant === 'watermark') {
    const opacity = interpolate(frame, [0, 20], [0, 0.25], CLAMP);

    return (
      <AbsoluteFill style={{ pointerEvents: 'none', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 }}>
        <div style={{ color: '#FFFFFF', fontSize: 13, letterSpacing: 6, fontFamily: 'sans-serif', fontWeight: 'bold', opacity }}>
          ACE MAGNATES
        </div>
      </AbsoluteFill>
    );
  }

  // ── FULL ENDFRAME VARIANT ──────────────────────────

  // Background fade in
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], CLAMP);

  // Logo scale
  const logoScale = spring({
    frame: frame - 10,
    fps,
    from: 0.6,
    to: 1,
    config: { damping: 14 },
  });

  const logoOpacity = interpolate(frame, [10, 18], [0, 1], CLAMP);

  // Horizontal line
  const lineScale = interpolate(frame, [20, 35], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.ease),
  });

  // Handle text
  const handleOpacity = interpolate(frame, [30, 40], [0, 1], CLAMP);

  // CTA
  const ctaOpacity = cta ? interpolate(frame, [40, 50], [0, 1], CLAMP) : 0;

  // Gold dot pulse
  const dotScale = spring({
    frame: frame - 50,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', opacity: bgOpacity }}>
      {/* Obsidian gradient at bottom */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />

      {/* Center content */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {/* Logo text */}
        <div
          style={{
            fontSize: 72,
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: '#C9A84C',
            letterSpacing: 15,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            textShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
          }}
        >
          ACE
        </div>

        <div
          style={{
            fontSize: 28,
            fontFamily: 'serif',
            fontWeight: 500,
            color: '#C9A84C',
            letterSpacing: 20,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginTop: 5,
          }}
        >
          MAGNATES
        </div>

        {/* Horizontal rule */}
        <div
          style={{
            width: 400,
            height: 1,
            backgroundColor: '#C9A84C',
            transform: `scaleX(${lineScale})`,
            marginTop: 30,
            marginBottom: 30,
          }}
        />

        {/* Handle */}
        <div
          style={{
            fontSize: 18,
            fontFamily: 'sans-serif',
            color: '#888888',
            letterSpacing: 4,
            opacity: handleOpacity,
          }}
        >
          {handle}
        </div>

        {/* CTA */}
        {cta && (
          <div
            style={{
              fontSize: 22,
              fontFamily: 'sans-serif',
              color: '#FFFFFF',
              letterSpacing: 2,
              opacity: ctaOpacity,
              marginTop: 40,
            }}
          >
            {cta}
          </div>
        )}

        {/* Gold dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            transform: `scale(${dotScale})`,
            marginTop: 50,
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
