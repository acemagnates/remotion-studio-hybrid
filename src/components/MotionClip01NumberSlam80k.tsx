import React, { useMemo } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';

export const MotionClip01NumberSlam80k: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // The exact text required
    const text = "$80,000/MO";

    // Typography slam: aggressive entrance physics
    const pop = spring({
        frame,
        fps,
        config: {
            mass: 1.5,
            damping: 10, // low damping for bounce to ~110%
            stiffness: 150,
            overshootClamping: false,
        }
    });

    // Wobble applied during the hold
    const wobbleActive = frame > 15 ? 1 : 0;
    const wobble = Math.sin((frame - 15) * 0.2) * 0.01 * wobbleActive;
    
    // final scale maps the spring to roughly 1.0 (with an overshoot to ~1.1 because of damping: 10)
    const finalScale = Math.max(0, pop) + wobble;

    // Particles explosion setup
    const numParticles = 60;
    const particles = useMemo(() => {
        return new Array(numParticles).fill(true).map((_, i) => {
            const angle = random(`angle-${i}`) * Math.PI * 2;
            const velocity = random(`vel-${i}`) * 25 + 15;
            const size = random(`size-${i}`) * 10 + 4;
            const delay = random(`delay-${i}`) * 5; // slight variance in explosion start
            return { angle, velocity, size, delay };
        });
    }, []);

    return (
        <AbsoluteFill style={{ 
            backgroundColor: 'transparent', // Transparent WebM overlay
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            {/* Gold Dust Particles */}
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                {particles.map((p, i) => {
                    // Particle explosion starts immediately with the slam
                    const progress = Math.max(0, frame - p.delay); 
                    const distance = progress * p.velocity;
                    
                    // Fade out quickly after explosion
                    const opacity = interpolate(progress, [0, 5, 30, 45], [0, 1, 1, 0], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    });
                    
                    const x = Math.cos(p.angle) * distance;
                    const y = Math.sin(p.angle) * distance;

                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            width: p.size,
                            height: p.size,
                            backgroundColor: '#C9A84C', // Gold
                            borderRadius: '50%',
                            transform: `translate(${x}px, ${y}px)`,
                            opacity,
                            boxShadow: '0 0 15px rgba(201, 168, 76, 0.9)'
                        }} />
                    );
                })}
            </AbsoluteFill>

            {/* Typography */}
            <div style={{
                fontFamily: '"Monument Extended", "Druk", "Arial Black", "Impact", sans-serif',
                fontSize: '140px', // Massive, bold typography
                fontWeight: '900',
                color: '#FFFFFF',
                textShadow: '0 8px 35px rgba(201, 168, 76, 0.8)', // Subtle #C9A84C gold drop shadow
                transform: `scale(${finalScale})`,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                lineHeight: '1',
                zIndex: 10,
            }}>
                {text}
            </div>
        </AbsoluteFill>
    );
};
