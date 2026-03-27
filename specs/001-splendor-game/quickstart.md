# Quickstart: Splendor Development

**Feature**: 001-splendor-game  
**Date**: 2026-03-19  
**Purpose**: Development setup, testing scenarios, and workflow guidance

---

## Development Setup

### Prerequisites

- **Node.js**: 20.x or later
- **Package Manager**: npm, yarn, or pnpm
- **Editor**: VS Code (recommended) with ESLint + Prettier extensions
- **Browser**: Chrome/Firefox/Safari latest for testing

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd splendor

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (in separate terminal)
npm run test

# Run tests in watch mode
npm run test:watch
```

### Project Structure

```
splendor/
├── src/
│   ├── assets/data/          # Game data (cards, nobles JSON)
│   ├── components/           # UI components
│   ├── models/               # TypeScript interfaces
│   ├── services/             # Business logic
│   ├── store/                # Zustand state management
│   ├── styles/               # Tailwind + custom styles
│   └── main.ts               # Entry point
├── tests/
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── contract/             # Data schema tests
│   └── e2e/                  # Playwright E2E tests
├── specs/001-splendor-game/  # Feature documentation
└── public/                   # Static assets
```

---

## Development Workflow (TDD)

### Step 1: Write Test First (Red Phase)

```typescript
// tests/unit/services/game-actions.test.ts
import { describe, it, expect } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('FR-009: Taking 2 same-color tokens', () => {
  it('allows taking 2 tokens when 4+ available', () => {
    const store = useGameStore.getState();
    
    // Setup: 2-player game (4 tokens per color)
    store.actions.initGame(2);
    
    // Action: Take 2 emerald tokens
    store.actions.takeTwoTokens('emerald');
    
    // Assert: Player received 2, supply decreased by 2
    const player = store.selectors.getCurrentPlayer();
    expect(player.tokens.emerald).toBe(2);
    expect(store.tokenSupply.emerald).toBe(2);
  });
  
  it('prevents taking 2 tokens when <4 available', () => {
    const store = useGameStore.getState();
    
    // Setup: 2-player game, manually set to 3 emerald tokens
    store.actions.initGame(2);
    store.tokenSupply.emerald = 3;
    
    // Action: Attempt to take 2 emerald tokens
    const result = store.actions.takeTwoTokens('emerald');
    
    // Assert: Action rejected, no state change
    expect(result.success).toBe(false);
    expect(result.error).toContain('4 tokens required');
    expect(store.tokenSupply.emerald).toBe(3); // Unchanged
  });
});
```

**Expected Result**: Tests fail (red) because `takeTwoTokens` action doesn't exist yet.

### Step 2: Implement Minimum Code (Green Phase)

```typescript
// src/store/gameStore.ts
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // ... state ...
    
    actions: {
      takeTwoTokens: (color: GemColor) => {
        const state = get();
        
        // Validate: Must have 4+ tokens available
        if (state.tokenSupply[color] < 4) {
          return { 
            success: false, 
            error: `Need 4 tokens available to take 2. Only ${state.tokenSupply[color]} ${color} tokens remain.` 
          };
        }
        
        // Apply state change
        set((draft) => {
          const player = draft.players[draft.game.currentPlayerIndex];
          player.tokens[color] += 2;
          draft.tokenSupply[color] -= 2;
        });
        
        return { success: true };
      },
    },
  }))
);
```

**Expected Result**: Tests pass (green).

### Step 3: Refactor (Refactor Phase)

```typescript
// Extract validation to RuleEngine
export class RuleEngine {
  static validateTakeTwoTokens(supply: TokenSupply, color: GemColor): ValidationResult {
    if (supply[color] < 4) {
      return {
        valid: false,
        reason: `Need 4 tokens available to take 2. Only ${supply[color]} ${color} tokens remain.`
      };
    }
    return { valid: true };
  }
}

// Refactored action
takeTwoTokens: (color: GemColor) => {
  const validation = RuleEngine.validateTakeTwoTokens(get().tokenSupply, color);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }
  
  set((draft) => {
    const player = draft.players[draft.game.currentPlayerIndex];
    player.tokens[color] += 2;
    draft.tokenSupply[color] -= 2;
  });
  
  return { success: true };
},
```

**Expected Result**: Tests still pass after refactoring.

---

## Testing Scenarios

### Scenario 1: Complete 2-Player Game (P1 User Story)

**Objective**: Verify full game loop from setup to victory.

```typescript
// tests/e2e/full-game.spec.ts
import { test, expect } from '@playwright/test';

test('complete 2-player game to victory', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Setup: Start 2-player game
  await page.click('[data-testid="new-game"]');
  await page.click('[data-testid="player-count-2"]');
  await page.click('[data-testid="start-game"]');
  
  // Verify setup
  await expect(page.locator('[data-testid="player-1"]')).toBeVisible();
  await expect(page.locator('[data-testid="player-2"]')).toBeVisible();
  await expect(page.locator('[data-testid="token-emerald"]')).toContainText('4'); // 4 tokens per color
  await expect(page.locator('[data-testid="nobles-available"]')).toContainText('3'); // 3 nobles
  
  // Turn 1: Player 1 takes 3 different tokens
  await page.click('[data-testid="token-emerald"]');
  await page.click('[data-testid="token-diamond"]');
  await page.click('[data-testid="token-sapphire"]');
  await page.click('[data-testid="end-turn"]');
  
  // Verify: Player 1 has 3 tokens, Player 2's turn
  await expect(page.locator('[data-testid="player-1-tokens"]')).toContainText('3');
  await expect(page.locator('[data-testid="current-player"]')).toContainText('Player 2');
  
  // Turn 2: Player 2 reserves a card
  await page.click('[data-testid="card-L1-001"]');
  await page.click('[data-testid="action-reserve"]');
  await page.click('[data-testid="end-turn"]');
  
  // Verify: Player 2 has reserved card + gold token
  await expect(page.locator('[data-testid="player-2-reserved"]')).toContainText('1');
  await expect(page.locator('[data-testid="player-2-tokens"]')).toContainText('1'); // Gold
  
  // Continue game... (abbreviated for brevity)
  // Eventually one player reaches 15 prestige
  
  // Verify win condition
  await expect(page.locator('[data-testid="game-over"]')).toBeVisible();
  await expect(page.locator('[data-testid="winner"]')).toContainText(/Player [12] Wins/);
});
```

### Scenario 2: Noble Visit Trigger (P2 User Story)

**Objective**: Verify automatic noble visit when bonus requirements met.

```typescript
// tests/integration/noble-visit.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '@/components/board/GameBoard';
import { useGameStore } from '@/store/gameStore';

describe('Noble Visit Mechanics', () => {
  it('awards noble automatically when requirements met', () => {
    // Setup: Create game state with player near noble requirements
    const store = useGameStore.getState();
    store.actions.initGame(2);
    
    // Give player cards that provide bonuses
    const player = store.players[0];
    player.purchasedCards = [
      { id: 'L1-001', level: 1, cost: {}, prestige: 0, bonus: 'emerald' },
      { id: 'L1-002', level: 1, cost: {}, prestige: 0, bonus: 'emerald' },
      { id: 'L1-003', level: 1, cost: {}, prestige: 0, bonus: 'emerald' },
      { id: 'L2-001', level: 2, cost: {}, prestige: 1, bonus: 'diamond' },
      { id: 'L2-002', level: 2, cost: {}, prestige: 1, bonus: 'diamond' },
      { id: 'L2-003', level: 2, cost: {}, prestige: 1, bonus: 'diamond' },
      { id: 'L3-001', level: 3, cost: {}, prestige: 3, bonus: 'sapphire' },
      { id: 'L3-002', level: 3, cost: {}, prestige: 3, bonus: 'sapphire' },
      { id: 'L3-003', level: 3, cost: {}, prestige: 3, bonus: 'sapphire' },
    ];
    
    // Recalculate bonuses
    store.actions.updatePlayerBonuses(0);
    
    // Setup noble requiring 3 emerald, 3 diamond, 3 sapphire
    const noble = {
      id: 'N-001',
      name: 'Mary Stuart',
      requirements: { emerald: 3, diamond: 3, sapphire: 3 },
      prestige: 3
    };
    store.nobles.available = [noble];
    
    // Action: End turn (triggers noble check)
    store.actions.endTurn();
    
    // Assert: Noble awarded automatically
    expect(player.nobles).toHaveLength(1);
    expect(player.nobles[0].id).toBe('N-001');
    expect(player.prestige).toBeGreaterThanOrEqual(3); // From noble
    expect(store.nobles.available).toHaveLength(0); // Removed from available
  });
  
  it('allows player to choose when multiple nobles qualify', () => {
    // Setup similar to above, but with 2 nobles qualifying
    const store = useGameStore.getState();
    // ... setup player with high bonuses ...
    
    const noble1 = { id: 'N-001', name: 'Mary Stuart', requirements: { emerald: 3, diamond: 3, sapphire: 3 }, prestige: 3 };
    const noble2 = { id: 'N-002', name: 'Charles V', requirements: { emerald: 4, onyx: 4 }, prestige: 3 };
    store.nobles.available = [noble1, noble2];
    
    render(<GameBoard />);
    
    // Action: End turn
    fireEvent.click(screen.getByTestId('end-turn'));
    
    // Assert: Noble selection modal appears
    expect(screen.getByTestId('noble-selection-modal')).toBeVisible();
    expect(screen.getByText('Mary Stuart')).toBeVisible();
    expect(screen.getByText('Charles V')).toBeVisible();
    
    // Action: Choose noble 1
    fireEvent.click(screen.getByTestId('select-noble-N-001'));
    
    // Assert: Only noble 1 awarded
    const player = store.players[0];
    expect(player.nobles).toHaveLength(1);
    expect(player.nobles[0].id).toBe('N-001');
  });
});
```

### Scenario 3: Token Limit Enforcement (P1 User Story)

**Objective**: Verify 10-token limit enforced at turn end.

```typescript
// tests/unit/rules/token-limit.test.ts
import { describe, it, expect } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('FR-010: Token Limit Enforcement', () => {
  it('prompts discard when player exceeds 10 tokens', () => {
    const store = useGameStore.getState();
    store.actions.initGame(2);
    
    // Setup: Give player 8 tokens
    const player = store.players[0];
    player.tokens = { emerald: 2, diamond: 2, sapphire: 2, onyx: 2, ruby: 0, gold: 0 };
    
    // Action: Take 3 more tokens (would result in 11 total)
    store.actions.takeThreeTokens(['emerald', 'diamond', 'sapphire']);
    
    // Assert: Action succeeds, but discard required before turn end
    expect(player.tokens.emerald).toBe(3);
    expect(player.tokens.diamond).toBe(3);
    expect(player.tokens.sapphire).toBe(3);
    
    const totalTokens = Object.values(player.tokens).reduce((a, b) => a + b, 0);
    expect(totalTokens).toBe(11);
    expect(store.game.phase).toBe('awaiting-discard'); // Special state
    
    // Action: Discard 1 token to reach 10
    store.actions.discardToken('emerald');
    
    // Assert: Can now end turn
    expect(store.game.phase).toBe('playing');
    store.actions.endTurn();
    expect(store.game.currentPlayerIndex).toBe(1); // Turn advanced
  });
  
  it('allows turn end when player has exactly 10 tokens', () => {
    const store = useGameStore.getState();
    store.actions.initGame(2);
    
    const player = store.players[0];
    player.tokens = { emerald: 2, diamond: 2, sapphire: 2, onyx: 2, ruby: 2, gold: 0 };
    
    // Action: End turn with 10 tokens
    const result = store.actions.endTurn();
    
    // Assert: Turn ends successfully
    expect(result.success).toBe(true);
    expect(store.game.currentPlayerIndex).toBe(1);
  });
});
```

---

## Common Development Tasks

### Adding a New Card Action

1. **Write acceptance test** (from spec.md user story)
2. **Run test** (should fail - red phase)
3. **Implement action** in `src/store/gameStore.ts`
4. **Implement validation** in `src/services/RuleEngine.ts`
5. **Run test** (should pass - green phase)
6. **Refactor** if needed (keep tests green)
7. **Add integration test** for UI component
8. **Implement UI component** in `src/components/game/`
9. **Add E2E test** for complete user flow

### Debugging State Issues

```typescript
// Enable Redux DevTools
import { devtools } from 'zustand/middleware';

export const useGameStore = create<GameStore>()(
  devtools(
    immer((set, get) => ({
      // ... store definition ...
    })),
    { name: 'SplendorGame' } // DevTools will show "SplendorGame"
  )
);

// In browser:
// 1. Open Redux DevTools
// 2. View state tree
// 3. Time-travel through actions
// 4. Export/import state for bug reproduction
```

### Testing Card Purchase Logic

```typescript
// tests/unit/rules/card-purchase.test.ts
describe('FR-015: Card Purchase Cost Calculation', () => {
  it('subtracts bonuses from cost', () => {
    const cost = { emerald: 3, diamond: 2 };
    const bonuses = { emerald: 2, diamond: 1, sapphire: 0, onyx: 0, ruby: 0 };
    
    const required = RuleEngine.calculateRequiredTokens(cost, bonuses);
    
    expect(required).toEqual({ emerald: 1, diamond: 1 });
  });
  
  it('allows purchase with exact bonuses (no tokens needed)', () => {
    const cost = { emerald: 3 };
    const bonuses = { emerald: 3, diamond: 0, sapphire: 0, onyx: 0, ruby: 0 };
    
    const required = RuleEngine.calculateRequiredTokens(cost, bonuses);
    
    expect(required).toEqual({ emerald: 0 });
  });
  
  it('allows gold tokens as wild cards', () => {
    const cost = { emerald: 3, diamond: 2 };
    const bonuses = { emerald: 2, diamond: 0, sapphire: 0, onyx: 0, ruby: 0 };
    const tokens = { emerald: 0, diamond: 0, sapphire: 0, onyx: 0, ruby: 0, gold: 3 };
    
    const canAfford = RuleEngine.canAffordCard(cost, bonuses, tokens);
    
    expect(canAfford).toBe(true); // 1 emerald + 2 diamond needed, 3 gold available
  });
});
```

---

## Performance Testing

### Frame Rate Monitoring

```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  private frameTimesMs: number[] = [];
  private lastFrameTime: number = performance.now();
  
  measureFrame() {
    const now = performance.now();
    const deltaMs = now - this.lastFrameTime;
    this.frameTimesMs.push(deltaMs);
    this.lastFrameTime = now;
    
    // Keep last 60 frames
    if (this.frameTimesMs.length > 60) {
      this.frameTimesMs.shift();
    }
  }
  
  getAverageFPS(): number {
    const avgMs = this.frameTimesMs.reduce((a, b) => a + b, 0) / this.frameTimesMs.length;
    return 1000 / avgMs;
  }
  
  isBelow60FPS(): boolean {
    return this.getAverageFPS() < 60;
  }
}

// In development, log warnings if FPS drops
if (import.meta.env.DEV) {
  const monitor = new PerformanceMonitor();
  setInterval(() => {
    monitor.measureFrame();
    if (monitor.isBelow60FPS()) {
      console.warn(`FPS dropped to ${monitor.getAverageFPS().toFixed(1)}`);
    }
  }, 16); // Check every frame (60 FPS = ~16ms)
}
```

### Action Response Time Testing

```typescript
// tests/performance/action-timing.bench.ts
import { bench } from 'vitest';
import { useGameStore } from '@/store/gameStore';

bench('token taking action completes in <100ms', () => {
  const store = useGameStore.getState();
  store.actions.initGame(2);
  
  const start = performance.now();
  store.actions.takeThreeTokens(['emerald', 'diamond', 'sapphire']);
  const duration = performance.now() - start;
  
  expect(duration).toBeLessThan(100);
});

bench('card purchase action completes in <100ms', () => {
  const store = useGameStore.getState();
  store.actions.initGame(2);
  
  const card = store.cards.faceUp.level1[0];
  const start = performance.now();
  store.actions.purchaseCard(card);
  const duration = performance.now() - start;
  
  expect(duration).toBeLessThan(100);
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run contract tests
        run: npm run test:contract
      
      - name: Check code coverage
        run: npm run test:coverage
        # Fail if coverage < 80%
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Build production bundle
        run: npm run build
      
      - name: Check bundle size
        run: npm run analyze-bundle
        # Fail if bundle > 500KB
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests failing with "Cannot read property of undefined"
- **Cause**: Store not initialized properly
- **Fix**: Call `store.actions.initGame(playerCount)` in test setup

**Issue**: State not updating in components
- **Cause**: Not using Zustand selector correctly
- **Fix**: Use `useGameStore((state) => state.property)` not `useGameStore().property`

**Issue**: FPS drops below 60
- **Cause**: Too many re-renders or expensive calculations
- **Fix**: Use `React.memo()`, memoize selectors, check React DevTools Profiler

**Issue**: E2E tests flaky
- **Cause**: Race conditions with async state updates
- **Fix**: Use Playwright's `waitFor` and `expect.toBeVisible()` assertions

---

## Next Steps

1. **Complete initial setup** following instructions above
2. **Run existing tests** to verify environment
3. **Start with P1 user story** (Basic Game Play)
4. **Follow TDD workflow** for each feature
5. **Reference data-model.md** for entity structures
6. **Reference contracts/** for data schemas

See `tasks.md` (generated by `/speckit.tasks`) for detailed task breakdown.
