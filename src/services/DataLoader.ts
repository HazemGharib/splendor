import { DevelopmentCard, CardDataFile } from '../models/Card';
import { Noble, NobleDataFile } from '../models/Noble';
import cardsLevel1Data from '../assets/data/cards-level1.json';
import cardsLevel2Data from '../assets/data/cards-level2.json';
import cardsLevel3Data from '../assets/data/cards-level3.json';
import noblesData from '../assets/data/nobles.json';

export class DataLoader {
  static loadCards(): DevelopmentCard[] {
    const level1 = (cardsLevel1Data as CardDataFile).cards.map(card => ({ ...card, level: 1 as const }));
    const level2 = (cardsLevel2Data as CardDataFile).cards.map(card => ({ ...card, level: 2 as const }));
    const level3 = (cardsLevel3Data as CardDataFile).cards.map(card => ({ ...card, level: 3 as const }));
    
    return [...level1, ...level2, ...level3];
  }
  
  static loadCardsByLevel(level: 1 | 2 | 3): DevelopmentCard[] {
    switch (level) {
      case 1:
        return (cardsLevel1Data as CardDataFile).cards.map(card => ({ ...card, level: 1 as const }));
      case 2:
        return (cardsLevel2Data as CardDataFile).cards.map(card => ({ ...card, level: 2 as const }));
      case 3:
        return (cardsLevel3Data as CardDataFile).cards.map(card => ({ ...card, level: 3 as const }));
    }
  }
  
  static loadNobles(): Noble[] {
    return (noblesData as NobleDataFile).nobles;
  }
  
  static validateCardData(data: CardDataFile): boolean {
    if (!data.cards || !Array.isArray(data.cards)) return false;
    
    const ids = new Set<string>();
    for (const card of data.cards) {
      if (!card.id || ids.has(card.id)) return false;
      ids.add(card.id);
      
      if (typeof card.prestige !== 'number' || card.prestige < 0 || card.prestige > 5) {
        return false;
      }
      
      if (!card.bonus || !['emerald', 'diamond', 'sapphire', 'onyx', 'ruby'].includes(card.bonus)) {
        return false;
      }
    }
    
    return true;
  }
  
  static validateNobleData(data: NobleDataFile): boolean {
    if (!data.nobles || !Array.isArray(data.nobles) || data.nobles.length !== 10) {
      return false;
    }
    
    const ids = new Set<string>();
    for (const noble of data.nobles) {
      if (!noble.id || ids.has(noble.id)) return false;
      ids.add(noble.id);
      
      if (noble.prestige !== 3) return false;
      
      if (!noble.requirements || typeof noble.requirements !== 'object') return false;
    }
    
    return true;
  }
}
