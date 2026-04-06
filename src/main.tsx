import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Player } from '@remotion/player';
import { GoldGraph } from './GoldGraph';
import { RunningMan } from './video/test/RunningMan';

const scenes = {
  GoldGraph: { component: GoldGraph, name: 'Gold Graph' },
  RunningMan: { component: RunningMan, name: 'Running Guy' }
};

type SceneKey = keyof typeof scenes;

const App: React.FC = () => {
  const [activeScene, setActiveScene] = useState<SceneKey>('RunningMan');

  const SceneToPlay = scenes[activeScene].component;

  return (
    <>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {(Object.keys(scenes) as SceneKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveScene(key)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeScene === key ? '#cf9f33' : '#1a2030',
              color: activeScene === key ? '#0B0F19' : '#f3dca0',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }}
          >
            {scenes[key].name}
          </button>
        ))}
      </div>
      
      <Player
        component={SceneToPlay}
        compositionWidth={1080}
        compositionHeight={1920}
        durationInFrames={150}
        fps={30}
        controls
        loop
        style={{
          width: 360,
          height: 640,
          borderRadius: 12,
          border: '2px solid rgba(243, 220, 160, 0.3)',
          boxShadow: '0 0 40px rgba(207, 159, 51, 0.15)',
        }}
      />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
