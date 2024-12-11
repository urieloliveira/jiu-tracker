import { EndedActionsProps, ScoreActionsProps } from "../score-actions/types";

export interface Fighter {
  id: string;
  name: string;
  team: string;
  scores: {
    advantages: number;
    penalties: number;
    points: number;
  };
  winnerBy?: string;
}

export interface FighterCardProps {
  mode: "view" | "edit";
  fighter?: Fighter;
  actions?: ScoreActionsProps & EndedActionsProps;
  ended?: boolean;
  scoreBgColor: string;
  scoreColor: string;
}
