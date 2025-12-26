# Grid Sync

A high-speed logic puzzle where you play as a Holiday Systems Engineer repairing a fractured festive electrical grid.

## The Concept

You're faced with a control panel of industrial toggle switches on the left and a bank of holiday bulbs on the right. The switches are secretly wired to bulbs through hidden connections — toggling one switch might flip the state of multiple bulbs at once.

Your goal: find the exact switch configuration that brings all bulbs online simultaneously.

## How the Puzzle Works

### The Hidden Wiring

Each switch is connected to 1-3 bulbs through an invisible bipartite graph. When you toggle a switch, it inverts the state of all bulbs it's connected to. The connections are revealed (as faint lines) as you interact with the puzzle.

### Solvability Guarantee

The puzzle is **always solvable** with exactly one correct configuration. Here's how:

1. A random wiring is generated (each switch → 1-3 bulbs)
2. A random "solution state" is defined for all switches
3. The starting configuration is scrambled (switches inverted from solution)
4. When you match the solution state, all bulbs light up

This backwards generation ensures there's always a valid solution — no impossible puzzles, no guessing.

### Deduction Strategy

- Toggle switches and observe which bulbs respond
- Notice patterns: switch 1 might affect bulbs 2 and 4, while switch 3 affects bulb 2 alone
- Use the revealed wiring (shown after each toggle) to plan your moves
- Work backwards: if bulb 3 is off and only switch 2 affects it, you know switch 2 needs to toggle

Most puzzles can be solved in 30-60 seconds once you understand the wiring.

## The Reward

When you hit the right configuration:

- All bulbs activate simultaneously with a satisfying glow
- A celebratory chord plays
- Festive colors pulse through the bulb array
- Your time and move count are displayed

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

The easiest way to deploy:

1. Push to a GitHub repository
2. Connect the repo to [Vercel](https://vercel.com)
3. Deploy with zero configuration

Or use the Vercel CLI:

```bash
npx vercel
```

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Web Audio API** for sound effects

## Design Notes

- Industrial aesthetic meets festive warmth
- Copper, gunmetal, and warm bulb glow color palette
- Satisfying tactile switch animations
- Minimal text — the interaction teaches itself
- Sound design using synthesized tones (no audio files needed)

---

Built for Shipmas 2025 · Day 26
