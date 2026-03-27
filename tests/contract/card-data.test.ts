import { describe, it, expect } from 'vitest';
import { DataLoader } from '../../../src/services/DataLoader';
import cardsLevel1 from '../../../src/assets/data/cards-level1.json';
import cardsLevel2 from '../../../src/assets/data/cards-level2.json';
import cardsLevel3 from '../../../src/assets/data/cards-level3.json';

describe('Card Data Schema Contract', () => {
  describe('Level 1 Cards', () => {
    it('should have exactly 40 cards', () => {
      expect(cardsLevel1.cards).toHaveLength(40);
    });

    it('should have valid ID format (L1-XXX)', () => {
      cardsLevel1.cards.forEach((card) => {
        expect(card.id).toMatch(/^L1-\d{3}$/);
      });
    });

    it('should have unique IDs', () => {
      const ids = cardsLevel1.cards.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(cardsLevel1.cards.length);
    });

    it('should have valid prestige range (0-1)', () => {
      cardsLevel1.cards.forEach((card) => {
        expect(card.prestige).toBeGreaterThanOrEqual(0);
        expect(card.prestige).toBeLessThanOrEqual(1);
      });
    });

    it('should have equal bonus distribution (8 per color)', () => {
      const bonusCounts = cardsLevel1.cards.reduce((acc, card) => {
        acc[card.bonus] = (acc[card.bonus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(bonusCounts.emerald).toBe(8);
      expect(bonusCounts.diamond).toBe(8);
      expect(bonusCounts.sapphire).toBe(8);
      expect(bonusCounts.onyx).toBe(8);
      expect(bonusCounts.ruby).toBe(8);
    });

    it('should have valid cost values (0-7 per gem)', () => {
      cardsLevel1.cards.forEach((card) => {
        Object.values(card.cost).forEach((cost) => {
          expect(cost).toBeGreaterThanOrEqual(0);
          expect(cost).toBeLessThanOrEqual(7);
        });
      });
    });
  });

  describe('Level 2 Cards', () => {
    it('should have exactly 30 cards', () => {
      expect(cardsLevel2.cards).toHaveLength(30);
    });

    it('should have valid ID format (L2-XXX)', () => {
      cardsLevel2.cards.forEach((card) => {
        expect(card.id).toMatch(/^L2-\d{3}$/);
      });
    });

    it('should have valid prestige range (1-3)', () => {
      cardsLevel2.cards.forEach((card) => {
        expect(card.prestige).toBeGreaterThanOrEqual(1);
        expect(card.prestige).toBeLessThanOrEqual(3);
      });
    });

    it('should have equal bonus distribution (6 per color)', () => {
      const bonusCounts = cardsLevel2.cards.reduce((acc, card) => {
        acc[card.bonus] = (acc[card.bonus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(bonusCounts.emerald).toBe(6);
      expect(bonusCounts.diamond).toBe(6);
      expect(bonusCounts.sapphire).toBe(6);
      expect(bonusCounts.onyx).toBe(6);
      expect(bonusCounts.ruby).toBe(6);
    });
  });

  describe('Level 3 Cards', () => {
    it('should have exactly 20 cards', () => {
      expect(cardsLevel3.cards).toHaveLength(20);
    });

    it('should have valid ID format (L3-XXX)', () => {
      cardsLevel3.cards.forEach((card) => {
        expect(card.id).toMatch(/^L3-\d{3}$/);
      });
    });

    it('should have valid prestige range (3-5)', () => {
      cardsLevel3.cards.forEach((card) => {
        expect(card.prestige).toBeGreaterThanOrEqual(3);
        expect(card.prestige).toBeLessThanOrEqual(5);
      });
    });

    it('should have equal bonus distribution (4 per color)', () => {
      const bonusCounts = cardsLevel3.cards.reduce((acc, card) => {
        acc[card.bonus] = (acc[card.bonus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(bonusCounts.emerald).toBe(4);
      expect(bonusCounts.diamond).toBe(4);
      expect(bonusCounts.sapphire).toBe(4);
      expect(bonusCounts.onyx).toBe(4);
      expect(bonusCounts.ruby).toBe(4);
    });
  });

  describe('DataLoader', () => {
    it('should load all 90 cards', () => {
      const cards = DataLoader.loadCards();
      expect(cards).toHaveLength(90);
    });

    it('should have unique IDs across all levels', () => {
      const cards = DataLoader.loadCards();
      const ids = cards.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(cards.length);
    });

    it('should validate card data', () => {
      expect(DataLoader.validateCardData(cardsLevel1 as never)).toBe(true);
      expect(DataLoader.validateCardData(cardsLevel2 as never)).toBe(true);
      expect(DataLoader.validateCardData(cardsLevel3 as never)).toBe(true);
    });
  });
});
