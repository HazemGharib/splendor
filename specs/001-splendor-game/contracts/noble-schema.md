# Noble Data Schema

**Feature**: 001-splendor-game  
**Date**: 2026-03-19  
**Purpose**: Define noble tile data format and generation rules

---

## JSON Schema

### File Format

Single JSON file for all nobles:
- `src/assets/data/nobles.json` (10 nobles total)

### Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["nobles"],
  "properties": {
    "nobles": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Noble"
      },
      "minItems": 10,
      "maxItems": 10
    }
  },
  "definitions": {
    "Noble": {
      "type": "object",
      "required": ["id", "name", "requirements", "prestige"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^N-\\d{3}$",
          "description": "Unique noble identifier (e.g., N-001)"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "description": "Noble's display name"
        },
        "requirements": {
          "type": "object",
          "properties": {
            "emerald": { "type": "integer", "minimum": 0, "maximum": 5 },
            "diamond": { "type": "integer", "minimum": 0, "maximum": 5 },
            "sapphire": { "type": "integer", "minimum": 0, "maximum": 5 },
            "onyx": { "type": "integer", "minimum": 0, "maximum": 5 },
            "ruby": { "type": "integer", "minimum": 0, "maximum": 5 }
          },
          "additionalProperties": false,
          "description": "Bonus requirements by gem color (0-5 per color)"
        },
        "prestige": {
          "type": "integer",
          "const": 3,
          "description": "Always 3 prestige points"
        }
      },
      "additionalProperties": false
    }
  }
}
```

---

## Data Generation Rules

### Noble Characteristics

**Fixed Properties:**
- **Prestige**: Always 3 points (per official game rules)
- **Total**: Exactly 10 nobles in the game
- **Usage**: 5 nobles for 4 players, 4 nobles for 3 players, 3 nobles for 2 players

**Requirement Patterns:**
- Require bonuses from 2-3 different colors
- Total bonuses required: 7-10 across all colors
- Typical patterns:
  - **Type A**: 3 bonuses each in 3 colors (3+3+3 = 9 total)
  - **Type B**: 4 bonuses each in 2 colors, 3 in third color (4+4+3 = 11 total)
  - **Type C**: 4 bonuses each in 2 colors (4+4 = 8 total)

### Example Noble Data

```json
{
  "nobles": [
    {
      "id": "N-001",
      "name": "Mary Stuart",
      "requirements": {
        "emerald": 3,
        "diamond": 3,
        "sapphire": 3
      },
      "prestige": 3
    },
    {
      "id": "N-002",
      "name": "Charles V",
      "requirements": {
        "emerald": 4,
        "onyx": 4
      },
      "prestige": 3
    },
    {
      "id": "N-003",
      "name": "Francis I",
      "requirements": {
        "diamond": 4,
        "sapphire": 4
      },
      "prestige": 3
    },
    {
      "id": "N-004",
      "name": "Isabella of Castile",
      "requirements": {
        "onyx": 4,
        "ruby": 4
      },
      "prestige": 3
    },
    {
      "id": "N-005",
      "name": "Anne of Brittany",
      "requirements": {
        "emerald": 3,
        "diamond": 3,
        "ruby": 3
      },
      "prestige": 3
    },
    {
      "id": "N-006",
      "name": "Suleiman the Magnificent",
      "requirements": {
        "diamond": 3,
        "sapphire": 3,
        "onyx": 3
      },
      "prestige": 3
    },
    {
      "id": "N-007",
      "name": "Catherine de Medici",
      "requirements": {
        "sapphire": 3,
        "onyx": 3,
        "ruby": 3
      },
      "prestige": 3
    },
    {
      "id": "N-008",
      "name": "Henry VIII",
      "requirements": {
        "emerald": 4,
        "ruby": 4
      },
      "prestige": 3
    },
    {
      "id": "N-009",
      "name": "Elisabeth of Austria",
      "requirements": {
        "emerald": 3,
        "diamond": 3,
        "onyx": 3
      },
      "prestige": 3
    },
    {
      "id": "N-010",
      "name": "Cosimo de Medici",
      "requirements": {
        "sapphire": 4,
        "ruby": 4
      },
      "prestige": 3
    }
  ]
}
```

---

## Design Patterns

### Two-Color Nobles (5 nobles)
Each combination of two colors has one noble requiring 4+4 bonuses:

| Noble ID | Name | Requirements |
|----------|------|--------------|
| N-002 | Charles V | 4 Emerald, 4 Onyx |
| N-003 | Francis I | 4 Diamond, 4 Sapphire |
| N-004 | Isabella of Castile | 4 Onyx, 4 Ruby |
| N-008 | Henry VIII | 4 Emerald, 4 Ruby |
| N-010 | Cosimo de Medici | 4 Sapphire, 4 Ruby |

**Pattern**: Each noble requires exactly 8 bonuses split evenly across 2 colors.

### Three-Color Nobles (5 nobles)
Various combinations requiring 3 bonuses each in 3 colors (9 total):

| Noble ID | Name | Requirements |
|----------|------|--------------|
| N-001 | Mary Stuart | 3 Emerald, 3 Diamond, 3 Sapphire |
| N-005 | Anne of Brittany | 3 Emerald, 3 Diamond, 3 Ruby |
| N-006 | Suleiman the Magnificent | 3 Diamond, 3 Sapphire, 3 Onyx |
| N-007 | Catherine de Medici | 3 Sapphire, 3 Onyx, 3 Ruby |
| N-009 | Elisabeth of Austria | 3 Emerald, 3 Diamond, 3 Onyx |

**Pattern**: Each noble requires exactly 9 bonuses split evenly across 3 colors.

**Coverage**: Every combination of 3 colors from 5 is represented exactly once (5C3 = 10 combinations, 5 used).

---

## TypeScript Interface

```typescript
// src/models/Noble.ts
import { GemColor } from './Card';

export type NobleBonus = Exclude<GemColor, 'gold'>;

export interface NobleRequirements {
  emerald?: number;
  diamond?: number;
  sapphire?: number;
  onyx?: number;
  ruby?: number;
}

export interface Noble {
  id: string;
  name: string;
  requirements: NobleRequirements;
  prestige: 3; // Always 3
}

export interface NobleDataFile {
  nobles: Noble[];
}
```

---

## Validation Rules

### Noble ID Format
- Pattern: `N-\d{3}`
- Examples: `N-001`, `N-005`, `N-010`
- Must be unique across all nobles

### Name Constraints
- Non-empty string
- Typically historical Renaissance figures
- Used for flavor/theming only (not gameplay-critical)

### Requirements Constraints
- Each color: 0-5 bonuses (typically 3 or 4)
- Must require at least 2 different bonus colors
- Total bonuses: 7-10 (typical: 8-9)
- Cannot require gold bonuses (gold is token-only)

### Prestige Constraints
- Must always be exactly 3 (per official game rules)
- No variation allowed

---

## Data Loader Implementation

```typescript
// src/services/DataLoader.ts
import noblesData from '@/assets/data/nobles.json';

export class DataLoader {
  static loadNobles(): Noble[] {
    return (noblesData as NobleDataFile).nobles;
  }
  
  static shuffleNobles(nobles: Noble[]): Noble[] {
    // Fisher-Yates shuffle
    const shuffled = [...nobles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  static selectNobles(playerCount: 2 | 3 | 4): Noble[] {
    const allNobles = DataLoader.loadNobles();
    const shuffled = DataLoader.shuffleNobles(allNobles);
    const count = playerCount + 1; // 2 players → 3 nobles, etc.
    return shuffled.slice(0, count);
  }
  
  static validateNobleData(data: NobleDataFile): boolean {
    // Validate against JSON schema
    // Check ID uniqueness
    // Verify prestige === 3 for all
    // Validate requirements ranges
    return true; // Implementation in actual code
  }
}
```

---

## Game Logic: Noble Visit Check

```typescript
// src/services/RuleEngine.ts
import { Noble, NobleRequirements } from '@/models/Noble';
import { PlayerState } from '@/models/Player';

export class RuleEngine {
  /**
   * Check if player qualifies for a noble based on their bonuses.
   * 
   * @param player - Player state with accumulated bonuses
   * @param noble - Noble tile to check
   * @returns true if player meets all requirements
   */
  static checkNobleVisit(player: PlayerState, noble: Noble): boolean {
    const { requirements } = noble;
    const { bonuses } = player;
    
    return Object.entries(requirements).every(([color, required]) => {
      if (!required) return true; // Requirement not specified
      const bonus = bonuses[color as keyof typeof bonuses] || 0;
      return bonus >= required;
    });
  }
  
  /**
   * Get all nobles the player currently qualifies for.
   * 
   * @param player - Player state
   * @param availableNobles - Nobles not yet claimed
   * @returns Array of nobles player qualifies for
   */
  static getEligibleNobles(
    player: PlayerState, 
    availableNobles: Noble[]
  ): Noble[] {
    return availableNobles.filter(noble => 
      RuleEngine.checkNobleVisit(player, noble)
    );
  }
  
  /**
   * Award noble to player (called at end of turn).
   * If multiple nobles qualify, player chooses one.
   * 
   * @param player - Player receiving noble
   * @param noble - Noble tile to award
   */
  static awardNoble(player: PlayerState, noble: Noble): void {
    player.nobles.push(noble);
    player.prestige += noble.prestige; // Always +3
  }
}
```

---

## Testing

### Unit Tests

```typescript
// tests/unit/data/nobles.test.ts
import { describe, it, expect } from 'vitest';
import { DataLoader } from '@/services/DataLoader';

describe('Noble Data', () => {
  it('should load exactly 10 nobles', () => {
    const nobles = DataLoader.loadNobles();
    expect(nobles).toHaveLength(10);
  });
  
  it('should have unique noble IDs', () => {
    const nobles = DataLoader.loadNobles();
    const ids = nobles.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(nobles.length);
  });
  
  it('should all have prestige of 3', () => {
    const nobles = DataLoader.loadNobles();
    nobles.forEach(noble => {
      expect(noble.prestige).toBe(3);
    });
  });
  
  it('should have valid requirement ranges', () => {
    const nobles = DataLoader.loadNobles();
    nobles.forEach(noble => {
      Object.values(noble.requirements).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(5);
      });
    });
  });
  
  it('should select correct number of nobles per player count', () => {
    expect(DataLoader.selectNobles(2)).toHaveLength(3);
    expect(DataLoader.selectNobles(3)).toHaveLength(4);
    expect(DataLoader.selectNobles(4)).toHaveLength(5);
  });
});
```

### Rule Engine Tests

```typescript
// tests/unit/rules/noble-visit.test.ts
import { describe, it, expect } from 'vitest';
import { RuleEngine } from '@/services/RuleEngine';
import { createMockPlayer, createMockNoble } from '@/tests/mocks';

describe('RuleEngine.checkNobleVisit', () => {
  it('should qualify when player has exact bonuses', () => {
    const player = createMockPlayer({
      bonuses: { emerald: 3, diamond: 3, sapphire: 3, onyx: 0, ruby: 0 }
    });
    const noble = createMockNoble({
      requirements: { emerald: 3, diamond: 3, sapphire: 3 }
    });
    
    expect(RuleEngine.checkNobleVisit(player, noble)).toBe(true);
  });
  
  it('should qualify when player exceeds bonuses', () => {
    const player = createMockPlayer({
      bonuses: { emerald: 5, diamond: 4, sapphire: 3, onyx: 2, ruby: 1 }
    });
    const noble = createMockNoble({
      requirements: { emerald: 3, diamond: 3, sapphire: 3 }
    });
    
    expect(RuleEngine.checkNobleVisit(player, noble)).toBe(true);
  });
  
  it('should not qualify when missing one bonus', () => {
    const player = createMockPlayer({
      bonuses: { emerald: 3, diamond: 2, sapphire: 3, onyx: 0, ruby: 0 }
    });
    const noble = createMockNoble({
      requirements: { emerald: 3, diamond: 3, sapphire: 3 }
    });
    
    expect(RuleEngine.checkNobleVisit(player, noble)).toBe(false);
  });
  
  it('should handle two-color nobles', () => {
    const player = createMockPlayer({
      bonuses: { emerald: 4, onyx: 4, diamond: 0, sapphire: 0, ruby: 0 }
    });
    const noble = createMockNoble({
      requirements: { emerald: 4, onyx: 4 }
    });
    
    expect(RuleEngine.checkNobleVisit(player, noble)).toBe(true);
  });
});

describe('RuleEngine.getEligibleNobles', () => {
  it('should return empty array when no nobles qualify', () => {
    const player = createMockPlayer({
      bonuses: { emerald: 1, diamond: 1, sapphire: 1, onyx: 0, ruby: 0 }
    });
    const nobles = [
      createMockNoble({ requirements: { emerald: 3, diamond: 3, sapphire: 3 } })
    ];
    
    expect(RuleEngine.getEligibleNobles(player, nobles)).toHaveLength(0);
  });
  
  it('should return multiple nobles when player qualifies for several', () => {
    const player = createMockPlayer({
      bonuses: { emerald: 4, diamond: 4, sapphire: 4, onyx: 4, ruby: 4 }
    });
    const nobles = [
      createMockNoble({ requirements: { emerald: 3, diamond: 3, sapphire: 3 } }),
      createMockNoble({ requirements: { emerald: 4, onyx: 4 } }),
      createMockNoble({ requirements: { sapphire: 4, ruby: 4 } })
    ];
    
    expect(RuleEngine.getEligibleNobles(player, nobles)).toHaveLength(3);
  });
});
```

### Contract Tests

```typescript
// tests/contract/noble-schema.test.ts
import Ajv from 'ajv';
import nobleSchema from '@/contracts/noble-schema.json';
import noblesData from '@/assets/data/nobles.json';

describe('Noble Data Schema Compliance', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(nobleSchema);
  
  it('noble data should match schema', () => {
    const valid = validate(noblesData);
    expect(valid).toBe(true);
    if (!valid) {
      console.error(validate.errors);
    }
  });
  
  it('should have exactly 10 nobles', () => {
    expect(noblesData.nobles).toHaveLength(10);
  });
});
```

---

## Strategic Considerations

### Noble Acquisition Strategy

**Early Game (0-5 bonuses):**
- Nobles typically unreachable
- Focus on building bonus diversity

**Mid Game (6-9 bonuses):**
- Two-color nobles become achievable (8 bonuses required)
- Players may race for specific nobles

**Late Game (10+ bonuses):**
- Three-color nobles become achievable (9 bonuses required)
- Multiple nobles may be available to single player

### Balance Analysis

**Two-Color Nobles (8 bonuses):**
- Easier to achieve (focused strategy)
- Require fewer cards (4-8 cards depending on levels)
- Achievable mid-game

**Three-Color Nobles (9 bonuses):**
- Harder to achieve (diversified strategy)
- Require more cards (9+ cards typically)
- Achievable late-game

**Coverage**: The 10 nobles ensure diverse strategies are viable (specialist vs generalist approaches).

---

## Next Steps

1. **Generate noble data file** based on official Splendor noble tiles
2. **Validate against schema** using Ajv
3. **Create unit tests** for data loader and noble visit logic
4. **Create contract tests** to ensure data format compliance
5. **Implement noble selection UI** for when multiple nobles qualify

See `card-schema.md` for development card data format.  
See `quickstart.md` for testing scenarios involving noble visits.
