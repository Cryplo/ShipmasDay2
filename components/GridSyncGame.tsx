'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IndustrialSwitch from './IndustrialSwitch';
import HolidayBulb from './HolidayBulb';
import WiringDiagram from './WiringDiagram';
import { generatePuzzle, toggleSwitch, isSolved, Puzzle } from '@/lib/puzzle';

export default function GridSyncGame() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [revealedConnections, setRevealedConnections] = useState<Set<string>>(new Set());
  const [activeSwitch, setActiveSwitch] = useState<number | null>(null);
  const [hoveredSwitch, setHoveredSwitch] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize puzzle
  useEffect(() => {
    setPuzzle(generatePuzzle({ numSwitches: 7, numBulbs: 7 }));
  }, []);

  // Timer
  useEffect(() => {
    if (startTime && !isVictory) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, isVictory]);

  // Sound effect helper - single click sound for switch toggle
  const playSound = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Simple click sound
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }, []);

  // Start game from tutorial
  const handleStartGame = useCallback(() => {
    setShowTutorial(false);
    setStartTime(Date.now());
  }, []);

  // Handle switch toggle
  const handleToggle = useCallback((switchIndex: number) => {
    if (!puzzle || isVictory || showTutorial) return;

    setActiveSwitch(switchIndex);
    playSound();

    // Reveal connections for this switch
    const newRevealed = new Set(revealedConnections);
    puzzle.wiring[switchIndex].forEach((bulbIndex) => {
      newRevealed.add(`${switchIndex}-${bulbIndex}`);
    });
    setRevealedConnections(newRevealed);

    // Toggle the switch
    const newPuzzle = toggleSwitch(puzzle, switchIndex);
    setPuzzle(newPuzzle);
    setMoveCount((prev) => prev + 1);

    // Check for victory
    if (isSolved(newPuzzle)) {
      setIsVictory(true);
    }

    // Clear active switch after animation
    setTimeout(() => setActiveSwitch(null), 300);
  }, [puzzle, isVictory, showTutorial, revealedConnections, playSound]);

  // Reset game
  const handleReset = useCallback(() => {
    setPuzzle(generatePuzzle({ numSwitches: 7, numBulbs: 7 }));
    setRevealedConnections(new Set());
    setActiveSwitch(null);
    setMoveCount(0);
    setIsVictory(false);
    setShowTutorial(true);
    setStartTime(null);
    setElapsedTime(0);
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-soft-100 flex items-center justify-center">
        <div className="text-soft-600 font-mono">Initializing grid...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-100 relative overflow-hidden flex flex-col">
      {/* Soft background pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(200, 80, 80, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(74, 159, 90, 0.05) 0%, transparent 50%),
            linear-gradient(rgba(200, 200, 200, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 200, 200, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-soft-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Same background pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(200, 80, 80, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(74, 159, 90, 0.05) 0%, transparent 50%),
                  linear-gradient(rgba(200, 200, 200, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(200, 200, 200, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
              }}
            />

            <motion.div
              className="relative z-10 max-w-md mx-auto p-8 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-holiday-red tracking-wide mb-2">
                Light Sync
              </h1>
              <p className="text-soft-500 font-mono text-sm mb-8">Holiday Light Puzzle</p>

              <div className="space-y-4 text-left mb-8 text-soft-700">
                <p className="flex items-start gap-3">
                  <span className="text-holiday-red font-bold">1.</span>
                  <span>Each switch controls multiple light bulbs through hidden connections.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-holiday-green font-bold">2.</span>
                  <span>Toggle switches to light up all the bulbs.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-holiday-red font-bold">3.</span>
                  <span>Hover over a switch to see which bulbs it connects to.</span>
                </p>
              </div>

              <motion.button
                onClick={handleStartGame}
                className="px-8 py-4 bg-holiday-green hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START GAME
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory overlay */}
      <AnimatePresence>
        {isVictory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-soft-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Same background pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(200, 80, 80, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(74, 159, 90, 0.05) 0%, transparent 50%),
                  linear-gradient(rgba(200, 200, 200, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(200, 200, 200, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
              }}
            />

            <motion.div
              className="relative z-10 max-w-md mx-auto p-8 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold text-holiday-green mb-2"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(74,159,90,0.3)', 
                    '0 0 20px rgba(74,159,90,0.5)', 
                    '0 0 10px rgba(74,159,90,0.3)'
                  ] 
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Light SyncHRONIZED
              </motion.h2>

              <p className="text-soft-600 font-mono mb-8">
                All lights are shining bright!
              </p>

              <div className="flex gap-8 justify-center mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-holiday-red">{moveCount}</div>
                  <div className="text-xs text-soft-500 uppercase">Moves</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-holiday-green">{formatTime(elapsedTime)}</div>
                  <div className="text-xs text-soft-500 uppercase">Time</div>
                </div>
              </div>

              <motion.button
                onClick={handleReset}
                className="px-8 py-4 bg-holiday-green hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                PLAY AGAIN
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main game area */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto p-8 w-full flex flex-col">
        {/* Game grid */}
        <div className="relative flex justify-between items-start">
          {/* Switches column */}
          <div className="flex flex-col gap-3 z-10">
            <div className="text-xs font-mono text-soft-500 uppercase tracking-wider mb-2 pl-9">
              Control Panel
            </div>
            {puzzle.switchStates.map((isOn, index) => (
              <IndustrialSwitch
                key={index}
                isOn={isOn}
                onToggle={() => handleToggle(index)}
                index={index}
                isHighlighted={activeSwitch === index}
                disabled={isVictory || showTutorial}
                onHoverStart={() => setHoveredSwitch(index)}
                onHoverEnd={() => setHoveredSwitch(null)}
              />
            ))}
          </div>

          {/* Wiring diagram */}
          <div className="absolute inset-0">
            <WiringDiagram
              wiring={puzzle.wiring}
              switchStates={puzzle.switchStates}
              bulbStates={puzzle.bulbStates}
              revealedConnections={revealedConnections}
              activeSwitch={activeSwitch}
              hoveredSwitch={hoveredSwitch}
            />
          </div>

          {/* Bulbs column */}
          <div className="flex flex-col gap-3 z-10">
            <div className="text-xs font-mono text-soft-500 uppercase tracking-wider mb-2 pl-9">
              Light Array
            </div>
            {puzzle.bulbStates.map((isOn, index) => (
              <HolidayBulb
                key={index}
                isOn={isOn}
                index={index}
                isHighlighted={activeSwitch !== null && puzzle.wiring[activeSwitch]?.includes(index)}
                isVictory={isVictory}
              />
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm font-mono">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-holiday-red font-bold">{moveCount}</div>
              <div className="text-xs text-soft-500">MOVES</div>
            </div>
            <div className="text-center">
              <div className="text-soft-700 font-bold">{formatTime(elapsedTime)}</div>
              <div className="text-xs text-soft-500">TIME</div>
            </div>
            <div className="text-center">
              <div className="text-holiday-green font-bold">
                {puzzle.bulbStates.filter(Boolean).length}/{puzzle.bulbStates.length}
              </div>
              <div className="text-xs text-soft-500">LIT</div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-mono text-soft-600 border border-soft-300 rounded-lg hover:border-holiday-red hover:text-holiday-red transition-colors bg-white"
          >
            RESET
          </button>
        </div>
      </main>
    </div>
  );
}
