export enum GamePhase {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  REVEAL = 'REVEAL',
  PLAYING = 'PLAYING',
  VOTING = 'VOTING',
  GAME_OVER = 'GAME_OVER'
}

export enum Role {
  CIVILIAN = 'CIVILIAN',
  IMPOSTER = 'IMPOSTER'
}

export interface Player {
  id: string;
  name: string;
  role: Role;
  isEliminated?: boolean;
}

export enum Difficulty {
  EASY = 'Kolay',
  MEDIUM = 'Orta',
  HARD = 'Zor'
}

export interface GameSettings {
  totalTimeSeconds: number;
  turnTimeSeconds: number;
  imposterCount: number;
  useImposterHint: boolean;
  categories: string[]; // Selected categories for the game
  difficulty: Difficulty; // Selected difficulty for the game
}

export interface SecretData {
  word: string;
  category: string; // Display string (can be joined categories)
  imposterHint?: string;
}

export interface WordDefinition {
  word: string;
  categories: string[]; // Array of categories this word belongs to
  difficulties: Difficulty[]; // Array of difficulties suitable for this word
  imposterHint: string;
}

export enum EndReason {
  TOTAL_TIME_UP = 'TOTAL_TIME_UP',
  TURN_TIME_UP = 'TURN_TIME_UP',
  IMPOSTER_GUESS_CORRECT = 'IMPOSTER_GUESS_CORRECT',
  IMPOSTER_GUESS_WRONG = 'IMPOSTER_GUESS_WRONG',
  VOTE_CORRECT = 'VOTE_CORRECT',
  VOTE_WRONG = 'VOTE_WRONG',
  ABORTED = 'ABORTED'
}

export interface GameResult {
  winner: Role;
  reason: EndReason;
  imposterNames: string[];
  secretWord: string;
}