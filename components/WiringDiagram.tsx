'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WiringDiagramProps {
  wiring: number[][];
  switchStates: boolean[];
  bulbStates: boolean[];
  revealedConnections: Set<string>;
  activeSwitch: number | null;
  hoveredSwitch: number | null;
}

export default function WiringDiagram({
  wiring,
  switchStates: _switchStates,
  bulbStates,
  revealedConnections,
  activeSwitch,
  hoveredSwitch,
}: WiringDiagramProps) {
  const numSwitches = wiring.length;
  const numBulbs = bulbStates.length;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Layout calculations (in pixels, matching the actual CSS)
  // Header: text-xs (~16px with line height) + mb-2 (8px) = ~24px
  // Each row: component height (h-16 = 64px) + gap (gap-3 = 12px) = 76px per row
  const rowHeight = 76; // Component (64px) + gap (12px)
  const headerHeight = 24; // "Control Panel" label + mb-2
  const componentHeight = 64; // h-16

  // ViewBox uses percentage for X (0-100) to scale horizontally
  // Y values are in the same units as rowHeight for accurate positioning
  const viewBoxWidth = 100;
  const viewBoxHeight = headerHeight + Math.max(numSwitches, numBulbs) * rowHeight;

  // X positions (as percentage of width)
  const startX = 10;
  const endX = 90;

  // Calculate actual pixel height for the SVG
  const actualHeight = headerHeight + Math.max(numSwitches, numBulbs) * rowHeight;

  return (
    <svg
      className="absolute top-0 left-0 right-0 pointer-events-none overflow-visible"
      style={{ width: '100%', height: actualHeight }}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
    >
      {wiring.map((connections, switchIndex) =>
        connections.map((bulbIndex) => {
          const connectionKey = `${switchIndex}-${bulbIndex}`;
          const isActive = activeSwitch === switchIndex;
          const isHovered = hoveredSwitch === switchIndex;

          // Y positions: header + row index * row height + half component height
          // Component is h-16 (64px), so center is at componentHeight/2 from top of component
          const startY = headerHeight + switchIndex * rowHeight + componentHeight / 2;
          const endY = headerHeight + bulbIndex * rowHeight + componentHeight / 2;

          // Create curved path with control points at the midpoint
          const midX = (startX + endX) / 2;
          const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

          // Alternate wire color based on bulb index (red or green)
          const isRedBulb = bulbIndex % 2 === 0;
          const wireColor = isRedBulb ? '#c85050' : '#4a9f5a';
          const wireGlow = isRedBulb ? 'rgba(200, 80, 80, 0.3)' : 'rgba(74, 159, 90, 0.3)';

          return (
            <g key={connectionKey}>
              {/* Wire shadow/glow */}
              {isActive && (
                <motion.path
                  d={path}
                  fill="none"
                  stroke={wireGlow}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Main wire */}
              <motion.path
                d={path}
                fill="none"
                stroke={isActive || isHovered ? wireColor : '#d4d0c8'}
                strokeWidth={isActive || isHovered ? 2 : 1.5}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="none"
                initial={{ opacity: 0.4 }}
                animate={{
                  opacity: isActive || isHovered ? 1 : 0.4,
                  strokeDashoffset: isActive ? [0, -8] : 0,
                }}
                transition={{
                  opacity: { duration: 0.2 },
                  strokeDashoffset: {
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    ease: 'linear',
                  },
                }}
              />

              {/* Electricity sparks when active */}
              {isActive && (
                <motion.circle
                  r="3"
                  fill={wireColor}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    offsetDistance: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatDelay: 0.1,
                  }}
                  style={{
                    offsetPath: `path("${path}")`,
                  }}
                />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}
