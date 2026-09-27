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

// `type: 'section'` is a visual group heading (e.g. "Écran & Affichage"), not a
// stored value: it has no input and is never written to `specs`.
export type SpecField = { key: string; type?: 'select' | 'section'; options?: string[]; placeholder?: string };

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
    { key: 'État', type: 'select', options: ['Neuf', 'Reconditionné', 'Occasion'] },
    { key: 'Processeur (CPU)', placeholder: 'Intel Core i5-1335U' },
    { key: 'Génération', placeholder: '11ᵉ génération' },
    { key: 'Nombre de cœurs', placeholder: '10' },
    { key: 'Processeurs logiques', placeholder: '12' },
    { key: 'Fréquence de base', placeholder: '1.70 GHz' },
    { key: 'Fréquence Turbo', placeholder: '3.60 GHz' },
    { key: 'Carte graphique', placeholder: 'Radeon Graphics' },
    { key: 'Mémoire RAM', placeholder: '8 Go DDR4 / DDR5' },
    { key: 'Stockage', placeholder: '512 Go SSD NVMe' },
    { key: 'Écran & Affichage', type: 'section' },
    { key: 'Définition', type: 'select', options: ['HD', 'Full HD', '2.5K (QHD)', '4K UHD'] },
    { key: 'Technologie de dalle', type: 'select', options: ['IPS', 'OLED', 'TN', 'VA'] },
    { key: 'Tactile', type: 'select', options: ['Oui', 'Non'] },
    { key: 'Clavier', placeholder: 'AZERTY, rétroéclairé' },
    { key: 'OS', placeholder: 'Windows 11' },
    { key: 'Autonomie', placeholder: '+4 heures' },
    { key: 'Connectivité & Réseau', type: 'section' },
    { key: 'Ports USB', placeholder: 'USB-A ×2, USB-C (Thunderbolt 4)' },
    { key: 'Sorties vidéo', placeholder: 'HDMI, DisplayPort' },
    { key: 'Réseau', placeholder: 'Wi-Fi 6E, Bluetooth 5.3, RJ45' },
    { key: 'Audio', placeholder: 'Prise combo casque/micro 3,5 mm' },
    { key: 'Autres infos', placeholder: 'Livré avec sac…' },
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

export type SpecItem =
  | { kind: 'section'; label: string }
  | { kind: 'row'; key: string; value: string };

/**
 * Like orderedSpecs, but interleaves section headings from SPEC_FIELDS. A section
 * is emitted only when at least one filled field follows it (empty sections are
 * dropped). Filled keys not present in the reference list are appended at the end.
 */
export function groupedSpecs(
  group: string | undefined,
  specs: Record<string, string> | undefined | null
): SpecItem[] {
  if (!specs) return [];
  const fields = (group && SPEC_FIELDS[group]) || [];
  const known = new Set(fields.filter((f) => f.type !== 'section').map((f) => f.key));

  const items: SpecItem[] = [];
  let pendingSection: string | null = null;

  for (const f of fields) {
    if (f.type === 'section') {
      pendingSection = f.key; // held back until a filled row appears under it
      continue;
    }
    const value = specs[f.key];
    if (value == null || String(value).trim() === '') continue;
    if (pendingSection) {
      items.push({ kind: 'section', label: pendingSection });
      pendingSection = null;
    }
    items.push({ kind: 'row', key: f.key, value });
  }

  // Values stored under keys the reference list doesn't know about (e.g. older
  // demo products) still deserve to show — appended, in their own order.
  for (const [key, value] of Object.entries(specs)) {
    if (!known.has(key) && value != null && String(value).trim() !== '') {
      items.push({ kind: 'row', key, value });
    }
  }
  return items;
}
