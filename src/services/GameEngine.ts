import { GameState, GamePhase } from '../models/GameState';
import { PlayerState } from '../models/Player';
import { GAME_CONSTANTS } from '../utils/constants';

export class GameEngine {
  static advanceTurn(state: GameState): void {
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    
    if (state.currentPlayerIndex === 0) {
      state.turnCount += 1;
    }
  }

  static checkGameEnd(state: GameState): PlayerState | null {
    const playersWithWinningScore = state.players.filter(
      (p) => p.prestige >= GAME_CONSTANTS.VICTORY.PRESTIGE_TARGET
    );

    if (playersWithWinningScore.length === 0) {
      return null;
    }

    const winner = playersWithWinningScore.reduce((best, current) => {
      if (current.prestige > best.prestige) return current;
      if (current.prestige === best.prestige) {
        return current.cards.length < best.cards.length ? current : best;
      }
      return best;
    });

    return winner;
  }

  static transitionPhase(state: GameState, newPhase: GamePhase): void {
    state.phase = newPhase;
  }

  static getCurrentPlayer(state: GameState): PlayerState {
    return state.players[state.currentPlayerIndex];
  }
}
