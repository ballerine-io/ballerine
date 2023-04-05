import React from 'react';

export const DelayViz: React.FC<{ active: boolean; duration: number }> = ({ active, duration }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      data-viz="delay"
      data-viz-active={active || undefined}
      style={{
        transform: 'rotate(-90deg)',
        display: 'inline-block',
        width: '1rem',
        height: '1rem',
        overflow: 'visible',
        // @ts-ignore
        '--duration': duration,
      }}
    >
      <circle
        data-viz="delay-circle"
        cx={50}
        cy={50}
        r={45}
        strokeDasharray={1}
        pathLength={1}
        stroke="#fff"
        fill="transparent"
      />
      <circle
        data-viz="delay-fill"
        cx={50}
        cy={50}
        r={45}
        strokeDasharray={1}
        pathLength={1}
        stroke="#fff"
        fill="transparent"
      />
    </svg>
  );
};
