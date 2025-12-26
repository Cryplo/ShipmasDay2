'use client';

import { motion } from 'framer-motion';

interface HolidayBulbProps {
  isOn: boolean;
  index: number;
  isHighlighted?: boolean;
  isVictory?: boolean;
}

export default function HolidayBulb({
  isOn,
  index,
  isHighlighted = false,
  isVictory = false,
}: HolidayBulbProps) {
  // Alternating red and green colors
  const isRed = index % 2 === 0;
  const bulbColor = {
    base: isRed ? '#c85050' : '#4a9f5a',
    glow: isRed ? 'rgba(200, 80, 80, 0.5)' : 'rgba(74, 159, 90, 0.5)',
    highlight: isRed ? '#e88080' : '#7ac08a',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Bulb Label */}
      <div className="w-6 text-right">
        <span className="font-mono text-xs text-soft-600 opacity-70">
          B{(index + 1).toString().padStart(2, '0')}
        </span>
      </div>

      {/* Bulb Assembly - smaller size */}
      <div
        className={`
          relative w-10 h-16 flex flex-col items-center justify-end
          ${isHighlighted ? 'scale-110' : ''}
          transition-transform duration-150
        `}
      >
        {/* Socket/Base */}
        <div className="absolute top-0 w-5 h-5 bg-gradient-to-b from-soft-400 to-soft-500 rounded-sm shadow-sm z-10">
          {/* Metal threading */}
          <div className="absolute bottom-0 left-0 right-0 h-2.5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-soft-500" />
            <div className="absolute top-1 left-0 right-0 h-0.5 bg-soft-400" />
          </div>
        </div>

        {/* Connector piece */}
        <div className="absolute top-4 w-4 h-2 bg-gradient-to-b from-soft-400 to-soft-500 rounded-b-sm z-10" />

        {/* Bulb glass - smaller */}
        <motion.div
          className="absolute bottom-0 w-9 h-10 rounded-full"
          style={{
            background: isOn
              ? `radial-gradient(ellipse at 30% 30%, white 0%, ${bulbColor.base} 50%, ${bulbColor.base}99 100%)`
              : 'radial-gradient(ellipse at 30% 30%, #f5f5f5 0%, #e0e0e0 50%, #d0d0d0 100%)',
          }}
          animate={{
            boxShadow: isOn
              ? `0 0 20px 10px ${bulbColor.glow}, 0 0 40px 20px ${bulbColor.glow}`
              : '0 0 2px 1px rgba(0, 0, 0, 0.05)',
            scale: isVictory ? [1, 1.05, 1] : 1,
          }}
          transition={{
            boxShadow: { duration: 0.2 },
            scale: { duration: 0.5, repeat: isVictory ? Infinity : 0, repeatDelay: 0.5 },
          }}
        >
          {/* Glass highlight */}
          <div
            className="absolute top-1.5 left-2 w-2.5 h-4 rounded-full opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 50%)',
            }}
          />

          {/* Filament (visible when on) */}
          <motion.div
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-2.5 h-4"
            animate={{ opacity: isOn ? 1 : 0.2 }}
            transition={{ duration: 0.15 }}
          >
            <svg viewBox="0 0 16 24" fill="none" className="w-full h-full">
              <path
                d="M4 24 L4 16 Q4 12 8 12 Q12 12 12 16 L12 24"
                stroke={isOn ? bulbColor.highlight : '#bbb'}
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M6 16 Q8 14 10 16"
                stroke={isOn ? bulbColor.highlight : '#bbb'}
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Status indicator */}
      <div className="w-10">
        <motion.div
          className={`
            font-mono text-xs font-bold px-1.5 py-0.5 rounded
            ${isOn
              ? isRed
                ? 'bg-red-100 text-red-600 border border-red-200'
                : 'bg-green-100 text-green-600 border border-green-200'
              : 'bg-soft-200 text-soft-500 border border-soft-300'
            }
          `}
          animate={{
            scale: isOn && isVictory ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: isVictory ? Infinity : 0,
            repeatDelay: 0.2,
          }}
        >
          {isOn ? 'LIT' : 'OFF'}
        </motion.div>
      </div>
    </div>
  );
}
