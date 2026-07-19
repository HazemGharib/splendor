export const NOBLE_PORTRAITS: Record<string, string> = {
  'N-001': '/assets/nobles/mary-stuart.webp',
  'N-002': '/assets/nobles/charles-v.webp',
  'N-003': '/assets/nobles/francis-i.webp',
  'N-004': '/assets/nobles/isabella-castile.webp',
  'N-005': '/assets/nobles/anne-brittany.webp',
  'N-006': '/assets/nobles/suleiman-magnificent.webp',
  'N-007': '/assets/nobles/catherine-medici.webp',
  'N-008': '/assets/nobles/henry-viii.webp',
  'N-009': '/assets/nobles/elisabeth-austria.webp',
  'N-010': '/assets/nobles/cosimo-medici.webp',
};

export function getNoblePortrait(nobleId: string): string {
  return NOBLE_PORTRAITS[nobleId] || '/assets/nobles/default.webp';
}
