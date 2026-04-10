import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── TYPES ──────────────────────────────────────────────

interface DataEntry {
  label: string;
  value: number;
  color?: string;
}

type VizType = 'barChart' | 'lineGraph' | 'pieChart' | 'comparisonColumns';

interface DataVizProps {
  type: VizType;
  data: DataEntry[];
  animationDuration?: number;
  title?: string;
  brandColors?: { primary: string; gold: string; bg: string; muted: string; white: string };
}

// ── CONSTANTS ──────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const DEFAULT_COLORS = {
  primary: '#C9A84C',
  gold: '#FFD700',
  bg: '#0A0A0A',
  muted: '#888888',
  white: '#FFFFFF',
};

// ── BAR CHART ──────────────────────────────────────────

const BarChart: React.FC<{ data: DataEntry[]; dur: number; colors: typeof DEFAULT_COLORS }> = ({
  data, dur, colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', padding: '10% 8%' }}>
      <div style={{ display: 'flex', gap: 30, alignItems: 'flex-end', width: '100%', height: '60%' }}>
        {data.map((entry, i) => {
          const delay = i * Math.floor(dur / data.length);
          const heightPct = (entry.value / maxValue) * 100;

          const barHeight = interpolate(frame, [delay, delay + dur * 0.6], [0, heightPct], {
            ...CLAMP,
            easing: Easing.out(Easing.ease),
          });

          const labelOp = interpolate(frame, [delay + 10, delay + 20], [0, 1], CLAMP);

          const valueScale = spring({
            frame: frame - (delay + Math.floor(dur * 0.4)),
            fps,
            from: 0,
            to: 1,
            config: { damping: 14 },
          });

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  fontSize: 28,
                  fontFamily: 'monospace',
                  color: entry.color || colors.gold,
                  fontWeight: 'bold',
                  transform: `scale(${valueScale})`,
                }}
              >
                {Math.floor(interpolate(frame, [delay, delay + dur * 0.6], [0, entry.value], { ...CLAMP, easing: Easing.out(Easing.ease) })).toLocaleString()}
              </div>
              <div
                style={{
                  width: '100%',
                  height: `${barHeight}%`,
                  background: `linear-gradient(180deg, ${entry.color || colors.gold} 0%, ${entry.color || colors.primary} 100%)`,
                  borderRadius: 4,
                  minHeight: 2,
                  boxShadow: `0 0 15px ${(entry.color || colors.primary)}44`,
                }}
              />
              <div style={{ fontSize: 18, color: colors.muted, fontFamily: 'sans-serif', opacity: labelOp, letterSpacing: 3 }}>
                {entry.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── LINE GRAPH ─────────────────────────────────────────

const LineGraph: React.FC<{ data: DataEntry[]; dur: number; colors: typeof DEFAULT_COLORS }> = ({
  data, dur, colors,
}) => {
  const frame = useCurrentFrame();
  const maxValue = Math.max(...data.map((d) => d.value));
  const svgW = 900;
  const svgH = 500;
  const padding = 60;

  const pointCount = interpolate(frame, [0, dur], [0, data.length], CLAMP);

  const points: string[] = [];
  for (let i = 0; i < Math.min(Math.ceil(pointCount), data.length); i++) {
    const x = padding + (i / (data.length - 1)) * (svgW - 2 * padding);
    const y = svgH - padding - (data[i].value / maxValue) * (svgH - 2 * padding);
    points.push(`${x},${y}`);
  }

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={padding}
            y1={svgH - padding - pct * (svgH - 2 * padding)}
            x2={svgW - padding}
            y2={svgH - padding - pct * (svgH - 2 * padding)}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        ))}
        {/* Line */}
        {points.length > 1 && (
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke={colors.gold}
            strokeWidth={4}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {/* Glow line */}
        {points.length > 1 && (
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke={colors.gold}
            strokeWidth={12}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.15}
          />
        )}
        {/* Dots */}
        {points.map((p, i) => {
          const [cx, cy] = p.split(',').map(Number);
          return (
            <circle key={i} cx={cx} cy={cy} r={6} fill={colors.gold} opacity={0.9} />
          );
        })}
        {/* Labels */}
        {data.map((entry, i) => {
          const x = padding + (i / (data.length - 1)) * (svgW - 2 * padding);
          const op = interpolate(frame, [dur * 0.8, dur], [0, 1], CLAMP);
          return (
            <text
              key={i}
              x={x}
              y={svgH - 20}
              fill={colors.muted}
              fontSize={14}
              textAnchor="middle"
              fontFamily="sans-serif"
              opacity={op}
            >
              {entry.label}
            </text>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ── COMPARISON COLUMNS ─────────────────────────────────

const ComparisonColumns: React.FC<{ data: DataEntry[]; dur: number; colors: typeof DEFAULT_COLORS }> = ({
  data, dur, colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', width: '80%', justifyContent: 'space-around' }}>
        {data.map((entry, i) => {
          const counterVal = interpolate(
            frame,
            [i * 15, i * 15 + dur * 0.7],
            [0, entry.value],
            { ...CLAMP, easing: Easing.out(Easing.ease) }
          );

          const lineScale = interpolate(frame, [dur * 0.7, dur * 0.85], [0, 1], CLAMP);

          const labelScale = spring({
            frame: frame - (i * 10),
            fps,
            config: { damping: 14 },
          });

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
              <div style={{ fontSize: 22, color: entry.color || colors.muted, fontFamily: 'sans-serif', fontWeight: 'bold', transform: `scale(${labelScale})`, letterSpacing: 4 }}>
                {entry.label}
              </div>
              <div style={{ fontSize: 64, fontFamily: 'monospace', color: entry.color || colors.white, fontWeight: 'bold', letterSpacing: -1, textShadow: entry.color === colors.gold ? `0 0 20px ${colors.gold}44` : 'none' }}>
                ${Math.floor(counterVal).toLocaleString()}
              </div>
              <div style={{ width: '100%', height: 4, backgroundColor: entry.color || colors.primary, transform: `scaleX(${lineScale})`, transformOrigin: 'center' }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── PIE CHART (minimal, elegant) ───────────────────────

const PieChart: React.FC<{ data: DataEntry[]; dur: number; colors: typeof DEFAULT_COLORS }> = ({
  data, dur, colors,
}) => {
  const frame = useCurrentFrame();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 200;
  const cx = 300;
  const cy = 300;

  const drawProgress = interpolate(frame, [0, dur], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.ease) });

  let cumAngle = -90;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width={600} height={600} viewBox="0 0 600 600">
        {data.map((entry, i) => {
          const sliceAngle = (entry.value / total) * 360 * drawProgress;
          const startAngle = cumAngle;
          cumAngle += sliceAngle;
          const endAngle = cumAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = cx + radius * Math.cos(startRad);
          const y1 = cy + radius * Math.sin(startRad);
          const x2 = cx + radius * Math.cos(endRad);
          const y2 = cy + radius * Math.sin(endRad);

          const largeArc = sliceAngle > 180 ? 1 : 0;

          if (sliceAngle < 0.5) return null;

          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={entry.color || (i === 0 ? colors.gold : i === 1 ? colors.primary : colors.muted)}
              stroke={colors.bg}
              strokeWidth={3}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: '15%', display: 'flex', gap: 40 }}>
        {data.map((entry, i) => {
          const op = interpolate(frame, [dur * 0.7 + i * 8, dur * 0.7 + i * 8 + 12], [0, 1], CLAMP);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: op }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: entry.color || (i === 0 ? colors.gold : i === 1 ? colors.primary : colors.muted) }} />
              <span style={{ color: colors.white, fontSize: 16, fontFamily: 'sans-serif' }}>{entry.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── MAIN EXPORT ────────────────────────────────────────

export const DataViz: React.FC<DataVizProps> = ({
  type,
  data,
  animationDuration = 60,
  title,
  brandColors,
}) => {
  const frame = useCurrentFrame();
  const colors = { ...DEFAULT_COLORS, ...brandColors };

  const titleOp = title ? interpolate(frame, [0, 10], [0, 1], CLAMP) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {title && (
        <div style={{ position: 'absolute', top: '8%', width: '100%', textAlign: 'center', fontSize: 32, color: colors.white, fontFamily: 'sans-serif', fontWeight: 'bold', opacity: titleOp, letterSpacing: 4 }}>
          {title}
        </div>
      )}

      {type === 'barChart' && <BarChart data={data} dur={animationDuration} colors={colors} />}
      {type === 'lineGraph' && <LineGraph data={data} dur={animationDuration} colors={colors} />}
      {type === 'comparisonColumns' && <ComparisonColumns data={data} dur={animationDuration} colors={colors} />}
      {type === 'pieChart' && <PieChart data={data} dur={animationDuration} colors={colors} />}
    </AbsoluteFill>
  );
};
