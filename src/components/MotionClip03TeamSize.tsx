import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const MotionClip03TeamSize: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // The exact text required
    const text = "25 EMPLOYEES";

    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#0A0A0A', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'nowrap', // Force a single line
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: '"Arial Black", "Impact", "Helvetica Neue", sans-serif',
                fontSize: '80px', // Reduced to 80px to safely fit within 1080px without cutting
                fontWeight: '900',
                color: '#C9A84C', // The required Ace Magnates gold
                textAlign: 'center',
                margin: '0',
                padding: '0',
                width: '100%',
                whiteSpace: 'nowrap', // Prevent text nodes from breaking
                lineHeight: '1.2'
            }}>
                {text.split('').map((char, index) => {
                    // Handle space so the words separate correctly
                    if (char === ' ') {
                        return <span key={index} style={{ width: '25px', display: 'inline-block' }} />;
                    }

                    // Staggering entrance (every 2 frames a new letter drops)
                    const delay = index * 2;
                    
                    // Spring physics for extreme kinetic "slam" and "wobble"
                    const pop = spring({
                        frame: frame - delay,
                        fps,
                        config: {
                            mass: 1.8,
                            damping: 10,
                            stiffness: 150,
                            overshootClamping: false,
                        }
                    });

                    // Z-axis force mapping: Start massive (z-axis zoom), snap to scale 1.
                    // pop goes from 0 -> ~1.2 (wobble) -> 1
                    let scale = interpolate(pop, [0, 1], [15, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'extend'
                    });
                    
                    // Prevent the text from flipping upside down if the spring overshoots heavily
                    scale = Math.max(0.6, scale);

                    // Fade in sharply to complement the heavy kinetic scale
                    const opacity = interpolate(pop, [0, 0.4], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    });

                    return (
                        <span 
                            key={index} 
                            style={{
                                display: 'inline-block',
                                transform: `scale(${scale})`,
                                opacity: pop > 0 ? opacity : 0,
                                textShadow: '0 4px 30px rgba(201, 168, 76, 0.25)', // slight glow
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
