# Research: Splendor Board Game Implementation

**Feature**: 001-splendor-game  
**Date**: 2026-03-19  
**Purpose**: Resolve technical unknowns and establish implementation approach

## Research Questions

From Technical Context, the following areas required research:
1. Web framework selection (React/Vue/Svelte/vanilla)
2. State management pattern for complex game state
3. Design system and UI component library approach

---

## Decision 1: Web Framework

### Selected: React 18+ with Vite

**Rationale:**
- **Performance**: Meets all targets (60 FPS, <100ms feedback, <200MB memory)
  - React 18 concurrent features handle game state transitions efficiently
  - Bundle size ~50-80KB (gzipped) with tree-shaking
  - Virtual DOM optimized for predictable board game updates
- **TypeScript Support**: First-class TypeScript 5.3+ support with excellent type inference
- **State Management Ecosystem**: Proven solutions (Zustand) for complex game state
- **Component Architecture**: Natural mapping to game entities (Card, Token, Noble, PlayerArea)
- **Design System Maturity**: Best-in-class component library ecosystem
- **Testing Ecosystem**: Vitest + React Testing Library + Playwright for comprehensive testing
- **Developer Experience**: Largest community, extensive documentation, instant HMR with Vite
- **Offline Capability**: Service Worker integration via Vite PWA plugin

**Alternatives Considered:**

**Vue 3 + Pinia:**
- Pros: Smaller bundle (~40-60KB), excellent TS support, clean Composition API
- Cons: Smaller ecosystem, fewer design system options, less common
- Rejected: React's ecosystem advantages outweigh marginal bundle size benefits

**Svelte/SvelteKit:**
- Pros: Smallest bundle (20-30KB), excellent performance, clean syntax
- Cons: Immature design system ecosystem, would require building UI from scratch
- Rejected: Design system requirement is critical; can't justify build time

**Vanilla TypeScript:**
- Pros: Maximum performance control, zero framework overhead
- Cons: Must build component architecture, reactivity, state management from scratch
- Rejected: Development cost too high for 36 functional requirements

---

## Decision 2: State Management Pattern

### Selected: Immutable State with Zustand + Immer

**Rationale:**
- **Complex Rule Validation**: Immer enables "mutating" draft state for validation while maintaining immutability
- **Performance**: 
  - 3KB bundle size (vs Redux 60KB)
  - Fine-grained subscriptions prevent unnecessary re-renders
  - Zero Provider overhead
  - Achieves <100ms action feedback requirement
- **Debugging**: Redux DevTools support for time-travel debugging
- **Testability**: Pure functions, no framework coupling, easy mocking
- **Implementation Simplicity**: 50% less boilerplate than Redux, 30-minute learning curve
- **Future-Proof**: Immer patches enable undo/replay when needed

**Architecture Approach:**

```typescript
interface GameStore {
  // State slices
  game: { phase, currentPlayerIndex, round, winner }
  tokens: { emerald, diamond, sapphire, onyx, ruby, gold }
  cards: { faceUp: {level1, level2, level3}, decks: {...} }
  nobles: Noble[]
  players: PlayerState[]
  
  // Actions (mutations with Immer)
  actions: {
    takeTokens, reserveCard, purchaseCard, endTurn
  }
  
  // Selectors (derived state)
  selectors: {
    getCurrentPlayer, canAffordCard, getEligibleNobles
  }
}
```

**Alternatives Considered:**

**MobX (Mutable State with Observers):**
- Pros: Fine-grained reactivity, computed values, class-based approach
- Cons: Observable creation overhead (100ms for 90 cards), larger bundle (19.7KB), harder to serialize
- Rejected: Performance penalty at game initialization is unacceptable

**Event Sourcing:**
- Pros: Perfect for undo/replay, complete audit trail, time-travel debugging
- Cons: Over-engineered for current needs, increased complexity, memory overhead
- Rejected: YAGNI - implement when undo/replay is actually required

**Finite State Machine (XState):**
- Pros: Prevents invalid transitions, visual state charts, strong TypeScript
- Cons: Not a natural fit (complexity is in data, not state transitions), overkill for simple turn rotation
- Rejected: Splendor's challenge is data transformation, not state machine complexity

---

## Decision 3: Design System Approach

### Selected: Radix UI Primitives + Tailwind CSS + Custom Game Components

**Rationale:**
- **Speed + Customization Balance**:
  - Radix handles accessibility patterns (keyboard nav, focus, ARIA) automatically
  - Tailwind enables rapid prototyping with utility classes
  - Complete visual control for unique board game aesthetics
- **Performance**: 
  - Radix lightweight (~30KB), Tailwind purges unused CSS (<10KB)
  - No runtime style computation overhead
  - Meets 60 FPS with ~100 simultaneous game components
- **Accessibility**:
  - Radix follows WAI-ARIA patterns out-of-the-box
  - Full control over colorblind mode implementation
  - Built-in keyboard navigation support
- **Design Token Management**: Tailwind theme provides centralized token system
- **Responsive Design**: Tailwind's responsive utilities are industry-leading (320px-2560px)

**Component Architecture:**

```
src/components/
├── design-system/     # Radix wrappers (Button, Modal, Tooltip)
├── game/              # Game components (Card, Token, Noble, Player)
└── board/             # Layout components (GameBoard, CardMarket, NobleMarket)
```

**Design Token Structure (Tailwind Config):**

```javascript
theme: {
  colors: {
    gem: { emerald, diamond, sapphire, onyx, ruby, gold }
    ui: { background, surface, border, text, ... }
    player: { 1, 2, 3, 4 }
  },
  spacing: { 'token', 'card-sm', 'card-md', 'card-lg', 'board-gap' },
  fontSize: { 'prestige', 'bonus', 'cost' },
  fontFamily: { 'game': 'Inter', 'display': 'Cinzel' }
}
```

**Colorblind Accessibility Strategy:**

1. **Multi-pronged approach**:
   - Color alternatives via CSS data attributes
   - Redundant encoding (patterns + shapes for each gem)
   - Text labels always visible
   - Settings panel for mode selection (none, protanopia, deuteranopia, tritanopia)

2. **Pattern encoding**:
   ```
   Emerald: ●●● (dots)
   Diamond: ◇◇◇ (diamonds)
   Sapphire: ▲▲▲ (triangles)
   Onyx: ■■■ (squares)
   Ruby: ★★★ (stars)
   Gold: ✦✦✦ (special stars)
   ```

3. **Implementation**: Zustand store for mode persistence, CSS classes for color swapping

**Alternatives Considered:**

**Material UI / Chakra UI:**
- Pros: Fastest setup, comprehensive components, built-in accessibility
- Cons: Visual constraints clash with board game aesthetics, heavy bundle (350KB+), runtime CSS-in-JS impacts performance
- Rejected: Wrong aesthetic fit, bundle size concerns

**shadcn/ui:**
- Pros: Pre-built Radix + Tailwind components, accessible, copy-paste ownership
- Cons: Designed for SaaS apps not board games, still need custom game components
- Rejected: Minimal benefit over Radix + Tailwind directly (may use selectively)

**Canvas/WebGL:**
- Pros: Maximum performance potential, fine-grained rendering
- Cons: Accessibility nightmare (screen readers), colorblind modes harder, responsive complex, overkill for ~100 components
- Rejected: DOM easily handles Splendor's scale at 60 FPS, violates accessibility requirements

---

## Technical Stack Summary

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Language** | TypeScript 5.3+ | Type safety, constitution requirement |
| **Framework** | React 18+ | Best ecosystem, proven performance |
| **Build Tool** | Vite 5+ | Fastest dev experience, optimized builds |
| **State Management** | Zustand + Immer | Simple, performant, testable |
| **UI Primitives** | Radix UI | Accessibility patterns, headless |
| **Styling** | Tailwind CSS | Design tokens, responsive utilities |
| **Testing** | Vitest + React Testing Library | Fast, Jest-compatible, comprehensive |
| **E2E Testing** | Playwright | Cross-browser, reliable, TypeScript support |
| **Data Format** | JSON | Card/noble data files |

---

## Build Configuration Recommendations

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'game-engine': ['./src/store/gameStore.ts'],
          'ui-components': ['./src/components']
        }
      }
    }
  }
})
```

### Tailwind Configuration

See design token structure above for full theme configuration.

### Testing Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
})
```

---

## Performance Optimization Strategy

### Meets 60 FPS Requirement

**Rendering Budget Analysis:**
- 60 FPS = 16.67ms frame budget
- ~100 DOM nodes (40 cards visible, 42 tokens max, 10 nobles, 8 player areas)
- Modern browsers handle 1000+ nodes within budget
- Tailwind has zero runtime cost (pre-generated CSS)

**Optimization Techniques:**

1. **Memoization**: `React.memo()` for game components (only re-render on prop changes)
2. **CSS Animations**: Hardware-accelerated transforms (GPU, not main thread)
3. **Event Delegation**: Single board handler, not per-component listeners
4. **Code Splitting**: Lazy load non-critical UI (settings, help screens)

**Performance Benchmarks:**

```typescript
// Target: <16ms render time for full game board
bench('render full game board', () => {
  render(<GameBoard cards={12} tokens={42} nobles={5} players={4} />)
})
```

---

## Constitution Compliance

### Code Quality (Principle I)
- ✅ TypeScript strict mode enforces type safety
- ✅ Component-based architecture ensures modularity
- ✅ ESLint + Prettier for linting/formatting
- ✅ Single responsibility per component/service

### Testing Standards (Principle II)
- ✅ Vitest for unit tests (game rules, state mutations)
- ✅ React Testing Library for integration tests (component interactions)
- ✅ Playwright for E2E tests (gameplay scenarios)
- ✅ TDD workflow: tests first, then implementation

### Gaming UX Consistency (Principle III)
- ✅ Design system via Tailwind design tokens
- ✅ Centralized component library
- ✅ Colorblind accessibility with pattern encoding
- ✅ <100ms feedback via React performance optimizations

### Performance Requirements (Principle IV)
- ✅ 60 FPS target achievable with React + DOM rendering
- ✅ <3s initial load via code splitting and Vite optimization
- ✅ <200MB memory budget (React baseline 30-70MB)
- ✅ Offline-capable via PWA service workers

---

## Next Steps (Phase 1)

1. **Setup project**: Initialize Vite + React + TypeScript + Tailwind
2. **Configure tooling**: ESLint, Prettier, Vitest, Playwright
3. **Create design system**: Tailwind theme, design tokens, base components
4. **Generate game data**: Create JSON files for cards and nobles (see contracts/)
5. **Implement state store**: Zustand store with game state slices
6. **Build core components**: Card, Token, Noble components with accessibility
7. **Setup testing framework**: Test utilities, mocks, coverage targets

See `data-model.md` for entity definitions and `contracts/` for data schemas.
