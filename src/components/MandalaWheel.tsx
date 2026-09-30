import React, { useMemo } from 'react';
import type { FactorItem, InfluenceLevel } from '../types';
import { FACTORS } from '../data/emotionsDesires';
import { triggerHaptic } from '../utils/telegram';

interface MandalaWheelProps {
  assessments: Record<string, InfluenceLevel>;
  activeFactorId?: string | null;
  onSelectFactor?: (factor: FactorItem) => void;
  size?: number;
  interactive?: boolean;
}

export const MandalaWheel: React.FC<MandalaWheelProps> = ({
  assessments,
  activeFactorId,
  onSelectFactor,
  size = 360,
  interactive = true,
}) => {
  const center = size / 2;
  const innerRadius = size * 0.22; // Center hole for clarity display
  const baseOuterRadius = size * 0.33;
  const maxOuterRadius = size * 0.46;

  // 13 sectors
  const totalSectors = FACTORS.length;
  const sectorAngle = 360 / totalSectors;
  const gapAngle = 1.2; // Degrees gap between sectors

  // Calculate clarity score (100 - total penalty)
  const clarityScore = useMemo(() => {
    let penalty = 0;
    FACTORS.forEach((f) => {
      const level = assessments[f.id] ?? 0;
      penalty += level;
    });
    const maxPenalty = 13 * 3;
    const score = Math.max(0, Math.round(100 - (penalty / maxPenalty) * 100));
    return score;
  }, [assessments]);

  // Color & state for center
  const centerStatus = useMemo(() => {
    if (clarityScore >= 80) {
      return { text: '心如明镜', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', desc: '清澈澄明' };
    } else if (clarityScore >= 50) {
      return { text: '微澜暗涌', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', desc: '需持定力' };
    } else {
      return { text: '迷障深重', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', desc: '切忌冲动' };
    }
  }, [clarityScore]);

  // Polar to Cartesian conversion
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Generate SVG path for a sector ring slice
  const createSectorPath = (startAngle: number, endAngle: number, rInner: number, rOuter: number) => {
    const startOuter = polarToCartesian(center, center, rOuter, startAngle);
    const endOuter = polarToCartesian(center, center, rOuter, endAngle);
    const startInner = polarToCartesian(center, center, rInner, endAngle);
    const endInner = polarToCartesian(center, center, rInner, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ');
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible drop-shadow-2xl transition-all duration-300"
      >
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#0f172a" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Outer boundary guidelines */}
        <circle
          cx={center}
          cy={center}
          r={maxOuterRadius + 4}
          fill="none"
          stroke="rgba(148, 163, 184, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Sectors rendering */}
        {FACTORS.map((factor, index) => {
          const startAngle = index * sectorAngle + gapAngle / 2;
          const endAngle = (index + 1) * sectorAngle - gapAngle / 2;
          const midAngle = (startAngle + endAngle) / 2;

          const level = assessments[factor.id] ?? 0;
          const isActive = activeFactorId === factor.id;

          const radiusDelta =
            level === 0 ? 0 : level === 1 ? size * 0.035 : level === 2 ? size * 0.08 : size * 0.13;
          const rOuter = baseOuterRadius + radiusDelta;

          let fillColor = 'rgba(51, 65, 85, 0.35)';
          let strokeColor = 'rgba(148, 163, 184, 0.25)';
          let strokeWidth = 1.2;

          if (level === 1) {
            fillColor = `${factor.color}44`;
            strokeColor = factor.color;
            strokeWidth = 1.5;
          } else if (level === 2) {
            fillColor = `${factor.color}88`;
            strokeColor = factor.color;
            strokeWidth = 2;
          } else if (level === 3) {
            fillColor = `${factor.color}DD`;
            strokeColor = '#ffffff';
            strokeWidth = 2.5;
          }

          if (isActive) {
            strokeColor = '#ffffff';
            strokeWidth = 3;
          }

          const pathD = createSectorPath(startAngle, endAngle, innerRadius + 2, rOuter);
          const labelRadius = innerRadius + (rOuter - innerRadius) * 0.52;
          const labelPos = polarToCartesian(center, center, labelRadius, midAngle);

          return (
            <g
              key={factor.id}
              className={`transition-all duration-300 ${
                interactive ? 'cursor-pointer hover:opacity-90' : ''
              }`}
              onClick={() => {
                if (interactive && onSelectFactor) {
                  triggerHaptic('selection');
                  onSelectFactor(factor);
                }
              }}
            >
              <path
                d={pathD}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                filter={level >= 2 || isActive ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />

              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size > 300 ? (level >= 2 ? 14 : 13) : 11}
                fontWeight={level > 0 || isActive ? 'bold' : 'normal'}
                fill={level >= 2 ? '#ffffff' : level === 1 ? '#f8fafc' : 'rgba(203, 213, 225, 0.75)'}
                className="font-serif pointer-events-none select-none drop-shadow-sm transition-all duration-200"
              >
                {factor.name}
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="url(#centerGradient)"
          stroke={centerStatus.color}
          strokeWidth="2"
          className="transition-all duration-500 shadow-inner"
        />

        {/* Inner pulsing indicator ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 6}
          fill="none"
          stroke={centerStatus.color}
          strokeWidth="1"
          strokeDasharray="4 3"
          className="animate-spin-slow opacity-60"
        />

        {/* Center Text: Score & Verdict */}
        <g className="pointer-events-none select-none">
          <text
            x={center}
            y={center - innerRadius * 0.35}
            textAnchor="middle"
            fontSize={size > 300 ? 11 : 9}
            fill="rgba(148, 163, 184, 0.85)"
            letterSpacing="0.08em"
          >
            心境澄澈度
          </text>
          <text
            x={center}
            y={center + 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size > 300 ? 26 : 20}
            fontWeight="bold"
            fill={centerStatus.color}
            className="font-sans drop-shadow-md"
          >
            {clarityScore}%
          </text>
          <text
            x={center}
            y={center + innerRadius * 0.42}
            textAnchor="middle"
            fontSize={size > 300 ? 11 : 9}
            fontWeight="600"
            fill="#ffffff"
            className="font-serif tracking-widest"
          >
            {centerStatus.text}
          </text>
        </g>
      </svg>

      {/* Legend / Category Arcs Label */}
      <div className="flex items-center justify-between w-full max-w-[320px] px-2 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
          <span>七情（喜·怒·哀·惧·爱·恶·欲）</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>
          <span>六欲（眼·耳·鼻·舌·身·意）</span>
        </div>
      </div>
    </div>
  );
};
