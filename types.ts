
export type PlayerSlot = 'A' | 'B' | 'C';

export interface Team {
  id: number;
  name: string;
  players: string[];
}

export interface MatchAssignment {
  [key: string]: string; // Slot (A, B, C) -> Player Name
}

export interface GameResult {
  slot: PlayerSlot;
  winnerTeamId: number | null; // null if not reported yet
}

export interface RoundMatch {
  team1Id: number;
  team2Id: number;
  assignments: {
    [teamId: number]: MatchAssignment;
  };
  results: GameResult[];
  completed: boolean;
}

export interface RoundData {
  roundNumber: number;
  matches: RoundMatch[];
  isLocked: boolean; // True when all teams registered their slots
}

export enum AppStep {
  WELCOME = 'WELCOME',
  RULES = 'RULES',
  ROUND_PREVIEW = 'ROUND_PREVIEW',
  STRATEGY_REGISTRATION = 'STRATEGY_REGISTRATION',
  MATCHING_DISPLAY = 'MATCHING_DISPLAY',
  BATTLE_PROGRESS = 'BATTLE_PROGRESS',
  ROUND_REVEAL = 'ROUND_REVEAL',
  FINAL_STANDINGS = 'FINAL_STANDINGS'
}
