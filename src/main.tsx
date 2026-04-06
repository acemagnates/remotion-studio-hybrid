import React from 'react';
import ReactDOM from 'react-dom/client';
import { Player } from '@remotion/player';
import { GoldGraph } from './GoldGraph';

const App: React.FC = () => {
  return (
    <>
      <h1 style={{ fontSize: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Gold Graph — Live Preview
      </h1>
      <Player
        component={GoldGraph}
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
