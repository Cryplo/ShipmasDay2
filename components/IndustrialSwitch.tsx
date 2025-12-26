'use client';

import { motion } from 'framer-motion';

interface IndustrialSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  index: number;
  isHighlighted?: boolean;
  disabled?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export default function IndustrialSwitch({
  isOn,
  onToggle,
  index,
  isHighlighted = false,
  disabled = false,
  onHoverStart,
  onHoverEnd,
}: IndustrialSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Switch Label */}
      <div className="w-6 text-right">
        <span className="font-mono text-xs text-soft-600 opacity-70">
          SW{(index + 1).toString().padStart(2, '0')}
        </span>
      </div>

      {/* Switch Housing - smaller */}
      <button
        onClick={onToggle}
        disabled={disabled}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className={`
          relative w-10 h-16 rounded-md
          bg-gradient-to-b from-soft-50 to-soft-200
          border border-soft-300
          shadow-soft
          transition-all duration-100
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-soft-400 hover:shadow-md'}
          ${isHighlighted ? 'ring-2 ring-holiday-red ring-opacity-50' : ''}
          focus:outline-none focus:ring-2 focus:ring-holiday-red
        `}
        aria-label={`Switch ${index + 1}, currently ${isOn ? 'on' : 'off'}`}
      >
        {/* Metal plate texture */}
        <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-white to-soft-100 opacity-50" />

        {/* Screws - smaller */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-soft-400 shadow-inner" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-soft-400 shadow-inner" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-soft-400 shadow-inner" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-soft-400 shadow-inner" />

        {/* Switch track */}
        <div className="absolute inset-x-2.5 top-4 bottom-4 rounded-sm bg-soft-300 shadow-inner" />

        {/* Switch lever - smaller */}
        <motion.div
          className={`
            absolute left-1/2 -translate-x-1/2 w-5 h-5
            rounded-sm shadow-md
            ${isOn
              ? 'bg-gradient-to-b from-holiday-red to-red-600'
              : 'bg-gradient-to-b from-soft-300 to-soft-400'
            }
          `}
          animate={{
            top: isOn ? '6px' : '36px',
            boxShadow: isOn
              ? '0 2px 8px rgba(200, 80, 80, 0.4)'
              : '0 1px 4px rgba(0, 0, 0, 0.1)',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Lever grip lines */}
          <div className="absolute inset-x-1 top-1 h-0.5 bg-black opacity-10 rounded" />
          <div className="absolute inset-x-1 top-2.5 h-0.5 bg-black opacity-10 rounded" />
        </motion.div>

        {/* Status indicator light */}
        <motion.div
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          animate={{
            backgroundColor: isOn ? '#4a9f5a' : '#d4d0c8',
            boxShadow: isOn
              ? '0 0 6px 2px rgba(74, 159, 90, 0.4)'
              : '0 0 0 0 transparent',
          }}
          transition={{ duration: 0.15 }}
        />
      </button>

      {/* Status text */}
      <div className="w-6">
        <span className={`
          font-mono text-xs font-bold
          ${isOn ? 'text-holiday-green' : 'text-soft-500'}
        `}>
          {isOn ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
}
