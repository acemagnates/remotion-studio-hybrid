import React, { useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const boxRef = useRef<Mesh>(null);

  // useFrame from @react-three/fiber to update the mesh every frame.
  // Using Remotion's useCurrentFrame ensures determinism and perfect sync.
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x = frame * 0.05;
      boxRef.current.rotation.y = frame * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <mesh ref={boxRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
};

export const ThreeScene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas width={width} height={height}>
      <Scene />
    </ThreeCanvas>
  );
};
