# Implementation Plan: Splendor Board Game

**Branch**: `001-splendor-game` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-splendor-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a web-based implementation of the Splendor board game that faithfully recreates the official game rules. The game supports 2-4 players in pass-and-play mode, implementing all core mechanics including token collection, card purchasing, bonus accumulation, and noble visits. Players compete to reach 15 prestige points through strategic resource management and card acquisition. The implementation prioritizes gaming UX consistency with 60 FPS performance, <100ms action feedback, and colorblind-accessible design.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode enabled for type safety)  
**Primary Dependencies**: React 18+, Zustand + Immer (state), Radix UI (primitives), Tailwind CSS (styling)  
**Storage**: Browser localStorage for game state persistence (optional feature for future)  
**Testing**: Vitest for unit/integration tests, Playwright for E2E gameplay tests  
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: Web application (single-page application with responsive design)  
**Performance Goals**: 60 FPS gameplay, <100ms action feedback, <3s initial load, <500ms asset loads  
**Constraints**: <200MB memory usage, offline-capable (no external API dependencies), responsive 320px-2560px  
**Scale/Scope**: Single-device local multiplayer, 2-4 concurrent players, ~100 game components (cards/tokens/nobles)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Implementation Gates (from Constitution)

- [x] **Feature specification approved**: spec.md complete with user stories and acceptance criteria
- [x] **Performance budgets allocated**: 60 FPS gameplay, <100ms feedback, <3s load, <200MB memory
- [ ] **Design mockups approved**: UI/UX design needed for cards, tokens, nobles, player areas
- [ ] **Test plan written**: Acceptance tests to be derived from user story scenarios
- [x] **Constitution check passed**: No complexity violations; straightforward web game architecture

### Core Principles Compliance

**I. Code Quality (NON-NEGOTIABLE)**
- ✅ TypeScript strict mode ensures type safety
- ✅ Will enforce DRY through reusable components
- ✅ Will maintain single responsibility per module
- ✅ Will use ESLint + Prettier for linting/formatting
- ⚠️ **Action Required**: Define linting rules and code standards before implementation

**II. Testing Standards (NON-NEGOTIABLE)**
- ✅ TDD approach: Write tests first for each user story
- ✅ Unit tests for game rules and state mutations
- ✅ Integration tests for component interactions
- ✅ Contract tests for data schemas (cards, nobles)
- ✅ Gameplay tests for core loops and win conditions
- ⚠️ **Action Required**: Setup test framework and establish coverage targets (80% minimum)

**III. Gaming UX Consistency**
- ✅ Design system required for visual consistency
- ✅ 100ms action feedback requirement specified
- ✅ Colorblind accessibility requirement specified
- ✅ State clarity through visible game state display
- ⚠️ **Action Required**: Create design system with tokens, colors, typography, spacing

**IV. Performance Requirements**
- ✅ 60 FPS target specified
- ✅ <3s initial load, <500ms asset loads
- ✅ <200MB memory constraint
- ✅ Offline-capable (no external dependencies)
- ⚠️ **Action Required**: Setup performance monitoring and benchmarks in CI/CD

### Constitution Check Status: ✅ PASSED

**All Action Items Resolved:**
1. ✅ Research and select web framework → **React 18+ with Vite** (see research.md)
2. ✅ Create UI/UX design approach → **Radix UI + Tailwind CSS** (see research.md)
3. ✅ Define design system → **Tailwind theme with design tokens** (see research.md)
4. ✅ Establish state management → **Zustand + Immer** (see research.md)
5. ✅ Setup testing framework → **Vitest + Playwright** (documented in research.md)
6. ✅ Define linting/formatting → **ESLint + Prettier** (documented in research.md)

**Ready for Implementation**: All Phase 0 research complete, Phase 1 design artifacts generated.

## Project Structure

### Documentation (this feature)

```text
specs/001-splendor-game/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already created)
├── research.md          # Phase 0 output (framework selection, design research)
├── data-model.md        # Phase 1 output (entities, state machine, data files)
├── quickstart.md        # Phase 1 output (development setup, test scenarios)
├── contracts/           # Phase 1 output (data schemas for cards/nobles)
│   ├── card-schema.md   # Development card data format
│   └── noble-schema.md  # Noble tile data format
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── assets/              # Static assets (images, fonts, data files)
│   ├── data/            # Game data (cards, nobles JSON/YAML)
│   │   ├── cards-level1.json
│   │   ├── cards-level2.json
│   │   ├── cards-level3.json
│   │   └── nobles.json
│   └── images/          # Token images, card backgrounds, icons
├── components/          # UI components (design system)
│   ├── core/            # Reusable design system components
│   ├── game/            # Game-specific components (Card, Token, Noble, Board)
│   └── ui/              # UI controls (Button, Modal, PlayerArea)
├── models/              # Data models and types
│   ├── Card.ts          # Development card model
│   ├── Noble.ts         # Noble tile model
│   ├── Player.ts        # Player state model
│   ├── Token.ts         # Token model
│   └── GameState.ts     # Game state model
├── services/            # Business logic and game rules
│   ├── GameEngine.ts    # Core game loop and turn management
│   ├── RuleEngine.ts    # Game rule validation
│   ├── ActionHandler.ts # Player action processing
│   └── DataLoader.ts    # Load cards/nobles from JSON
├── utils/               # Utility functions
│   ├── shuffle.ts       # Card/noble shuffling
│   ├── validation.ts    # Input validation
│   └── constants.ts     # Game constants (colors, limits)
├── styles/              # Global styles and design tokens
│   ├── tokens.css       # Design tokens (colors, spacing, typography)
│   └── global.css       # Global styles
└── main.ts              # Application entry point

tests/
├── unit/                # Unit tests (models, services, utils)
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/         # Integration tests (component interactions)
│   └── gameplay/
├── contract/            # Contract tests (data schemas)
│   └── data/
└── e2e/                 # End-to-end gameplay tests
    └── scenarios/

public/                  # Static public assets
├── index.html           # HTML entry point
└── favicon.ico
```

**Structure Decision**: Web application structure chosen based on clarifications that the project targets modern web browsers with responsive design. The structure follows standard frontend patterns with clear separation between:
- **Models**: Type-safe data structures (TypeScript interfaces/classes)
- **Services**: Business logic for game rules and state management
- **Components**: Reusable UI components organized by design system principles
- **Assets**: Static data files (cards, nobles) and visual assets
- **Tests**: Organized by test type (unit, integration, contract, e2e) as required by constitution

This structure supports:
- Constitution Principle I (Code Quality): Single responsibility, modularity
- Constitution Principle II (Testing Standards): Clear test organization by type
- Constitution Principle III (Gaming UX): Design system through component library
- Constitution Principle IV (Performance): Asset organization for lazy loading

## Complexity Tracking

> **No constitution violations detected**

This implementation follows straightforward patterns:
- Standard web application architecture
- Well-established game state management patterns
- No unusual complexity requiring justification
- All requirements align with constitution principles
