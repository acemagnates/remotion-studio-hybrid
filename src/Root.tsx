import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { GoldGraph } from './GoldGraph';
import { RunningMan } from './video/test/RunningMan';
import AceMagnates from './AceMagnates';
import { ThreeScene } from './ThreeScene';
import ImanGadzhi from './ImanGadzhi';

// ── Component Library ──
import { KineticTypography } from './components/KineticTypography';
import { DataViz } from './components/DataViz';
import { ParticleOverlay } from './components/ParticleOverlay';
import { LowerThird } from './components/LowerThird';
import { BrandedEndframe } from './components/BrandedEndframe';
import { BeatSyncVFX } from './components/BeatSyncVFX';
import { TransitionClip } from './components/TransitionClip';
import { TenMillionDollarSlam } from './components/TenMillionDollarSlam';
import { FailedHustleLabels } from './components/FailedHustleLabels';
import { NameCardAgency } from './components/NameCardAgency';
import { CourseVsProductsChart } from './components/CourseVsProductsChart';
import { SplitScreenDividerPulse } from './components/SplitScreenDividerPulse';
import { MirrorLineFade } from './components/MirrorLineFade';
import { MotionClip03TeamSize } from './components/MotionClip03TeamSize';
import { MotionClip08GraphCrash } from './components/MotionClip08GraphCrash';
import { MotionClip01NumberSlam80k } from './components/MotionClip01NumberSlam80k';
import { MotionClip04Disruption } from './components/MotionClip04Disruption';

// ── Demo wrappers ──

const KineticDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
    <KineticTypography text="$8,000,000" mode="counter" counterRange={[0, 8000000]} counterPrefix="$" fontSize={100} />
  </AbsoluteFill>
);

const DataVizDemo: React.FC = () => (
  <DataViz
    type="barChart"
    title="REVENUE BY QUARTER"
    data={[
      { label: 'Q1', value: 120000, color: '#C9A84C' },
      { label: 'Q2', value: 340000, color: '#FFD700' },
      { label: 'Q3', value: 520000, color: '#C9A84C' },
      { label: 'Q4', value: 890000, color: '#FFD700' },
    ]}
    animationDuration={70}
  />
);

const ParticleDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
    <ParticleOverlay type="embers" count={30} direction="up" speed={0.8} color="#C9A84C" opacity={0.7} />
  </AbsoluteFill>
);

const LowerThirdDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
    <LowerThird type="nameCard" primaryText="IMAN GADZHI" secondaryText="Founder, IAG Media" holdFrames={70} />
  </AbsoluteFill>
);

const EndframeDemo: React.FC = () => <BrandedEndframe variant="full" handle="@AceMagnates" cta="FOLLOW FOR MORE" />;

const BeatSyncDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
    <BeatSyncVFX peakFrames={[10, 25, 40, 55, 70]} effectType="flash" intensity={0.9} />
  </AbsoluteFill>
);

const TransitionDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
    <TransitionClip type="chromaticSplit" intensity={1} direction="horizontal" />
  </AbsoluteFill>
);

// ── Root ──

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Existing compositions */}
      <Composition id="GoldGraph" component={GoldGraph} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="RunningMan" component={RunningMan} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="AceMagnates" component={AceMagnates} durationInFrames={300} fps={30} width={1080} height={1920} />
      <Composition id="ThreeScene" component={ThreeScene} durationInFrames={300} fps={30} width={1080} height={1920} />
      <Composition id="ImanGadzhi" component={ImanGadzhi} durationInFrames={1500} fps={30} width={1080} height={1920} />

      {/* Component Library Demos */}
      <Composition id="Demo-KineticTypography" component={KineticDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="Demo-DataViz" component={DataVizDemo} durationInFrames={120} fps={30} width={1080} height={1920} />
      <Composition id="Demo-Particles" component={ParticleDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="Demo-LowerThird" component={LowerThirdDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="Demo-Endframe" component={EndframeDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="Demo-BeatSync" component={BeatSyncDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="Demo-Transition" component={TransitionDemo} durationInFrames={20} fps={30} width={1080} height={1920} />
      <Composition id="TenMillionDollarSlam" component={TenMillionDollarSlam} durationInFrames={240} fps={60} width={1080} height={1920} />
      <Composition id="FailedHustleLabels" component={FailedHustleLabels} durationInFrames={360} fps={60} width={1080} height={1920} />
      <Composition id="NameCardAgency" component={NameCardAgency} durationInFrames={420} fps={60} width={1080} height={1920} />
      <Composition id="CourseVsProductsChart" component={CourseVsProductsChart} durationInFrames={180} fps={60} width={1080} height={1920} />
      <Composition id="SplitScreenDividerPulse" component={SplitScreenDividerPulse} durationInFrames={240} fps={60} width={1080} height={1920} />
      <Composition id="MirrorLineFade" component={MirrorLineFade} durationInFrames={240} fps={60} width={1080} height={1920} />
      <Composition id="MotionClip03TeamSize" component={MotionClip03TeamSize} durationInFrames={120} fps={60} width={1080} height={1920} />
      <Composition id="MotionClip08GraphCrash" component={MotionClip08GraphCrash} durationInFrames={150} fps={60} width={1080} height={1920} />
      <Composition id="MotionClip01NumberSlam80k" component={MotionClip01NumberSlam80k} durationInFrames={120} fps={60} width={1080} height={1920} />
      <Composition id="MotionClip04Disruption" component={MotionClip04Disruption} durationInFrames={150} fps={60} width={1080} height={1920} />
    </>
  );
};
