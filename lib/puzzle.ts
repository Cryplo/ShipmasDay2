// Puzzle generation and logic for Light Sync
// Uses a bipartite graph approach with guaranteed solvability

export interface PuzzleConfig {
  numSwitches: number;
  numBulbs: number;
}

export interface Puzzle {
  // wiring[switchIndex] = array of bulb indices that switch affects
  wiring: number[][];
  // The solution: which switches should be ON to light all bulbs
  solution: boolean[];
  // Current state of switches
  switchStates: boolean[];
  // Derived: current state of bulbs based on switch states
  bulbStates: boolean[];
}

/**
 * Generate a random puzzle with guaranteed solvability.
 *
 * Algorithm:
 * 1. Create a random wiring from switches to bulbs (each switch affects 1-3 bulbs)
 * 2. Define the solution as all switches ON
 * 3. When a switch is ON, it XORs its connected bulbs
 * 4. The puzzle is solvable: just toggle switches to match the solution
 * 5. Scramble the starting switch positions randomly
 */
export function generatePuzzle(config: PuzzleConfig = { numSwitches: 5, numBulbs: 5 }): Puzzle {
  const { numSwitches, numBulbs } = config;

  // Generate random wiring - each switch affects 2-4 bulbs (minimum 2)
  const wiring: number[][] = [];

  // Ensure each bulb is controlled by at least one switch
  const bulbCoverage = new Set<number>();

  for (let i = 0; i < numSwitches; i++) {
    const numConnections = Math.floor(Math.random() * 3) + 2; // 2-4 connections (minimum 2)
    const connections = new Set<number>();

    // If we haven't covered all bulbs yet, prioritize uncovered ones
    while (connections.size < numConnections) {
      let bulbIndex: number;

      if (bulbCoverage.size < numBulbs && connections.size < 2) {
        // Find an uncovered bulb first
        const uncovered = [];
        for (let b = 0; b < numBulbs; b++) {
          if (!bulbCoverage.has(b) && !connections.has(b)) uncovered.push(b);
        }
        if (uncovered.length > 0) {
          bulbIndex = uncovered[Math.floor(Math.random() * uncovered.length)];
        } else {
          bulbIndex = Math.floor(Math.random() * numBulbs);
        }
      } else {
        bulbIndex = Math.floor(Math.random() * numBulbs);
      }

      connections.add(bulbIndex);
      bulbCoverage.add(bulbIndex);
    }

    wiring.push(Array.from(connections));
  }

  // Ensure any remaining uncovered bulbs get wired to random switches
  for (let b = 0; b < numBulbs; b++) {
    if (!bulbCoverage.has(b)) {
      const randomSwitch = Math.floor(Math.random() * numSwitches);
      wiring[randomSwitch].push(b);
    }
  }

  // The solution: a random configuration of switches
  const solution: boolean[] = [];
  for (let i = 0; i < numSwitches; i++) {
    solution.push(Math.random() > 0.5);
  }

  // Scramble starting positions (opposite of solution)
  const switchStates: boolean[] = solution.map(s => !s);

  // Calculate initial bulb states
  const bulbStates = calculateBulbStates(switchStates, solution, wiring, numBulbs);

  return {
    wiring,
    solution,
    switchStates,
    bulbStates,
  };
}

/**
 * Calculate bulb states based on current switch configuration.
 * A bulb is ON if the number of its controlling switches that differ from solution is even.
 * This creates an XOR-like relationship.
 */
export function calculateBulbStates(
  switchStates: boolean[],
  solution: boolean[],
  wiring: number[][],
  numBulbs: number
): boolean[] {
  const bulbStates: boolean[] = new Array(numBulbs).fill(true); // Start assuming all lit

  // For each switch, if it's in the "wrong" position, toggle its connected bulbs
  for (let i = 0; i < switchStates.length; i++) {
    if (switchStates[i] !== solution[i]) {
      // This switch is in wrong position - toggle its bulbs
      for (const bulbIndex of wiring[i]) {
        bulbStates[bulbIndex] = !bulbStates[bulbIndex];
      }
    }
  }

  return bulbStates;
}

/**
 * Toggle a switch and return new puzzle state
 */
export function toggleSwitch(puzzle: Puzzle, switchIndex: number): Puzzle {
  const newSwitchStates = [...puzzle.switchStates];
  newSwitchStates[switchIndex] = !newSwitchStates[switchIndex];

  const newBulbStates = calculateBulbStates(
    newSwitchStates,
    puzzle.solution,
    puzzle.wiring,
    puzzle.bulbStates.length
  );

  return {
    ...puzzle,
    switchStates: newSwitchStates,
    bulbStates: newBulbStates,
  };
}

/**
 * Check if puzzle is solved (all bulbs are on)
 */
export function isSolved(puzzle: Puzzle): boolean {
  return puzzle.bulbStates.every(state => state);
}

/**
 * Get which bulbs a switch affects (for visual feedback)
 */
export function getAffectedBulbs(puzzle: Puzzle, switchIndex: number): number[] {
  return puzzle.wiring[switchIndex];
}
