# Data Model: Splendor Board Game

**Feature**: 001-splendor-game  
**Date**: 2026-03-19  
**Purpose**: Define entity structures, relationships, and state transitions

---

## Entity Definitions

### 1. GemColor (Enum)

Represents the six token colors in the game.

```typescript
enum GemColor {
  EMERALD = 'emerald',   // Green gems
  DIAMOND = 'diamond',   // White gems
  SAPPHIRE = 'sapphire', // Blue gems
  ONYX = 'onyx',         // Black gems
  RUBY = 'ruby',         // Red gems
  GOLD = 'gold'          // Gold joker (wild card)
}
```

**Validation Rules:**
- Only these six colors are valid
- Gold tokens can substitute for any other color during purchases

---

### 2. DevelopmentCard (Entity)

Represents a purchasable development card.

```typescript
interface DevelopmentCard {
  id: string;                    // Unique identifier (e.g., "L1-001")
  level: 1 | 2 | 3;              // Card tier (1=easiest, 3=hardest)
  cost: {                        // Token cost to purchase
    emerald?: number;
    diamond?: number;
    sapphire?: number;
    onyx?: number;
    ruby?: number;
  };
  prestige: number;              // Prestige points awarded (0-5)
  bonus: Exclude<GemColor, 'gold'>; // Permanent bonus color (not gold)
}
```

**Attributes:**
- `id`: Globally unique identifier for the card
- `level`: Determines which deck the card belongs to (1, 2, or 3)
- `cost`: Map of gem colors to quantities required (0-7 gems per color)
- `prestige`: Victory points awarded when purchased (0-5 points)
- `bonus`: Single gem color bonus granted permanently (emerald, diamond, sapphire, onyx, or ruby)

**Validation Rules:**
- Level must be 1, 2, or 3
- Cost values must be non-negative integers ≤7
- Prestige must be 0-5 (Level 1 typically 0-1, Level 2 typically 1-3, Level 3 typically 3-5)
- Bonus cannot be 'gold' (only regular gem colors)
- At least one cost color must be specified (minimum purchase cost)

**State Transitions:**
- `IN_DECK` → `FACE_UP`: Revealed during setup or when replacing a card
- `FACE_UP` → `RESERVED`: Player reserves the card
- `FACE_UP` → `PURCHASED`: Player purchases directly from market
- `RESERVED` → `PURCHASED`: Player purchases from their hand
- Terminal state: `PURCHASED` (cannot be moved once purchased)

**Data Source:**
- Loaded from JSON files: `cards-level1.json`, `cards-level2.json`, `cards-level3.json`
- 40 Level 1 cards, 30 Level 2 cards, 20 Level 3 cards (90 total)

---

### 3. Noble (Entity)

Represents a noble tile that grants prestige points.

```typescript
interface Noble {
  id: string;                    // Unique identifier (e.g., "N-001")
  name: string;                  // Noble's name (e.g., "Mary Stuart")
  requirements: {                // Bonus requirements (not tokens!)
    emerald?: number;
    diamond?: number;
    sapphire?: number;
    onyx?: number;
    ruby?: number;
  };
  prestige: 3;                   // Always worth 3 points
}
```

**Attributes:**
- `id`: Globally unique identifier
- `name`: Display name for the noble (optional flavor text)
- `requirements`: Map of bonus colors to quantities needed (3-5 bonuses per color)
- `prestige`: Always 3 points (fixed by game rules)

**Validation Rules:**
- Prestige must always be 3
- Requirements use bonuses, not tokens (common confusion point)
- Requirement values typically 3-4 per color
- Must require at least 2 different bonus colors

**State Transitions:**
- `AVAILABLE` → `CLAIMED`: Automatically awarded when player meets requirements
- Terminal state: `CLAIMED` (cannot be transferred between players)

**Game Rules:**
- Players cannot refuse a noble visit
- Only one noble per turn per player
- If multiple nobles qualify, player chooses which one
- Nobles are first-come, first-served (once claimed, unavailable to others)

**Data Source:**
- Loaded from JSON file: `nobles.json`
- 10 nobles total (5 used in 4-player game, 4 in 3-player, 3 in 2-player)

---

### 4. PlayerState (Entity)

Represents a player's current game state.

```typescript
interface PlayerState {
  id: string;                    // Player identifier (e.g., "player-1")
  color: PlayerColor;            // Visual identifier (Red, Blue, Green, Yellow)
  tokens: {                      // Tokens currently held
    emerald: number;
    diamond: number;
    sapphire: number;
    onyx: number;
    ruby: number;
    gold: number;
  };
  reservedCards: DevelopmentCard[];  // Cards in hand (max 3)
  purchasedCards: DevelopmentCard[]; // Cards purchased (sorted by color)
  bonuses: {                     // Accumulated bonuses from purchased cards
    emerald: number;
    diamond: number;
    sapphire: number;
    onyx: number;
    ruby: number;
  };
  nobles: Noble[];               // Nobles claimed
  prestige: number;              // Total prestige points
}

enum PlayerColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow'
}
```

**Attributes:**
- `id`: Unique player identifier
- `color`: Visual identifier for UI display
- `tokens`: Current token inventory (max 10 total across all colors)
- `reservedCards`: Hidden cards in hand (max 3)
- `purchasedCards`: Visible purchased cards (unlimited)
- `bonuses`: Permanent discounts from purchased cards (calculated from `purchasedCards`)
- `nobles`: Noble tiles claimed (unlimited)
- `prestige`: Total victory points (from cards + nobles)

**Validation Rules:**
- Token sum must not exceed 10 at end of turn: `sum(tokens) ≤ 10`
- Reserved cards must not exceed 3: `length(reservedCards) ≤ 3`
- Bonuses must match purchased cards: `bonuses[color] = count(purchasedCards where bonus === color)`
- Prestige must equal: `sum(purchasedCards.prestige) + sum(nobles.prestige)`

**Derived Values:**
- `totalTokens`: Sum of all token values
- `totalBonuses`: Sum of all bonus values
- `cardCount`: Length of purchasedCards array (for tie-breaking)

---

### 5. TokenSupply (Entity)

Represents the central token supply.

```typescript
interface TokenSupply {
  emerald: number;
  diamond: number;
  sapphire: number;
  onyx: number;
  ruby: number;
  gold: number;  // Always 5, regardless of player count
}
```

**Initial State (by Player Count):**

| Player Count | Gem Tokens Each | Gold Tokens |
|--------------|-----------------|-------------|
| 2 players    | 4               | 5           |
| 3 players    | 5               | 5           |
| 4 players    | 7               | 5           |

**Validation Rules:**
- Token counts cannot go negative
- Total tokens in play (supply + all players) must equal initial setup
- Conservation law: `supply.tokens + sum(player.tokens) = INITIAL_TOKENS`

**State Transitions:**
- Tokens move from supply to players (taking actions)
- Tokens move from players to supply (purchasing cards, discarding excess)

---

### 6. GameState (Root Entity)

Represents the complete game state.

```typescript
interface GameState {
  // Meta
  gameId: string;
  phase: GamePhase;
  
  // Turn management
  currentPlayerIndex: number;    // Index into players array
  round: number;                 // Current round number (starts at 1)
  
  // Game components
  players: PlayerState[];        // 2-4 players
  tokenSupply: TokenSupply;      // Central supply
  nobles: {
    available: Noble[];          // Nobles not yet claimed
    claimed: Noble[];            // Nobles awarded to players
  };
  cards: {
    faceUp: {
      level1: DevelopmentCard[]; // Always 4 cards (or fewer if deck empty)
      level2: DevelopmentCard[];
      level3: DevelopmentCard[];
    };
    decks: {
      level1: DevelopmentCard[]; // Remaining cards in deck
      level2: DevelopmentCard[];
      level3: DevelopmentCard[];
    };
  };
  
  // End game
  winner: string | null;         // Player ID of winner (null if game ongoing)
  triggeringPlayerIndex: number | null; // Player who reached 15 prestige
}

enum GamePhase {
  SETUP = 'setup',               // Initializing game
  PLAYING = 'playing',           // Active gameplay
  ENDED = 'ended'                // Game finished
}
```

**Attributes:**
- `gameId`: Unique game session identifier
- `phase`: Current game phase (setup, playing, ended)
- `currentPlayerIndex`: Index of active player (0-3)
- `round`: Round counter (increments after all players take a turn)
- `players`: Array of 2-4 player states
- `tokenSupply`: Central token pool
- `nobles`: Available and claimed nobles
- `cards`: Face-up market and remaining decks
- `winner`: Player ID who won (null until game ends)
- `triggeringPlayerIndex`: Player who reached 15 prestige first

**State Transitions:**

```
SETUP → PLAYING:
  - When game initialization completes
  - All decks shuffled, cards revealed, nobles revealed
  - Token supply initialized based on player count

PLAYING → ENDED:
  - When any player reaches 15 prestige points
  - Game continues until all players have equal turns
  - Winner determined by highest prestige (tie-break: fewest cards purchased)

Within PLAYING:
  - Turn progression: currentPlayerIndex cycles 0 → 1 → 2 → 3 → 0
  - Round increments when currentPlayerIndex wraps back to 0
```

**Invariants (must always hold):**
- `players.length` ∈ {2, 3, 4}
- `currentPlayerIndex` < `players.length`
- `faceUp.level1.length` ≤ 4 (fewer if deck empty)
- `nobles.available.length` + `nobles.claimed.length` = initial noble count
- Token conservation: `tokenSupply + sum(players.tokens) = INITIAL_SUPPLY`

---

## Relationships

### Entity Relationship Diagram

```
GameState (root)
├── players: PlayerState[] (1-4)
│   ├── tokens: TokenSupply (composition)
│   ├── reservedCards: DevelopmentCard[] (0-3, reference)
│   ├── purchasedCards: DevelopmentCard[] (0-N, reference)
│   └── nobles: Noble[] (0-N, reference)
├── tokenSupply: TokenSupply (composition)
├── nobles: { available, claimed } (composition, reference to Noble)
└── cards: { faceUp, decks } (composition, reference to DevelopmentCard)

DevelopmentCard (value object)
├── referenced by: GameState.cards
├── referenced by: PlayerState.reservedCards
└── referenced by: PlayerState.purchasedCards

Noble (value object)
├── referenced by: GameState.nobles
└── referenced by: PlayerState.nobles
```

**Relationship Types:**
- **Composition**: Entity owns the data (e.g., GameState owns token supply)
- **Reference**: Entity holds pointer to shared data (e.g., PlayerState references cards from global pool)

---

## State Machine: Turn Flow

```
┌─────────────────────────────────────────────────────────┐
│                     START TURN                          │
│                 (currentPlayerIndex set)                │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  CHOOSE ACTION      │
              │  (one of four)      │
              └──────┬──────────────┘
                     │
         ┌───────────┼───────────┬──────────────┐
         │           │           │              │
         ▼           ▼           ▼              ▼
    ┌────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐
    │ Take 3 │  │ Take 2 │  │ Reserve │  │ Purchase │
    │ Diff   │  │ Same   │  │ Card    │  │ Card     │
    └────┬───┘  └────┬───┘  └────┬────┘  └─────┬────┘
         │           │           │              │
         └───────────┴───────────┴──────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ CHECK TOKEN LIMIT   │
              │ (if > 10, discard)  │
              └──────┬──────────────┘
                     │
                     ▼
              ┌─────────────────────┐
              │ CHECK NOBLE VISIT   │
              │ (auto-award if qual)│
              └──────┬──────────────┘
                     │
                     ▼
              ┌─────────────────────┐
              │ CHECK WIN CONDITION │
              │ (>= 15 prestige?)   │
              └──────┬──────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼ YES                    ▼ NO
    ┌─────────┐            ┌──────────────┐
    │ TRIGGER │            │ NEXT PLAYER  │
    │ END GAME│            │ (index + 1)  │
    └─────────┘            └──────┬───────┘
                                  │
                                  └─────────┐
                                            │
                              ┌─────────────▼───────┐
                              │ CONTINUE UNTIL ALL  │
                              │ HAVE EQUAL TURNS    │
                              └─────────────────────┘
```

---

## Validation Rules Summary

### Token Actions

**Take 3 Different Gems:**
- Must select exactly 3 different colors (no gold)
- Each color must have ≥1 token in supply
- Result: Player token count increases by 3

**Take 2 Same Gems:**
- Must select exactly 1 color (no gold)
- Color must have ≥4 tokens in supply before taking
- Result: Player token count increases by 2

**Token Limit:**
- After any action, if player has >10 tokens, must discard until exactly 10
- Player chooses which tokens to return to supply

### Card Actions

**Reserve Card:**
- Player must have <3 reserved cards currently
- Can choose face-up card OR blind draw from any deck
- Receive 1 gold token if supply has gold available
- Face-up card replaced immediately from matching deck

**Purchase Card:**
- Player must have enough tokens + bonuses to cover cost
- Cost calculation: `requiredTokens = cardCost - playerBonuses` (per color)
- Gold tokens can substitute for any color
- Spent tokens returned to supply
- Card grants: prestige points + permanent bonus
- Face-up card replaced immediately from matching deck

### Noble Actions

**Noble Visit:**
- Automatic check at end of each turn
- Player qualifies if: `playerBonuses[color] >= nobleRequirements[color]` for all colors
- If multiple nobles qualify, player chooses one
- Cannot refuse a noble visit
- Only one noble per turn
- Noble grants: 3 prestige points

### Game End

**Trigger Condition:**
- Any player reaches ≥15 prestige points

**End Game Procedure:**
1. Note triggering player index
2. Complete round (all players get equal turns)
3. Determine winner: highest prestige
4. Tie-breaker: fewest development cards purchased
5. Second tie-breaker: triggering player's turn order (earlier wins)

---

## Data File Specifications

### Card Data Format (JSON)

```json
{
  "level": 1,
  "cards": [
    {
      "id": "L1-001",
      "cost": {
        "emerald": 0,
        "diamond": 3,
        "sapphire": 0,
        "onyx": 0,
        "ruby": 0
      },
      "prestige": 0,
      "bonus": "emerald"
    },
    ...
  ]
}
```

**Distribution:**
- Level 1: 40 cards (typically 0-1 prestige points)
- Level 2: 30 cards (typically 1-3 prestige points)
- Level 3: 20 cards (typically 3-5 prestige points)

### Noble Data Format (JSON)

```json
{
  "nobles": [
    {
      "id": "N-001",
      "name": "Mary Stuart",
      "requirements": {
        "emerald": 3,
        "diamond": 3,
        "sapphire": 3,
        "onyx": 0,
        "ruby": 0
      },
      "prestige": 3
    },
    ...
  ]
}
```

**Distribution:**
- 10 nobles total
- Each requires 7-10 total bonuses across 2-3 colors
- All nobles worth exactly 3 prestige points

---

## Performance Considerations

### Data Structure Choices

**Arrays vs Maps:**
- Use arrays for: players, face-up cards, deck cards, nobles
- Use objects for: token counts, bonuses, card costs
- Rationale: Arrays maintain order (important for turn rotation), objects enable efficient lookup

**Immutability:**
- All state mutations via Zustand + Immer
- Enables time-travel debugging, undo/redo future feature
- Performance cost negligible for ~100 game components

**Derived Values:**
- Calculate on-demand: prestige totals, total tokens, eligible nobles
- Store in selectors, not state (prevents stale data)

### Memory Budget

Estimated memory usage:
- GameState: ~50KB (90 cards * ~300 bytes + players + nobles)
- React components: 30-70MB baseline
- Total: <100MB (well under 200MB budget)

---

## Next Steps

See `contracts/` directory for:
- `card-schema.md`: Detailed card data schema and generation script
- `noble-schema.md`: Detailed noble data schema and generation script

See `quickstart.md` for:
- Development setup instructions
- Test scenario examples using this data model
- State initialization patterns
