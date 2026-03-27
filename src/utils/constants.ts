export const GAME_CONSTANTS = {
  PLAYER: {
    MIN_COUNT: 2,
    MAX_COUNT: 4,
    MAX_TOKENS: 10,
    MAX_RESERVED_CARDS: 3,
  },
  
  TOKENS: {
    GEM_TOKENS_2P: 4,
    GEM_TOKENS_3P: 5,
    GEM_TOKENS_4P: 7,
    GOLD_TOKENS: 5,
  },
  
  NOBLES: {
    COUNT_2P: 3,
    COUNT_3P: 4,
    COUNT_4P: 5,
    PRESTIGE_VALUE: 3,
  },
  
  CARDS: {
    VISIBLE_PER_LEVEL: 4,
    LEVEL1_TOTAL: 40,
    LEVEL2_TOTAL: 30,
    LEVEL3_TOTAL: 20,
  },
  
  VICTORY: {
    PRESTIGE_TARGET: 15,
  },
  
  ACTIONS: {
    TAKE_THREE_DIFFERENT: 'take_three_different',
    TAKE_TWO_SAME: 'take_two_same',
    RESERVE_CARD: 'reserve_card',
    PURCHASE_CARD: 'purchase_card',
  },
} as const;

export type GameAction = typeof GAME_CONSTANTS.ACTIONS[keyof typeof GAME_CONSTANTS.ACTIONS];
