# Splendor - Renaissance Card Game

A faithful web-based implementation of the classic Splendor board game. Built with React, TypeScript, and Zustand following Test-Driven Development practices.

## Features

- **Complete Game Implementation**: All official Splendor rules including:
  - Token collection (3 different or 2 same)
  - Card purchasing with bonus discounts
  - Noble visits (automatic when requirements met)
  - Card reservations with gold tokens
  - 2-4 player support with correct balancing

- **Modern Tech Stack**:
  - React 18+ with TypeScript 5.3+ (strict mode)
  - Zustand + Immer for immutable state management
  - Radix UI primitives for accessibility
  - Tailwind CSS for styling
  - Vitest + Playwright for testing

- **Accessibility**:
  - Colorblind mode support
  - Keyboard navigation
  - ARIA labels and screen reader support
  - Responsive design (320px - 2560px)

- **Performance**:
  - 60 FPS gameplay
  - <3s initial load time
  - <100ms action feedback
  - PWA support for offline play

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

### Development Server

The app will be available at `http://localhost:3000` (or next available port).

### Analytics Environment Variables

To enable PostHog analytics:

```bash
VITE_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_your_project_key
# Optional (defaults to https://us.i.posthog.com)
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Without `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, analytics stays disabled.

## How to Play

### Goal

Be the first player to reach 15 prestige points.

### Actions (choose one per turn)

1. **Take 3 different gem tokens**
2. **Take 2 tokens of the same color** (requires 4+ in supply)
3. **Reserve a card** and take 1 gold token
4. **Purchase a card** using tokens (bonuses reduce cost)

### Cards & Bonuses

- Each card provides a permanent bonus that reduces future purchase costs
- Cards award prestige points

### Nobles

- Nobles visit automatically when you have enough bonuses
- Each noble awards 3 prestige points

### Limits

- Maximum 10 tokens per player
- Maximum 3 reserved cards per player

## Project Structure

```md
src/
├── assets/data/        # Game data (cards, nobles)
├── components/         # React components
│   ├── board/          # Board layout components
│   ├── design-system/  # Reusable UI components
│   ├── game/           # Game-specific components
│   └── ui/             # UI controls
├── models/             # TypeScript interfaces
├── services/           # Business logic
├── store/              # Zustand state management
├── styles/             # CSS and design tokens
├── hooks/              # Custom React hooks
└── utils/              # Utility functions

tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
├── contract/           # Data schema tests
└── e2e/                # End-to-end tests
```

## Development

### Testing

Tests follow TDD approach with acceptance criteria from user stories:

```bash
# Run unit + integration tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

### Code Quality

- TypeScript strict mode enabled
- ESLint + Prettier configured
- 80% code coverage target

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

## Game Data

Card and noble data is located in `src/assets/data/`:

- `cards-level1.json` - 40 level 1 cards
- `cards-level2.json` - 30 level 2 cards
- `cards-level3.json` - 20 level 3 cards
- `nobles.json` - 10 noble tiles

Data follows official Splendor distributions and is validated against JSON schemas in `specs/001-splendor-game/contracts/`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This is an educational implementation of Splendor for demonstration purposes.

## Acknowledgments

Splendor is a board game designed by Marc André and published by Space Cowboys / Asmodee.
