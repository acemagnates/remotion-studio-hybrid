import React, { useMemo, useRef } from 'react';
import { 
    AbsoluteFill, 
    useCurrentFrame, 
    useVideoConfig, 
    spring, 
    interpolate, 
    Easing, 
    random,
    Sequence
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Shadow } from '@react-three/drei';
import * as THREE from 'three';

// ─── STYLES & CONSTANTS ───
const GOLD = '#C9A84C';
const OBSIDIAN = '#0A0A0A';
const GLASS_ALPHA = 0.15;

// ─── THREE.JS COMPONENTS ───

const GlassShard: React.FC<{ seed: number; index: number }> = ({ seed, index }) => {
    const frame = useCurrentFrame();
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Random properties based on seed
    const pos = useMemo(() => [
        (random(`x-${seed}`) - 0.5) * 10,
        (random(`y-${seed}`) - 0.5) * 15,
        (random(`z-${seed}`) - 0.5) * 5
    ], [seed]);

    const scale = useMemo(() => 0.5 + random(`scale-${seed}`) * 1.5, [seed]);
    const rotationSpeed = useMemo(() => (random(`rot-${seed}`) - 0.5) * 0.02, [seed]);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += rotationSpeed;
            meshRef.current.rotation.y += rotationSpeed * 0.5;
            // Float effect handled by pos + frame
            meshRef.current.position.y += Math.sin(frame * 0.02 + index) * 0.005;
        }
    });

    return (
        <mesh 
            ref={meshRef} 
            position={[pos[0], pos[1], pos[2]]} 
            scale={[scale, scale, scale]}
        >
            <icosahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial 
                color="#ffffff"
                metalness={0.9}
                roughness={0.05}
                transmission={0.8}
                thickness={0.5}
                transparent
                opacity={0.4}
                envMapIntensity={2}
            />
        </mesh>
    );
};

const ShatteredGlassParallax: React.FC = () => {
    const { width, height } = useVideoConfig();
    const shards = useMemo(() => new Array(25).fill(0).map((_, i) => i), []);

    return (
        <ThreeCanvas width={width} height={height} style={{ position: 'absolute', zIndex: 0 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color={GOLD} />
            <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            
            {shards.map((i) => (
                <GlassShard key={i} index={i} seed={i * 1337} />
            ))}
            
            <mesh position={[0, 0, -5]} scale={[20, 40, 1]}>
                <planeGeometry />
                <meshStandardMaterial color={OBSIDIAN} />
            </mesh>
        </ThreeCanvas>
    );
};

// ─── UI COMPONENTS ───

const VaultBar: React.FC<{ 
    index: number; 
    value: number; 
    totalBars: number; 
    entranceProgress: number;
    fractureProgress: number;
}> = ({ index, value, totalBars, entranceProgress, fractureProgress }) => {
    // Kintsugi Fracture logic:
    // Before healing, the bar is split into shards.
    // For simplicity, we'll use a staggered scale and offset.
    
    const height = value * 800;
    const width = 120;
    const gap = 40;
    const x = (index - totalBars / 2) * (width + gap) + 540;
    
    // HEAVY_VAULT_SNAP easing for individual bars
    const barDelay = index * 0.05;
    const snap = spring({
        frame: entranceProgress * 100 - barDelay * 100,
        fps: 60,
        config: { damping: 12, stiffness: 100, mass: 1 },
    });

    // Fracture effect: shards flying into place
    const shardOffset = (1 - snap) * 200 * (random(`shard-${index}`) - 0.5);
    const shardRotate = (1 - snap) * 45;

    return (
        <g transform={`translate(${x}, ${1400}) scale(1, -1)`}>
            {/* Vaulted Effect (Inner Shadow) */}
            <rect 
                x={-width/2 + shardOffset} 
                y={shardRotate} 
                width={width} 
                height={height * snap} 
                fill={GOLD}
                stroke={OBSIDIAN}
                strokeWidth="2"
                style={{
                    filter: 'drop-shadow(0px 0px 10px rgba(201, 168, 76, 0.4))',
                }}
            />
            {/* Kintsugi Seam (Gold Highlight) */}
            {fractureProgress > 0 && (
                <path 
                    d={`M ${-width/2} ${height/2} L ${width/2} ${height/2 + 20}`}
                    stroke={GOLD}
                    strokeWidth="4"
                    opacity={interpolate(fractureProgress, [0, 0.5, 1], [0, 1, 0])}
                    filter="blur(2px)"
                />
            )}
        </g>
    );
};

// ─── MAIN COMPONENT ───

export const MotionClip04Disruption: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // ─── TIMING ───
    // 0-45: Entrance & Fracture
    // 45: SHATTER/SYNC POINT
    // 45-150: Stabilization & Float
    
    const entranceProgress = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 60 },
        durationInFrames: 60,
    });

    const crashSyncFrame = 45;
    const isCrashed = frame >= crashSyncFrame;
    
    const fractureProgress = interpolate(frame, [crashSyncFrame - 5, crashSyncFrame, crashSyncFrame + 15], [0, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const data = [0.8, 0.9, 0.75, 0.3]; // The "Crash" happens on the last bar

    const textOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp' });
    const textBlur = interpolate(frame, [10, 30], [20, 0], { extrapolateLeft: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: OBSIDIAN }}>
            {/* DEPTH LAYER */}
            <ShatteredGlassParallax />

            {/* RADIAL GLOW */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.15) 0%, transparent 70%)`,
                zIndex: 1,
            }} />

            {/* MOTION LAYER */}
            <div style={{ zIndex: 2, width: '100%', height: '100%', position: 'relative' }}>
                {/* TEXTS */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: 'Inter, "Arial Black", sans-serif',
                    color: '#FFFFFF',
                    opacity: textOpacity,
                    filter: `blur(${textBlur}px)`,
                }}>
                    <h1 style={{ 
                        fontSize: '120px', 
                        margin: 0, 
                        letterSpacing: '10px',
                        fontWeight: 900,
                        textShadow: '0 0 30px rgba(255,255,255,0.3)'
                    }}>
                        AD MARKET
                    </h1>
                    <h2 style={{ 
                        fontSize: '180px', 
                        margin: '-20px 0 0 0', 
                        color: isCrashed && frame % 10 < 5 ? '#FF0000' : GOLD,
                        fontWeight: 900,
                        letterSpacing: '20px',
                        transition: 'color 0.1s ease',
                    }}>
                        CRASH
                    </h2>
                </div>

                {/* VAULT BAR CHART */}
                <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {data.map((val, i) => (
                        <VaultBar 
                            key={i} 
                            index={i} 
                            value={val} 
                            totalBars={data.length} 
                            entranceProgress={entranceProgress}
                            fractureProgress={fractureProgress}
                        />
                    ))}

                    {/* Ground line */}
                    <line 
                        x1="100" y1="1400" x2="980" y2="1400" 
                        stroke={GOLD} 
                        strokeWidth="2" 
                        opacity={entranceProgress}
                    />
                </svg>
            </div>

            {/* SFX / AUDIO SYNC HINT (Visually) */}
            {frame === crashSyncFrame && (
                <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: 0.3, zIndex: 10 }} />
            )}
        </AbsoluteFill>
    );
};
