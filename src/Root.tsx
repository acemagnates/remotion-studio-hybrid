import { Composition } from 'remotion';
import { GoldGraph } from './GoldGraph';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GoldGraph"
        component={GoldGraph}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
