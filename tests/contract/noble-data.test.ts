import { describe, it, expect } from 'vitest';
import { DataLoader } from '../../../src/services/DataLoader';
import noblesData from '../../../src/assets/data/nobles.json';

describe('Noble Data Schema Contract', () => {
  it('should have exactly 10 nobles', () => {
    expect(noblesData.nobles).toHaveLength(10);
  });

  it('should have valid ID format (N-XXX)', () => {
    noblesData.nobles.forEach((noble) => {
      expect(noble.id).toMatch(/^N-\d{3}$/);
    });
  });

  it('should have unique IDs', () => {
    const ids = noblesData.nobles.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(noblesData.nobles.length);
  });

  it('should all have prestige of 3', () => {
    noblesData.nobles.forEach((noble) => {
      expect(noble.prestige).toBe(3);
    });
  });

  it('should have valid requirement ranges (0-5 per color)', () => {
    noblesData.nobles.forEach((noble) => {
      Object.values(noble.requirements).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(5);
      });
    });
  });

  it('should require at least 2 colors', () => {
    noblesData.nobles.forEach((noble) => {
      const colorCount = Object.keys(noble.requirements).length;
      expect(colorCount).toBeGreaterThanOrEqual(2);
    });
  });

  it('should have total requirements between 7-10', () => {
    noblesData.nobles.forEach((noble) => {
      const total = Object.values(noble.requirements).reduce((sum, val) => sum + val, 0);
      expect(total).toBeGreaterThanOrEqual(7);
      expect(total).toBeLessThanOrEqual(10);
    });
  });

  describe('DataLoader', () => {
    it('should load all nobles', () => {
      const nobles = DataLoader.loadNobles();
      expect(nobles).toHaveLength(10);
    });

    it('should validate noble data', () => {
      expect(DataLoader.validateNobleData(noblesData as never)).toBe(true);
    });
  });
});
