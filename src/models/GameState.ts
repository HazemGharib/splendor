import { PlayerState } from './Player';
import { DevelopmentCard } from './Card';
import { Noble } from './Noble';

export enum GamePhase {
  SETUP = 'setup',
  PLAYING = 'playing',
  GAME_OVER = 'game_over',
}

export interface TokenSupply {
  emerald: number;
  diamond: number;
  sapphire: number;
  onyx: number;
  ruby: number;
  gold: number;
}

export interface CardMarket {
  level1: {
    visible: DevelopmentCard[];
    deck: DevelopmentCard[];
  };
  level2: {
    visible: DevelopmentCard[];
    deck: DevelopmentCard[];
  };
  level3: {
    visible: DevelopmentCard[];
    deck: DevelopmentCard[];
  };
}

export interface GameState {
  phase: GamePhase;
  playerCount: 2 | 3 | 4;
  players: PlayerState[];
  currentPlayerIndex: number;
  tokenSupply: TokenSupply;
  maxTokenSupply: TokenSupply;
  cardMarket: CardMarket;
  nobles: Noble[];
  winner: PlayerState | null;
  turnCount: number;
  hasPerformedAction: boolean;
}
