# Feature Specification: Splendor Board Game

**Feature Branch**: `001-splendor-game`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "Build the game of splendor that follows the game rules in the context folder"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Game Play (Priority: P1)

Players can start a new game, take their turns performing one of the four allowed actions (taking tokens, reserving cards, or purchasing cards), and see their prestige points accumulate toward the 15-point victory goal.

**Why this priority**: This is the core game loop that makes Splendor playable. Without this, there is no game.

**Independent Test**: Can be fully tested by starting a game with 2 players, having each player take turns performing different actions (take tokens, purchase a level 1 card), and verifying prestige points update correctly when cards are purchased.

**Acceptance Scenarios**:

1. **Given** a new game is started with 2-4 players, **When** the game initializes, **Then** the correct number of tokens (based on player count) are placed, 4 cards from each level (1, 2, 3) are revealed, and the appropriate number of nobles are revealed (players + 1)
2. **Given** it is a player's turn, **When** they take 3 gem tokens of different colors, **Then** their token count increases by 3 and their turn ends
3. **Given** there are at least 4 tokens of a color available, **When** a player takes 2 tokens of the same color, **Then** their token count increases by 2 and their turn ends
4. **Given** a player has less than 3 reserved cards, **When** they reserve a face-up development card, **Then** the card moves to their hand, they receive 1 gold token (if available), and a new card replaces the reserved one
5. **Given** a player has enough tokens and/or bonuses, **When** they purchase a development card, **Then** the required tokens are returned to the supply, the card is added to their collection showing its bonus and prestige points, and their turn ends
6. **Given** a player has more than 10 tokens at the end of their turn, **When** their turn ends, **Then** they must discard tokens until they have exactly 10
7. **Given** a player reaches 15 prestige points, **When** the round completes (all players have equal turns), **Then** the player with the highest prestige points wins, with ties broken by fewest development cards purchased

---

### User Story 2 - Noble Visits and Bonuses (Priority: P2)

Players automatically receive visits from nobles when they accumulate the required bonuses from development cards, and can use bonuses to reduce the cost of purchasing cards.

**Why this priority**: Nobles and bonuses are core strategic elements that differentiate skilled play from random moves. This adds depth to the game.

**Independent Test**: Can be tested by setting up a game state where a player has development cards providing specific bonuses, attempting to purchase a card with bonus discounts applied, and triggering a noble visit when bonus requirements are met.

**Acceptance Scenarios**:

1. **Given** a player has bonuses from previously purchased development cards, **When** they purchase a new development card, **Then** each bonus of a matching color reduces the token cost by 1 for that color
2. **Given** a player has bonuses that exactly or exceed a noble's requirements, **When** their turn ends, **Then** they automatically receive that noble tile (worth 3 prestige points) without it counting as an action
3. **Given** a player qualifies for multiple nobles at turn end, **When** the noble visit occurs, **Then** the player chooses which single noble to receive
4. **Given** a player has sufficient bonuses to purchase a card, **When** they attempt the purchase, **Then** they can purchase it without spending any tokens
5. **Given** multiple players qualify for the same noble, **When** each player's turn ends, **Then** only the first player to meet the requirements receives that noble

---

### User Story 3 - Reserved Cards and Gold Tokens (Priority: P3)

Players can reserve development cards to their hand (maximum 3), hiding them from opponents and gaining gold joker tokens that can substitute for any gem color.

**Why this priority**: Reserving cards adds tactical depth and player interaction (blocking opponents from valuable cards), but the game is playable without this mechanic.

**Independent Test**: Can be tested by having a player reserve a face-up card (and receive a gold token), reserve a blind card from a deck, attempt to reserve when already holding 3 cards, and use a gold token as a wild card when purchasing.

**Acceptance Scenarios**:

1. **Given** a player has fewer than 3 reserved cards, **When** they choose to reserve a face-up card, **Then** the card moves to their hand (hidden from opponents), they receive 1 gold token if available, and a new card of the same level replaces it
2. **Given** a player chooses to reserve from a deck, **When** they perform the reserve action, **Then** they draw the top card from the chosen level deck (without revealing it to others) and receive 1 gold token if available
3. **Given** a player already has 3 reserved cards, **When** they attempt to reserve another card, **Then** the action is not allowed
4. **Given** a player has reserved cards, **When** they choose to purchase one, **Then** they can purchase any card in their hand following normal purchase rules
5. **Given** the gold token supply is empty, **When** a player reserves a card, **Then** they still reserve the card but do not receive a gold token
6. **Given** a player is purchasing a card and has gold tokens, **When** they pay for the card, **Then** they can use gold tokens to substitute for any gem color

---

### User Story 4 - Multi-Player Game Setup (Priority: P4)

The game correctly adjusts token counts and noble counts based on the number of players (2, 3, or 4 players), following the official rules for each player count.

**Why this priority**: This ensures the game balances correctly for different player counts, but 4-player setup can serve as a default for initial testing.

**Independent Test**: Can be tested by starting games with 2, 3, and 4 players and verifying the correct number of gem tokens (4, 5, or 7 per color) and nobles (3, 4, or 5) are set up.

**Acceptance Scenarios**:

1. **Given** a 2-player game is started, **When** the game initializes, **Then** 4 tokens of each gem color (not gold) and 3 noble tiles are revealed
2. **Given** a 3-player game is started, **When** the game initializes, **Then** 5 tokens of each gem color (not gold) and 4 noble tiles are revealed
3. **Given** a 4-player game is started, **When** the game initializes, **Then** 7 tokens of each gem color (not gold) and 5 noble tiles are revealed
4. **Given** any game setup, **When** the game initializes, **Then** 5 gold tokens are always available regardless of player count

---

### Edge Cases

- What happens when a deck runs out of cards and a space should be refilled? Empty spaces remain empty and no replacement occurs.
- What happens when a player takes tokens that would put them over 10 but they're in the middle of their action? The action completes first, then they must discard to 10 before ending their turn.
- What happens when a player tries to take 2 tokens of a color when fewer than 4 are available? The action is invalid and cannot be performed.
- What happens when a player has enough bonuses to be visited by a noble but another player already took that noble? They are not visited; nobles are first-come, first-served.
- What happens at the end of the game if multiple players are tied with the same prestige points and same number of development cards? This is an extremely rare edge case that the official rules don't cover; implementation should select the player who reached the tied score first (earliest in turn order during the final round).
- What happens when purchasing a card that has a cost that exactly matches the player's bonuses? The player spends no tokens and acquires the card.
- What happens if a player attempts an action out of turn? The system prevents this; only the active player can take actions.

## Requirements *(mandatory)*

### Functional Requirements

**Game Setup**
- **FR-001**: System MUST support 2, 3, or 4 players
- **FR-002**: System MUST initialize the correct number of gem tokens based on player count (4 for 2 players, 5 for 3 players, 7 for 4 players)
- **FR-003**: System MUST initialize 5 gold tokens regardless of player count
- **FR-004**: System MUST load development card data from static data files and shuffle to create three separate card decks (Level 1, 2, 3)
- **FR-005**: System MUST reveal 4 cards from each development level at game start
- **FR-006**: System MUST load noble tile data from static data files, shuffle, and reveal the correct number based on player count (players + 1)
- **FR-007**: System MUST designate the youngest player as the starting player and establish clockwise turn order

**Player Actions**
- **FR-008**: System MUST allow players to take exactly one action per turn from four choices: take 3 different gems, take 2 same gems, reserve a card, or purchase a card
- **FR-009**: System MUST validate that taking 2 tokens of the same color is only allowed when 4 or more tokens of that color remain before the action
- **FR-010**: System MUST enforce the 10-token limit per player at the end of their turn, prompting discards if exceeded
- **FR-011**: System MUST enforce the 3-card limit for reserved cards per player
- **FR-012**: System MUST allow players to reserve either a face-up card or a blind draw from any deck
- **FR-013**: System MUST grant 1 gold token when a player reserves a card (if gold tokens remain in supply)
- **FR-014**: System MUST allow players to purchase face-up cards or their own reserved cards
- **FR-015**: System MUST calculate purchase costs by subtracting bonuses from token requirements
- **FR-016**: System MUST allow gold tokens to substitute for any gem color during purchases
- **FR-017**: System MUST return spent tokens to the supply when a card is purchased
- **FR-018**: System MUST immediately replace face-up cards when purchased or reserved (drawing from the matching level deck)

**Bonuses and Nobles**
- **FR-019**: System MUST track bonuses provided by each development card a player owns
- **FR-020**: System MUST apply bonuses as permanent discounts when calculating card purchase costs
- **FR-021**: System MUST automatically check for noble visits at the end of each player's turn
- **FR-022**: System MUST grant a noble tile to a player when their bonuses meet or exceed the noble's requirements
- **FR-023**: System MUST allow a player to choose which noble to receive if multiple nobles are available
- **FR-024**: System MUST limit noble visits to one per turn per player
- **FR-025**: System MUST prevent refusing a noble visit when requirements are met

**Scoring and Game End**
- **FR-026**: System MUST track prestige points from development cards and noble tiles for each player
- **FR-027**: System MUST trigger game end when any player reaches 15 prestige points
- **FR-028**: System MUST complete the current round so all players have equal turns after the 15-point trigger
- **FR-029**: System MUST determine the winner as the player with the highest prestige points
- **FR-030**: System MUST resolve ties by selecting the player with the fewest development cards purchased
- **FR-031**: System MUST display all player scores, bonuses, and card counts visibly throughout the game

**Visibility and State**
- **FR-032**: System MUST keep all player tokens visible to all players at all times
- **FR-033**: System MUST keep all player development cards visible showing bonuses and prestige points
- **FR-034**: System MUST keep reserved cards hidden from other players (only the owner can see them)
- **FR-035**: System MUST display current turn order and indicate whose turn it is using player colors
- **FR-036**: System MUST display available face-up cards, nobles, and token supplies at all times

### Key Entities

- **Player**: Represents a game participant; tracks tokens held (by color, max 10 total), reserved cards (max 3), purchased development cards, bonuses (by color), prestige points, and turn order position
- **Development Card**: Represents a purchasable card; has a level (1, 2, or 3), token cost (by gem color), prestige point value, and bonus type (gem color); can be face-up, in a deck, reserved, or purchased
- **Noble Tile**: Represents a noble; has bonus requirements (by color) and awards 3 prestige points; can be available or claimed by a player
- **Token**: Represents a gem or gold token; has a color type (emerald, diamond, sapphire, onyx, ruby, or gold); exists in supply or held by players
- **Game State**: Tracks current turn player, round number, available tokens in supply, face-up cards by level, available nobles, deck counts, and game phase (in-progress or ended)
- **Token Supply**: Tracks the count of each token color available in the center supply; adjusts based on player count at setup
- **Bonus**: Represents a permanent discount; associated with a gem color; accumulated from purchased development cards; applied automatically during purchase calculations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full 2-player game from setup to victory in under 30 minutes
- **SC-002**: All player actions (taking tokens, reserving, purchasing) provide visual feedback within 100ms
- **SC-003**: The game correctly enforces all rules 100% of the time (no illegal moves allowed, all automatic triggers fire correctly)
- **SC-004**: The game maintains smooth 60 FPS performance during all gameplay interactions
- **SC-005**: Players can understand the current game state (whose turn, available actions, card costs, token counts, prestige scores) at a glance without confusion
- **SC-006**: 95% of first-time players can learn the core rules and complete their first game within 45 minutes
- **SC-007**: Game state transitions (setup, turn changes, card purchases, noble visits, game end) occur instantly with no perceivable lag
- **SC-008**: The UI consistently follows the design system for all game elements (cards, tokens, nobles, player areas)
- **SC-009**: All game rules from the official Splendor rulebook are implemented with 100% accuracy
- **SC-010**: Players can visually distinguish between all token colors and card elements (meets accessibility standards for colorblind players)

## Clarifications

### Session 2026-03-19

- Q: Which platform(s) should the game support? → A: Web (browser-based, responsive design for desktop/tablet/mobile)
- Q: How should players be identified during gameplay? → A: Player colors (e.g., Red, Blue, Green, Yellow)
- Q: How will the official Splendor card and noble data be provided? → A: Static data files (JSON/YAML) embedded in codebase, generated during implementation

## Assumptions

- The game will be single-device pass-and-play (all players take turns on the same device/screen)
- The game targets modern web browsers with responsive design supporting desktop, tablet, and mobile viewports
- Players are identified by colors (e.g., Red, Blue, Green, Yellow) rather than custom names
- The development card content (costs, bonuses, prestige points) will be provided as static JSON/YAML data files embedded in the codebase, based on the official Splendor card distributions
- The noble tile content (bonus requirements) will be provided as static JSON/YAML data files embedded in the codebase, based on the official Splendor noble tiles
- AI opponents are not included in this specification (human players only)
- Online multiplayer is not included in this specification (local play only)
- The game does not need to support saving/loading mid-game (complete games in one session)
- The youngest player determination will be manual (players self-select who goes first)
