export interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter: number;
}

export const patterns: BreathingPattern[] = [
  {
    name: "Deep Breath",
    description: "Simple and calming",
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdAfter: 0,
  },
  {
    name: "4-7-8",
    description: "Relaxation technique",
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfter: 0,
  },
  {
    name: "Box Breathing",
    description: "Equal and balanced",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
  },
];
