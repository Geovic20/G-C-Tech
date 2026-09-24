// Single source of truth for product characteristics.
//
// Used by the admin product form (which fields to show, in which order, and
// which are dropdowns) AND by the storefront product page (to display the specs
// in this exact order). The order matters on screen: PostgreSQL `jsonb` does not
// preserve key insertion order, so without an explicit order the specs would
// render in an arbitrary internal order. `orderedSpecs` re-imposes it.
//
// The `key` is both the admin label and the key stored in `specs` (French), so
// it appears as-is on the storefront.

export type SpecField = { key: string; type?: 'select'; options?: string[]; placeholder?: string };

export const SPEC_FIELDS: Record<string, SpecField[]> = {
  smartphones: [
    { key: 'Poids', placeholder: '195 g' },
    { key: "Taille de l'écran (pouces)", placeholder: '6.7' },
    { key: 'Taux de rafraîchissement', placeholder: '120 Hz' },
    { key: 'Processeur', placeholder: 'Snapdragon 8 Gen 3' },
    { key: 'RAM', placeholder: '8 Go' },
    { key: 'Stockage', placeholder: '128 Go' },
    { key: 'OS', placeholder: 'Android 15' },
    { key: 'Capteur principal', placeholder: '50 Mpx' },
    { key: 'Caméra frontale', placeholder: '8 Mpx' },
    { key: 'Batterie', placeholder: '5000 mAh' },
    { key: 'Connectivité réseaux', placeholder: '2G / 3G / 4G LTE / 5G' },
    { key: 'Carte SIM', type: 'select', options: ['Double nano SIM', 'Nano SIM unique', 'e-SIM uniquement', 'Nano SIM + e-SIM'] },
    { key: 'Port de charge', type: 'select', options: ['USB Type-C', 'Lightning', 'Micro-USB'] },
  ],
  computers: [
    { key: 'Processeur', placeholder: 'Intel Core i7 / Apple M3' },
    { key: 'RAM', placeholder: '16 Go' },
    { key: 'Stockage', placeholder: '512 Go SSD' },
    { key: 'Écran', placeholder: '15,6 pouces' },
    { key: 'Carte graphique', placeholder: 'RTX 4060' },
    { key: 'OS', placeholder: 'Windows 11' },
  ],
  tablets: [
    { key: 'Processeur' },
    { key: "Taille de l'écran (pouces)", placeholder: '11' },
    { key: 'Stockage', placeholder: '128 Go' },
    { key: 'Batterie', placeholder: '8000 mAh' },
    { key: 'OS', placeholder: 'Android 14' },
  ],
  headphones: [
    { key: 'Connectivité', type: 'select', options: ['Bluetooth', 'Filaire', 'Bluetooth + Filaire'] },
    { key: 'Autonomie', placeholder: '30 h' },
    { key: 'Réduction de bruit', type: 'select', options: ['Oui', 'Non'] },
    { key: 'Taille du haut-parleur', placeholder: '40 mm' },
  ],
  earphones: [
    { key: 'Connectivité', type: 'select', options: ['Bluetooth', 'Filaire'] },
    { key: 'Autonomie', placeholder: '6 h (30 h avec le boîtier)' },
    { key: 'Réduction de bruit', type: 'select', options: ['Oui', 'Non'] },
  ],
  smartwatches: [
    { key: "Taille de l'écran (pouces)", placeholder: '1.9' },
    { key: 'Batterie', placeholder: '400 mAh' },
    { key: "Résistance à l'eau", type: 'select', options: ['Oui', 'Non'] },
    { key: 'GPS', type: 'select', options: ['Oui', 'Non'] },
    { key: 'Connectivité', placeholder: 'Bluetooth / Wi-Fi' },
  ],
};

/**
 * Returns a product's specs as [key, value] pairs in the canonical per-category
 * order. Keys not in the reference list (e.g. from older demo products) keep
 * their original relative order and come last.
 */
export function orderedSpecs(
  group: string | undefined,
  specs: Record<string, string> | undefined | null
): [string, string][] {
  if (!specs) return [];
  const order = group && SPEC_FIELDS[group] ? SPEC_FIELDS[group].map((f) => f.key) : [];
  const rank = new Map(order.map((k, i) => [k, i]));
  return Object.entries(specs).sort(([a], [b]) => {
    const ra = rank.has(a) ? (rank.get(a) as number) : Number.MAX_SAFE_INTEGER;
    const rb = rank.has(b) ? (rank.get(b) as number) : Number.MAX_SAFE_INTEGER;
    return ra - rb;
  });
}
