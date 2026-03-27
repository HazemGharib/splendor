export const NOBLE_PORTRAITS: Record<string, string> = {
  'N-001': '/assets/nobles/mary-stuart.png',
  'N-002': '/assets/nobles/charles-v.png',
  'N-003': '/assets/nobles/francis-i.png',
  'N-004': '/assets/nobles/isabella-castile.png',
  'N-005': '/assets/nobles/anne-brittany.png',
  'N-006': '/assets/nobles/suleiman-magnificent.png',
  'N-007': '/assets/nobles/catherine-medici.png',
  'N-008': '/assets/nobles/henry-viii.png',
  'N-009': '/assets/nobles/elisabeth-austria.png',
  'N-010': '/assets/nobles/cosimo-medici.png',
};

export function getNoblePortrait(nobleId: string): string {
  return NOBLE_PORTRAITS[nobleId] || '/assets/nobles/default.png';
}
