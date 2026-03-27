# Card Data Schema

**Feature**: 001-splendor-game  
**Date**: 2026-03-19  
**Purpose**: Define development card data format and generation rules

---

## JSON Schema

### File Format

Three separate JSON files for each card level:
- `src/assets/data/cards-level1.json` (40 cards)
- `src/assets/data/cards-level2.json` (30 cards)
- `src/assets/data/cards-level3.json` (20 cards)

### Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["level", "cards"],
  "properties": {
    "level": {
      "type": "integer",
      "enum": [1, 2, 3],
      "description": "Card tier level"
    },
    "cards": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/DevelopmentCard"
      },
      "minItems": 1
    }
  },
  "definitions": {
    "DevelopmentCard": {
      "type": "object",
      "required": ["id", "cost", "prestige", "bonus"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^L[1-3]-\\d{3}$",
          "description": "Unique card identifier (e.g., L1-001)"
        },
        "cost": {
          "type": "object",
          "properties": {
            "emerald": { "type": "integer", "minimum": 0, "maximum": 7 },
            "diamond": { "type": "integer", "minimum": 0, "maximum": 7 },
            "sapphire": { "type": "integer", "minimum": 0, "maximum": 7 },
            "onyx": { "type": "integer", "minimum": 0, "maximum": 7 },
            "ruby": { "type": "integer", "minimum": 0, "maximum": 7 }
          },
          "additionalProperties": false,
          "description": "Token cost by gem color (0-7 per color)"
        },
        "prestige": {
          "type": "integer",
          "minimum": 0,
          "maximum": 5,
          "description": "Prestige points awarded (0-5)"
        },
        "bonus": {
          "type": "string",
          "enum": ["emerald", "diamond", "sapphire", "onyx", "ruby"],
          "description": "Permanent bonus gem color (no gold)"
        }
      },
      "additionalProperties": false
    }
  }
}
```

---

## Data Generation Rules

### Level 1 Cards (40 cards)

**Characteristics:**
- **Cost**: 0-4 gems total, simple costs (1-3 colors)
- **Prestige**: 0-1 points (mostly 0, some 1)
- **Bonus Distribution**: Equal across 5 colors (8 cards per bonus color)

**Example Cards:**

```json
{
  "level": 1,
  "cards": [
    { "id": "L1-001", "cost": { "diamond": 3 }, "prestige": 0, "bonus": "emerald" },
    { "id": "L1-002", "cost": { "emerald": 1, "sapphire": 1, "onyx": 1, "ruby": 1 }, "prestige": 0, "bonus": "diamond" },
    { "id": "L1-003", "cost": { "emerald": 2, "sapphire": 2, "ruby": 1 }, "prestige": 0, "bonus": "sapphire" },
    { "id": "L1-004", "cost": { "emerald": 3, "diamond": 1, "onyx": 1 }, "prestige": 0, "bonus": "onyx" },
    { "id": "L1-005", "cost": { "onyx": 2, "ruby": 2 }, "prestige": 0, "bonus": "ruby" },
    { "id": "L1-006", "cost": { "diamond": 1, "sapphire": 2, "onyx": 2 }, "prestige": 1, "bonus": "emerald" },
    { "id": "L1-007", "cost": { "emerald": 2, "onyx": 3 }, "prestige": 1, "bonus": "diamond" },
    { "id": "L1-008", "cost": { "diamond": 2, "emerald": 2 }, "prestige": 1, "bonus": "sapphire" }
  ]
}
```

**Generation Pattern:**
- Start with simplest costs (single color, 3-4 gems)
- Progress to multi-color costs (2-3 colors, 4-5 gems total)
- Distribute prestige: ~28 cards with 0 prestige, ~12 cards with 1 prestige
- Ensure 8 cards grant each bonus color

### Level 2 Cards (30 cards)

**Characteristics:**
- **Cost**: 5-7 gems total, moderate complexity (2-3 colors)
- **Prestige**: 1-3 points (mostly 2, some 1 or 3)
- **Bonus Distribution**: Equal across 5 colors (6 cards per bonus color)

**Example Cards:**

```json
{
  "level": 2,
  "cards": [
    { "id": "L2-001", "cost": { "diamond": 3, "sapphire": 2, "onyx": 2 }, "prestige": 1, "bonus": "emerald" },
    { "id": "L2-002", "cost": { "emerald": 3, "diamond": 2, "sapphire": 3 }, "prestige": 1, "bonus": "diamond" },
    { "id": "L2-003", "cost": { "emerald": 5, "sapphire": 3 }, "prestige": 2, "bonus": "sapphire" },
    { "id": "L2-004", "cost": { "diamond": 6 }, "prestige": 3, "bonus": "onyx" },
    { "id": "L2-005", "cost": { "emerald": 2, "diamond": 1, "ruby": 4 }, "prestige": 2, "bonus": "ruby" },
    { "id": "L2-006", "cost": { "diamond": 5 }, "prestige": 2, "bonus": "emerald" }
  ]
}
```

**Generation Pattern:**
- Increase total cost to 5-7 gems
- Some cards with 6-7 gems of single color (high prestige)
- Distribute prestige: ~5 cards with 1, ~20 cards with 2, ~5 cards with 3
- Ensure 6 cards grant each bonus color

### Level 3 Cards (20 cards)

**Characteristics:**
- **Cost**: 7+ gems total, complex costs (3-4 colors)
- **Prestige**: 3-5 points (mostly 4-5, some 3)
- **Bonus Distribution**: Equal across 5 colors (4 cards per bonus color)

**Example Cards:**

```json
{
  "level": 3,
  "cards": [
    { "id": "L3-001", "cost": { "diamond": 3, "sapphire": 3, "onyx": 5, "ruby": 3 }, "prestige": 3, "bonus": "emerald" },
    { "id": "L3-002", "cost": { "emerald": 3, "diamond": 6, "sapphire": 3, "onyx": 3 }, "prestige": 4, "bonus": "diamond" },
    { "id": "L3-003", "cost": { "diamond": 7, "emerald": 3 }, "prestige": 4, "bonus": "sapphire" },
    { "id": "L3-004", "cost": { "emerald": 7 }, "prestige": 5, "bonus": "onyx" },
    { "id": "L3-005", "cost": { "sapphire": 7 }, "prestige": 5, "bonus": "ruby" }
  ]
}
```

**Generation Pattern:**
- Minimum 7 gems total cost
- Some cards require 7 gems of single color (5 prestige, very expensive)
- Multi-color cards spread across 3-4 colors
- Distribute prestige: ~4 cards with 3, ~8 cards with 4, ~8 cards with 5
- Ensure 4 cards grant each bonus color

---

## TypeScript Interface

```typescript
// src/models/Card.ts
export enum GemColor {
  EMERALD = 'emerald',
  DIAMOND = 'diamond',
  SAPPHIRE = 'sapphire',
  ONYX = 'onyx',
  RUBY = 'ruby',
  GOLD = 'gold'
}

export type CardBonus = Exclude<GemColor, 'gold'>;

export interface CardCost {
  emerald?: number;
  diamond?: number;
  sapphire?: number;
  onyx?: number;
  ruby?: number;
}

export interface DevelopmentCard {
  id: string;
  level: 1 | 2 | 3;
  cost: CardCost;
  prestige: number;
  bonus: CardBonus;
}

export interface CardDataFile {
  level: 1 | 2 | 3;
  cards: DevelopmentCard[];
}
```

---

## Validation Rules

### Card ID Format
- Pattern: `L[1-3]-\d{3}`
- Examples: `L1-001`, `L2-015`, `L3-020`
- Must be unique across all cards

### Cost Constraints
- Each color: 0-7 gems
- Total cost: At least 1 gem (cannot be free)
- Level 1: 0-4 gems total (typical)
- Level 2: 5-7 gems total (typical)
- Level 3: 7+ gems total (typical)

### Prestige Constraints
- Range: 0-5 points
- Level 1: 0-1 points (mostly 0)
- Level 2: 1-3 points (mostly 2)
- Level 3: 3-5 points (mostly 4-5)

### Bonus Distribution
- Must be one of: emerald, diamond, sapphire, onyx, ruby
- Cannot be gold (gold is only for tokens, not bonuses)
- Each level should have approximately equal distribution across 5 colors

---

## Data Loader Implementation

```typescript
// src/services/DataLoader.ts
import cardsLevel1Data from '@/assets/data/cards-level1.json';
import cardsLevel2Data from '@/assets/data/cards-level2.json';
import cardsLevel3Data from '@/assets/data/cards-level3.json';

export class DataLoader {
  static loadCards(): DevelopmentCard[] {
    const level1 = (cardsLevel1Data as CardDataFile).cards;
    const level2 = (cardsLevel2Data as CardDataFile).cards;
    const level3 = (cardsLevel3Data as CardDataFile).cards;
    
    return [...level1, ...level2, ...level3];
  }
  
  static loadCardsByLevel(level: 1 | 2 | 3): DevelopmentCard[] {
    switch (level) {
      case 1: return (cardsLevel1Data as CardDataFile).cards;
      case 2: return (cardsLevel2Data as CardDataFile).cards;
      case 3: return (cardsLevel3Data as CardDataFile).cards;
    }
  }
  
  static validateCardData(data: CardDataFile): boolean {
    // Validate against JSON schema
    // Check ID uniqueness
    // Verify bonus distribution
    // Validate cost/prestige ranges
    return true; // Implementation in actual code
  }
}
```

---

## Testing

### Unit Tests

```typescript
// tests/unit/data/cards.test.ts
import { describe, it, expect } from 'vitest';
import { DataLoader } from '@/services/DataLoader';

describe('Card Data', () => {
  it('should load all 90 cards', () => {
    const cards = DataLoader.loadCards();
    expect(cards).toHaveLength(90);
  });
  
  it('should have 40 level 1 cards', () => {
    const level1 = DataLoader.loadCardsByLevel(1);
    expect(level1).toHaveLength(40);
  });
  
  it('should have unique card IDs', () => {
    const cards = DataLoader.loadCards();
    const ids = cards.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(cards.length);
  });
  
  it('should have valid prestige ranges per level', () => {
    const level1 = DataLoader.loadCardsByLevel(1);
    level1.forEach(card => {
      expect(card.prestige).toBeGreaterThanOrEqual(0);
      expect(card.prestige).toBeLessThanOrEqual(1);
    });
  });
  
  it('should have equal bonus distribution', () => {
    const level1 = DataLoader.loadCardsByLevel(1);
    const bonusCounts = level1.reduce((acc, card) => {
      acc[card.bonus] = (acc[card.bonus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    expect(bonusCounts.emerald).toBe(8);
    expect(bonusCounts.diamond).toBe(8);
    expect(bonusCounts.sapphire).toBe(8);
    expect(bonusCounts.onyx).toBe(8);
    expect(bonusCounts.ruby).toBe(8);
  });
});
```

### Contract Tests

```typescript
// tests/contract/card-schema.test.ts
import Ajv from 'ajv';
import cardSchema from '@/contracts/card-schema.json';
import cardsLevel1 from '@/assets/data/cards-level1.json';
import cardsLevel2 from '@/assets/data/cards-level2.json';
import cardsLevel3 from '@/assets/data/cards-level3.json';

describe('Card Data Schema Compliance', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(cardSchema);
  
  it('level 1 cards should match schema', () => {
    const valid = validate(cardsLevel1);
    expect(valid).toBe(true);
  });
  
  it('level 2 cards should match schema', () => {
    const valid = validate(cardsLevel2);
    expect(valid).toBe(true);
  });
  
  it('level 3 cards should match schema', () => {
    const valid = validate(cardsLevel3);
    expect(valid).toBe(true);
  });
});
```

---

## Next Steps

1. **Generate card data files** based on official Splendor card distributions
2. **Validate against schema** using Ajv or similar JSON schema validator
3. **Create unit tests** for data loader and validation logic
4. **Create contract tests** to ensure data format compliance
5. **Document card generation script** for future updates or expansions

See `noble-schema.md` for noble tile data format.
