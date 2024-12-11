export interface ScoreActionsProps {
  setPoints: (points: number | ((prev: number) => number)) => void;
  setAdvantages: (advantages: number | ((prev: number) => number)) => void;
  setPenalties: (penalties: number | ((prev: number) => number)) => void;
}

export interface EndedActionsProps {
  setWinner: (value: string) => void;
}
