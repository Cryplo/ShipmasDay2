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
  const [moveCount, setMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize puzzle
  useEffect(() => {
    setPuzzle(generatePuzzle({ numSwitches: 5, numBulbs: 5 }));
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

  // Sound effect helper
  const playSound = useCallback((type: 'click' | 'victory' | 'bulb') => {
    if (typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'click') {
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } else if (type === 'bulb') {
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } else if (type === 'victory') {
      // Play a chord
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + 2);
      });
    }
  }, []);

  // Handle switch toggle
  const handleToggle = useCallback((switchIndex: number) => {
    if (!puzzle || isVictory) return;

    // Start timer on first move
    if (!startTime) {
      setStartTime(Date.now());
    }

    setShowInstructions(false);
    setActiveSwitch(switchIndex);
    playSound('click');

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

    // Play bulb sound if any bulb changed to on
    const anyNewlyLit = newPuzzle.bulbStates.some(
      (state, i) => state && !puzzle.bulbStates[i]
    );
    if (anyNewlyLit) {
      setTimeout(() => playSound('bulb'), 50);
    }

    // Check for victory
    if (isSolved(newPuzzle)) {
      setIsVictory(true);
      setTimeout(() => playSound('victory'), 200);
    }

    // Clear active switch after animation
    setTimeout(() => setActiveSwitch(null), 300);
  }, [puzzle, isVictory, startTime, revealedConnections, playSound]);

  // Reset game
  const handleReset = useCallback(() => {
    setPuzzle(generatePuzzle({ numSwitches: 5, numBulbs: 5 }));
    setRevealedConnections(new Set());
    setActiveSwitch(null);
    setMoveCount(0);
    setIsVictory(false);
    setStartTime(null);
    setElapsedTime(0);
    setShowInstructions(true);
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
    <div className="min-h-screen bg-soft-100 relative overflow-hidden">
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

      {/* Victory overlay */}
      <AnimatePresence>
        {isVictory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-holiday-green/20 via-transparent to-transparent"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Victory card */}
            <motion.div
              className="relative bg-white border-2 border-holiday-green rounded-xl p-8 shadow-xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(45deg, rgba(200,80,80,0.05), rgba(74,159,90,0.05))',
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <motion.h2
                className="text-3xl font-bold text-holiday-green mb-2 relative"
                animate={{ textShadow: ['0 0 10px rgba(74,159,90,0.3)', '0 0 20px rgba(74,159,90,0.5)', '0 0 10px rgba(74,159,90,0.3)'] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                GRID SYNCHRONIZED
              </motion.h2>

              <p className="text-soft-600 font-mono mb-4 relative">
                All lights are shining bright!
              </p>

              <div className="flex gap-8 justify-center mb-6 relative">
                <div className="text-center">
                  <div className="text-2xl font-bold text-holiday-red">{moveCount}</div>
                  <div className="text-xs text-soft-500 uppercase">Switches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-holiday-green">{formatTime(elapsedTime)}</div>
                  <div className="text-xs text-soft-500 uppercase">Time</div>
                </div>
              </div>

              <motion.button
                onClick={handleReset}
                className="px-6 py-3 bg-holiday-green hover:bg-green-600 text-white font-bold rounded-lg transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                NEW GRID
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-soft-300 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-holiday-red tracking-wide">GRID SYNC</h1>
            <p className="text-xs text-soft-500 font-mono">Holiday Light Puzzle</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Stats */}
            <div className="flex gap-4 text-sm font-mono">
              <div className="text-center">
                <div className="text-holiday-red">{moveCount}</div>
                <div className="text-xs text-soft-500">MOVES</div>
              </div>
              <div className="text-center">
                <div className="text-soft-700">{formatTime(elapsedTime)}</div>
                <div className="text-xs text-soft-500">TIME</div>
              </div>
              <div className="text-center">
                <div className="text-holiday-green">
                  {puzzle.bulbStates.filter(Boolean).length}/{puzzle.bulbStates.length}
                </div>
                <div className="text-xs text-soft-500">LIT</div>
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-mono text-soft-600 border border-soft-300 rounded-lg hover:border-holiday-red hover:text-holiday-red transition-colors bg-white"
            >
              RESET
            </button>
          </div>
        </div>
      </header>

      {/* Main game area */}
      <main className="relative z-10 max-w-4xl mx-auto p-8">
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
                disabled={isVictory}
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

        {/* Instructions - below the game */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              className="mt-8 p-4 bg-white/80 backdrop-blur-sm border border-soft-300 rounded-xl shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p className="text-sm text-soft-600 text-center font-mono">
                Toggle switches to light all bulbs. Each switch controls hidden connections.
                <br />
                <span className="text-holiday-red">Find the right combination to light them all!</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-soft-300 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center text-xs text-soft-500 font-mono">
          Shipmas 2025 &middot; Day 26 &middot; Holiday Grid Puzzle
        </div>
      </footer>
    </div>
  );
}
