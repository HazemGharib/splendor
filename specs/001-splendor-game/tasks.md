# Tasks: Splendor Board Game

**Input**: Design documents from `/specs/001-splendor-game/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Following TDD approach as mandated by constitution - tests written FIRST before implementation

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling setup

- [x] T001 Initialize Vite + React + TypeScript project with `npm create vite@latest`
- [x] T002 Install core dependencies: `react@18`, `react-dom@18`, `typescript@5.3`, `zustand`, `immer`
- [x] T003 [P] Install UI dependencies: `@radix-ui/react-*`, `tailwindcss`, `class-variance-authority`
- [x] T004 [P] Install dev dependencies: `vitest`, `@testing-library/react`, `playwright`, `eslint`, `prettier`
- [x] T005 Configure TypeScript with strict mode in `tsconfig.json`
- [x] T006 Configure Tailwind CSS with design tokens in `tailwind.config.js`
- [x] T007 Configure ESLint + Prettier in `.eslintrc.json` and `.prettierrc`
- [x] T008 Configure Vitest in `vitest.config.ts`
- [x] T009 Configure Playwright in `playwright.config.ts`
- [x] T010 Create project structure: `src/`, `tests/`, `public/` directories with subdirectories per plan.md

**Checkpoint**: Development environment ready with all tooling configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create game data files: `src/assets/data/cards-level1.json` (40 cards based on contracts/card-schema.md)
- [x] T012 Create game data files: `src/assets/data/cards-level2.json` (30 cards based on contracts/card-schema.md)
- [x] T013 Create game data files: `src/assets/data/cards-level3.json` (20 cards based on contracts/card-schema.md)
- [x] T014 Create game data files: `src/assets/data/nobles.json` (10 nobles based on contracts/noble-schema.md)
- [x] T015 [P] Create TypeScript interfaces in `src/models/Card.ts` (DevelopmentCard, CardCost, GemColor enums)
- [x] T016 [P] Create TypeScript interfaces in `src/models/Noble.ts` (Noble, NobleRequirements)
- [x] T017 [P] Create TypeScript interfaces in `src/models/Player.ts` (PlayerState, PlayerColor enum)
- [x] T018 [P] Create TypeScript interfaces in `src/models/GameState.ts` (GameState, TokenSupply, GamePhase enum)
- [x] T019 Create data loader service in `src/services/DataLoader.ts` (load cards/nobles from JSON)
- [x] T020 Create Zustand game store in `src/store/gameStore.ts` (initial state structure, no actions yet)
- [x] T021 Create design system tokens in `src/styles/tokens.css` (color palette, spacing, typography)
- [x] T022 [P] Create base Button component in `src/components/design-system/Button.tsx`
- [x] T023 [P] Create base Modal component in `src/components/design-system/Modal.tsx` (Radix Dialog wrapper)
- [x] T024 Create utility shuffle function in `src/utils/shuffle.ts` (Fisher-Yates algorithm)
- [x] T025 Create constants file in `src/utils/constants.ts` (token limits, player counts, etc.)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Game Play (Priority: P1) 🎯 MVP

**Goal**: Implement core game loop from setup to victory

**Independent Test**: Start a 2-player game, take turns with different actions, verify prestige points and victory

### Tests for User Story 1 (TDD - Write FIRST)

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T026 [P] [US1] Contract test for card data schema in `tests/contract/card-data.test.ts`
- [x] T027 [P] [US1] Contract test for noble data schema in `tests/contract/noble-data.test.ts`
- [x] T028 [P] [US1] Unit test for game initialization in `tests/unit/game-init.test.ts`
- [x] T029 [P] [US1] Unit test for taking 3 different tokens in `tests/unit/actions/take-three-tokens.test.ts`
- [x] T030 [P] [US1] Unit test for taking 2 same tokens in `tests/unit/actions/take-two-tokens.test.ts`
- [x] T031 [P] [US1] Unit test for card purchase logic in `tests/unit/actions/purchase-card.test.ts`
- [x] T032 [P] [US1] Unit test for token limit enforcement in `tests/unit/rules/token-limit.test.ts`
- [x] T033 [P] [US1] Unit test for win condition check in `tests/unit/rules/win-condition.test.ts`
- [x] T034 [P] [US1] Integration test for complete turn cycle in `tests/integration/turn-cycle.test.ts`
- [x] T035 [US1] E2E test for full 2-player game in `tests/e2e/full-game.spec.ts`

### Implementation for User Story 1

- [x] T036 [US1] Implement game initialization action in `src/store/gameStore.ts` (initGame method)
- [x] T037 [US1] Implement RuleEngine validation in `src/services/RuleEngine.ts` (validateTakeTokens, validatePurchase methods)
- [x] T038 [US1] Implement takeThreeTokens action in `src/store/gameStore.ts`
- [x] T039 [US1] Implement takeTwoTokens action in `src/store/gameStore.ts`
- [x] T040 [US1] Implement purchaseCard action in `src/store/gameStore.ts`
- [x] T041 [US1] Implement discardToken action in `src/store/gameStore.ts` (for 10-token limit)
- [x] T042 [US1] Implement endTurn action in `src/store/gameStore.ts` (advance turn, check win condition)
- [x] T043 [US1] Implement GameEngine in `src/services/GameEngine.ts` (turn management, phase transitions)
- [x] T044 [P] [US1] Create GemToken component in `src/components/game/Token/GemToken.tsx`
- [x] T045 [P] [US1] Create TokenPile component in `src/components/game/Token/TokenPile.tsx`
- [x] T046 [P] [US1] Create TokenSupply component in `src/components/game/Token/TokenSupply.tsx`
- [x] T047 [P] [US1] Create DevelopmentCard component in `src/components/game/Card/DevelopmentCard.tsx`
- [x] T048 [P] [US1] Create CardCost sub-component in `src/components/game/Card/CardCost.tsx`
- [x] T049 [P] [US1] Create CardPrestige sub-component in `src/components/game/Card/CardPrestige.tsx`
- [x] T050 [P] [US1] Create CardBonus sub-component in `src/components/game/Card/CardBonus.tsx`
- [x] T051 [US1] Create CardGrid component in `src/components/game/Card/CardGrid.tsx` (4-card display per level)
- [x] T052 [P] [US1] Create PlayerArea component in `src/components/game/Player/PlayerArea.tsx`
- [x] T053 [P] [US1] Create PlayerTokens component in `src/components/game/Player/PlayerTokens.tsx`
- [x] T054 [P] [US1] Create PlayerCards component in `src/components/game/Player/PlayerCards.tsx`
- [x] T055 [P] [US1] Create PlayerScore component in `src/components/game/Player/PlayerScore.tsx`
- [x] T056 [US1] Create CardMarket component in `src/components/board/CardMarket.tsx` (3 levels of cards)
- [x] T057 [US1] Create CentralSupply component in `src/components/board/CentralSupply.tsx` (token display)
- [x] T058 [US1] Create GameBoard component in `src/components/board/GameBoard.tsx` (main layout)
- [x] T059 [US1] Create GameSetup component in `src/components/ui/GameSetup.tsx` (player count selection)
- [x] T060 [US1] Create WinnerModal component in `src/components/ui/WinnerModal.tsx` (game end screen)
- [x] T061 [US1] Wire up GameBoard in `src/main.tsx` (entry point)

**Checkpoint**: User Story 1 complete - MVP is playable! Core game loop functional.

---

## Phase 4: User Story 2 - Noble Visits and Bonuses (Priority: P2)

**Goal**: Add strategic depth through bonuses and automatic noble visits

**Independent Test**: Setup game with specific bonuses, purchase card with discount, trigger noble visit

### Tests for User Story 2 (TDD - Write FIRST)

- [x] T062 [P] [US2] Unit test for bonus calculation in `tests/unit/rules/bonus-calculation.test.ts`
- [x] T063 [P] [US2] Unit test for purchase cost with bonuses in `tests/unit/rules/cost-with-bonuses.test.ts`
- [x] T064 [P] [US2] Unit test for noble visit check in `tests/unit/rules/noble-visit.test.ts`
- [x] T065 [P] [US2] Integration test for bonus discount application in `tests/integration/bonus-discount.test.ts`
- [x] T066 [US2] Integration test for noble visit trigger in `tests/integration/noble-visit-trigger.test.ts`
- [x] T067 [US2] E2E test for noble acquisition in `tests/e2e/noble-acquisition.spec.ts`

### Implementation for User Story 2

- [x] T068 [US2] Add bonus tracking to store in `src/store/gameStore.ts` (updatePlayerBonuses method)
- [x] T069 [US2] Implement calculateRequiredTokens in `src/services/RuleEngine.ts` (subtract bonuses from cost)
- [x] T070 [US2] Implement checkNobleVisit in `src/services/RuleEngine.ts` (verify bonus requirements)
- [x] T071 [US2] Implement getEligibleNobles in `src/services/RuleEngine.ts` (find qualifying nobles)
- [x] T072 [US2] Update purchaseCard action to apply bonus discounts in `src/store/gameStore.ts`
- [x] T073 [US2] Update endTurn action to check/award nobles in `src/store/gameStore.ts`
- [x] T074 [P] [US2] Create NobleTile component in `src/components/game/Noble/NobleTile.tsx`
- [x] T075 [P] [US2] Create NobleRequirements component in `src/components/game/Noble/NobleRequirements.tsx`
- [x] T076 [P] [US2] Create PlayerBonuses component in `src/components/game/Player/PlayerBonuses.tsx`
- [x] T077 [US2] Create NobleMarket component in `src/components/board/NobleMarket.tsx` (display available nobles)
- [x] T078 [US2] Create NobleSelectionModal component in `src/components/ui/NobleSelectionModal.tsx` (when multiple qualify)
- [x] T079 [US2] Update CardCost component to show bonus discounts in `src/components/game/Card/CardCost.tsx`
- [x] T080 [US2] Update GameBoard to include NobleMarket in `src/components/board/GameBoard.tsx`

**Checkpoint**: User Story 2 complete - Strategic depth added via bonuses and nobles

---

## Phase 5: User Story 3 - Reserved Cards and Gold Tokens (Priority: P3)

**Goal**: Add tactical card hiding and gold wild cards

**Independent Test**: Reserve face-up card, reserve blind card, use gold token in purchase

### Tests for User Story 3 (TDD - Write FIRST)

- [x] T081 [P] [US3] Unit test for card reservation in `tests/unit/actions/reserve-card.test.ts`
- [x] T082 [P] [US3] Unit test for reservation limit in `tests/unit/rules/reservation-limit.test.ts`
- [x] T083 [P] [US3] Unit test for gold token wild card in `tests/unit/rules/gold-wildcard.test.ts`
- [x] T084 [US3] Integration test for purchase from hand in `tests/integration/purchase-reserved.test.ts`
- [x] T085 [US3] E2E test for reservation flow in `tests/e2e/card-reservation.spec.ts`

### Implementation for User Story 3

- [x] T086 [US3] Implement reserveCard action in `src/store/gameStore.ts` (add to hand, award gold)
- [x] T087 [US3] Implement reserveBlindCard action in `src/store/gameStore.ts` (draw from deck)
- [x] T088 [US3] Update purchaseCard to allow gold tokens as wildcards in `src/store/gameStore.ts`
- [x] T089 [US3] Add validation for 3-card reservation limit in `src/services/RuleEngine.ts`
- [x] T090 [P] [US3] Create ReservedCards component in `src/components/game/Player/ReservedCards.tsx` (hidden from opponents)
- [x] T091 [US3] Update DevelopmentCard to support reserve action in `src/components/game/Card/DevelopmentCard.tsx`
- [x] T092 [US3] Update TokenSupply to show gold tokens in `src/components/game/Token/TokenSupply.tsx`
- [x] T093 [US3] Update CardMarket to show reserve option in `src/components/board/CardMarket.tsx`
- [x] T094 [US3] Create DeckPile component in `src/components/game/Card/DeckPile.tsx` (blind reservation option)

**Checkpoint**: User Story 3 complete - Tactical depth added via card hiding and gold tokens

---

## Phase 6: User Story 4 - Multi-Player Game Setup (Priority: P4)

**Goal**: Correctly balance game for 2, 3, or 4 players

**Independent Test**: Start games with each player count, verify token/noble counts

### Tests for User Story 4 (TDD - Write FIRST)

- [x] T095 [P] [US4] Unit test for 2-player setup in `tests/unit/setup/two-player.test.ts`
- [x] T096 [P] [US4] Unit test for 3-player setup in `tests/unit/setup/three-player.test.ts`
- [x] T097 [P] [US4] Unit test for 4-player setup in `tests/unit/setup/four-player.test.ts`
- [x] T098 [US4] E2E test for all player counts in `tests/e2e/multi-player-setup.spec.ts`

### Implementation for User Story 4

- [x] T099 [US4] Update initGame to adjust tokens by player count in `src/store/gameStore.ts`
- [x] T100 [US4] Update initGame to adjust nobles by player count in `src/store/gameStore.ts`
- [x] T101 [US4] Update GameSetup to show player count options (2, 3, 4) in `src/components/ui/GameSetup.tsx`
- [x] T102 [US4] Add player count validation in `src/services/RuleEngine.ts`

**Checkpoint**: User Story 4 complete - All player counts supported

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T103 [P] Implement colorblind mode toggle in `src/hooks/useColorblindMode.ts`
- [x] T104 [P] Create Settings modal in `src/components/ui/SettingsModal.tsx` (colorblind mode, rules)
- [x] T105 [P] Add keyboard navigation support to all interactive components
- [x] T106 [P] Add ARIA labels and screen reader support
- [x] T107 [P] Create HelpModal component in `src/components/ui/HelpModal.tsx` (game rules explanation)
- [x] T108 [P] Add animations for card flips in `src/styles/animations.css`
- [x] T109 [P] Add animations for token collection in `src/styles/animations.css`
- [x] T110 [P] Implement responsive breakpoints for mobile/tablet/desktop
- [x] T111 [P] Create loading states for game initialization
- [x] T112 [P] Add error boundaries for graceful error handling
- [x] T113 Add performance monitoring in `src/utils/performance.ts` (FPS tracking)
- [x] T114 [P] Create favicon and meta tags in `public/index.html`
- [x] T115 [P] Add PWA manifest for offline support
- [x] T116 Run full E2E test suite and fix any regressions
- [x] T117 Run performance benchmarks and optimize if needed
- [x] T118 Run accessibility audit (Lighthouse, axe) and fix issues
- [x] T119 Verify code coverage meets 80% minimum threshold
- [x] T120 Final code review and cleanup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Core MVP
- **User Story 2 (Phase 4)**: Depends on Foundational - Can start after US1 OR in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational + US1 (needs purchase mechanics) - Start after US1
- **User Story 4 (Phase 6)**: Depends on Foundational + US1 (needs game init) - Can run in parallel with US2/US3
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Foundational (Phase 2)
├── User Story 1 (Phase 3) - MVP Core
│   ├── User Story 2 (Phase 4) - Can parallelize
│   ├── User Story 3 (Phase 5) - Needs US1 purchase mechanics
│   └── User Story 4 (Phase 6) - Can parallelize
└── Polish (Phase 7)
```

**Independence**: US2 and US4 can be developed in parallel with US1 once foundation is ready. US3 needs US1's purchase logic complete.

### Within Each Phase

**Foundational (Phase 2)**:
- T011-T014: Data files (can be done in parallel)
- T015-T018: Type definitions (can be done in parallel)
- T019-T020: Data loader and store (sequential: loader → store)
- T021-T024: Design system and utilities (can be done in parallel)

**User Story 1 (Phase 3)**:
- T026-T035: Tests first (can be written in parallel)
- T036-T043: State management and game logic (mostly sequential, core actions)
- T044-T055: Components (can be built in parallel by type: Token, Card, Player)
- T056-T061: Board layout and wiring (sequential: markets → board → app)

**User Story 2-4**: Similar pattern - tests first, then logic, then UI

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks T002-T010 marked [P] can run in parallel after T001

**Phase 2 (Foundational)**: 
- T011-T014 (data files)
- T015-T018 (interfaces)
- T022-T023 (UI components)

**Phase 3 (US1)**:
- T026-T035 (all tests)
- T044-T055 (all game components by type)

**Phase 7 (Polish)**: Most tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. **Complete Phase 1** (Setup) → ~1-2 days
2. **Complete Phase 2** (Foundational) → ~2-3 days
3. **Complete Phase 3** (User Story 1) → ~4-5 days
4. **STOP and VALIDATE**: Test full game loop independently
5. **Deploy/Demo MVP**: Playable 2-player Splendor game

**Total MVP Time**: ~1-2 weeks for basic playable game

### Incremental Delivery

After MVP (Phase 3 complete):

1. **Add Phase 4** (User Story 2 - Nobles/Bonuses) → ~2-3 days
   - Test independently, deploy
2. **Add Phase 5** (User Story 3 - Reservations) → ~2-3 days
   - Test independently, deploy
3. **Add Phase 6** (User Story 4 - Multi-player) → ~1 day
   - Test independently, deploy
4. **Add Phase 7** (Polish) → ~2-3 days
   - Final polish and deployment

**Total Full Feature**: ~3-4 weeks

### Parallel Team Strategy

With 3 developers after Foundational phase:

1. **Developer A**: User Story 1 (Core MVP)
2. **Developer B**: User Story 2 (Nobles/Bonuses) - starts after T036-T043 from US1 complete
3. **Developer C**: User Story 4 (Multi-player setup) - can start immediately

User Story 3 starts after US1 complete (needs purchase mechanics).

---

## Task Count Summary

- **Phase 1 (Setup)**: 10 tasks
- **Phase 2 (Foundational)**: 15 tasks
- **Phase 3 (US1)**: 36 tasks (10 tests + 26 implementation)
- **Phase 4 (US2)**: 19 tasks (6 tests + 13 implementation)
- **Phase 5 (US3)**: 14 tasks (5 tests + 9 implementation)
- **Phase 6 (US4)**: 8 tasks (4 tests + 4 implementation)
- **Phase 7 (Polish)**: 18 tasks

**Total**: 120 tasks

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1-3 (61 tasks) = Fully playable core game

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- TDD approach: Write tests FIRST (red), implement (green), refactor
- Commit after each task or logical group of parallel tasks
- Constitution requires 80% code coverage - verify after each phase