import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, random } from 'remotion';

export const MotionClip08GraphCrash: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ─── TIMING & SETUP ───
    const buildDuration = 60; // Draws the climb
    const crashStart = 80;
    const crashDuration = 10;
    const crashHitFrame = crashStart + 7; // Approx when it crosses the x-axis

    // ─── POINTS ───
    const p0 = { x: 150, y: 1400 };
    const p1 = { x: 350, y: 1300 };
    const p2 = { x: 550, y: 1000 };
    const p3 = { x: 750, y: 400 }; // The Peak

    // ─── ANIMATE DRAW CLIMB ───
    const drawProgress = spring({
        frame,
        fps,
        config: { damping: 200, stiffness: 40 }, // Smooth ease-in-out
        durationInFrames: buildDuration,
    });

    const len1 = 223.6; // distance p0-p1
    const len2 = 360.5; // distance p1-p2
    const len3 = 632.4; // distance p2-p3
    const totalClimbLength = len1 + len2 + len3;
    const currentDrawLength = drawProgress * totalClimbLength;

    let climbPath = `M ${p0.x},${p0.y}`;
    if (currentDrawLength > 0) {
        if (currentDrawLength <= len1) {
            const ratio = currentDrawLength / len1;
            climbPath += ` L ${p0.x + (p1.x - p0.x) * ratio},${p0.y + (p1.y - p0.y) * ratio}`;
        } else if (currentDrawLength <= len1 + len2) {
            const ratio = (currentDrawLength - len1) / len2;
            climbPath += ` L ${p1.x},${p1.y} L ${p1.x + (p2.x - p1.x) * ratio},${p1.y + (p2.y - p1.y) * ratio}`;
        } else {
            const ratio = Math.min(1, (currentDrawLength - len1 - len2) / len3);
            climbPath += ` L ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p2.x + (p3.x - p2.x) * ratio},${p2.y + (p3.y - p2.y) * ratio}`;
        }
    }

    // ─── CRASH ANIMATION ───
    const crashProgress = interpolate(frame, [crashStart, crashStart + crashDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.in(Easing.exp),
    });

    const crashPoint = {
        x: p3.x + (950 - p3.x) * crashProgress,
        y: p3.y + (1600 - p3.y) * crashProgress,
    };

    let fullPath = climbPath;
    if (frame >= crashStart) {
        fullPath += ` L ${crashPoint.x},${crashPoint.y}`;
    }

    // COLOR SHIFT (Gold -> Red right as it snaps)
    const lineColor = frame >= crashStart + 2 ? '#FF1111' : '#C9A84C';

    // ─── AXIS SHATTER ANIMATION ───
    const axisY = 1400;
    const leftAxisEnd = 850;
    
    const hitSpring = spring({
        frame: frame - crashHitFrame,
        fps,
        config: { mass: 2, damping: 10, stiffness: 200 }
    });

    const shatteredRotation = hitSpring * -30; // Rotate down/right
    const shatteredDrop = hitSpring * 150;     // Drop down
    const shatteredOpacity = interpolate(frame, [crashHitFrame + 10, crashHitFrame + 30], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // ─── TEXT ANIMATION ───
    const textOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const textYOffset = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });

    // ─── BACKGROUND PARTICLES ───
    const particles = new Array(80).fill(0).map((_, i) => ({
        x: random(`x-${i}`) * 1080,
        yStart: random(`y-${i}`) * 2500, // Spread across screen vertically and slightly below
        speed: 3 + random(`speed-${i}`) * 5, // Faster
        size: 3 + random(`size-${i}`) * 6, // Larger
        opacity: 0.15 + random(`opacity-${i}`) * 0.3 // Dimmed slightly for white background
    }));

    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#F7F9FC', // Off-white/light-grey base paper color
            backgroundImage: `
                linear-gradient(to right, rgba(0, 100, 255, 0.08) 2px, transparent 2px),
                linear-gradient(to bottom, rgba(0, 100, 255, 0.08) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px' // Graph paper squares
        }}>
            {/* PARTICLES */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                {particles.map((p, i) => {
                    const yPos = p.yStart - (frame * p.speed);
                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: p.x,
                            top: yPos,
                            width: p.size,
                            height: p.size,
                            backgroundColor: '#C9A84C', // Ace Magnates gold dust
                            borderRadius: '50%',
                            opacity: p.opacity,
                            filter: 'blur(1px)' // subtle glowing dust effect
                        }} />
                    );
                })}
            </div>

            <div style={{
                position: 'absolute',
                top: 220,
                left: 150,
                fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                fontWeight: '900',
                fontSize: '85px',
                color: '#0A0A0A', // Changed to very dark to contrast the white graph paper
                letterSpacing: '5px',
                opacity: textOpacity,
                transform: `translateY(${textYOffset}px)`,
            }}>
                VIEWERSHIP
            </div>

            <svg viewBox="0 0 1080 1920" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {/* LEFT AXIS Y */}
                <line x1={150} y1={400} x2={150} y2={1400} stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" />

                {/* BOTTOM AXIS X - INTEL (LEFT PART) */}
                <line x1={150} y1={axisY} x2={leftAxisEnd} y2={axisY} stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" />

                {/* BOTTOM AXIS X - SHATTERED (RIGHT PART) */}
                <g style={{
                    transformOrigin: `${leftAxisEnd}px ${axisY}px`,
                    transform: frame >= crashHitFrame ? `rotate(${shatteredRotation}deg) translateY(${shatteredDrop}px)` : 'none',
                    opacity: frame >= crashHitFrame ? shatteredOpacity : 1
                }}>
                    <line x1={leftAxisEnd} y1={axisY} x2={950} y2={axisY} stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" />
                    {/* Add some "sparks" or broken shards */}
                    {frame >= crashHitFrame && (
                        <>
                            <circle cx={leftAxisEnd + 20} cy={axisY - 10} r="6" fill="#C9A84C" />
                            <circle cx={leftAxisEnd + 40} cy={axisY + 15} r="8" fill="#FF1111" />
                            <circle cx={leftAxisEnd - 10} cy={axisY + 30} r="5" fill="#0A0A0A" />
                        </>
                    )}
                </g>

                {/* MAIN GRAPH LINE */}
                <path
                    d={fullPath}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        filter: `drop-shadow(0px 10px 15px rgba(0,0,0,0.15))`,
                        transition: 'stroke 0.1s ease-out'
                    }}
                />

                {/* PEAK DOT */}
                {frame >= buildDuration && (
                    <circle cx={p3.x} cy={p3.y} r="18" fill={lineColor} 
                        style={{ filter: `drop-shadow(0px 8px 10px rgba(0,0,0,0.15))`, opacity: frame >= crashStart && frame < crashStart + crashDuration ? 0 : 1 }}
                    />
                )}
                
                {/* CRASH DOT */}
                {frame >= crashStart && (
                    <circle cx={crashPoint.x} cy={crashPoint.y} r="18" fill="#FF1111" style={{ filter: `drop-shadow(0px 8px 10px rgba(0,0,0,0.2))`}} />
                )}
            </svg>
        </AbsoluteFill>
    );
};
