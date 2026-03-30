import { GamePhase, GameState } from '../models/GameState';

const STORAGE_KEY = 'splendor.savedGame.v1';

type PersistedGame = GameState;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isValidSavedGame(value: unknown): value is PersistedGame {
  if (!value || typeof value !== 'object') return false;
  const game = value as Partial<PersistedGame>;
  return (
    game.phase === GamePhase.PLAYING &&
    Array.isArray(game.players) &&
    typeof game.currentPlayerIndex === 'number' &&
    typeof game.turnCount === 'number' &&
    typeof game.hasPerformedAction === 'boolean'
  );
}

export function saveGameProgress(game: GameState): void {
  if (!canUseStorage()) return;
  try {
    const snapshot: PersistedGame = {
      phase: game.phase,
      playerCount: game.playerCount,
      players: game.players,
      currentPlayerIndex: game.currentPlayerIndex,
      tokenSupply: game.tokenSupply,
      maxTokenSupply: game.maxTokenSupply,
      cardMarket: game.cardMarket,
      nobles: game.nobles,
      winner: game.winner,
      turnCount: game.turnCount,
      hasPerformedAction: game.hasPerformedAction,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage failures (private mode/full storage).
  }
}

export function loadGameProgress(): PersistedGame | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isValidSavedGame(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function hasSavedGameProgress(): boolean {
  return loadGameProgress() !== null;
}

export function clearGameProgress(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
