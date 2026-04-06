import { Composition } from 'remotion';
import { GoldGraph } from './GoldGraph';
import { RunningMan } from './video/test/RunningMan';

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
      <Composition
        id="RunningMan"
        component={RunningMan}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
