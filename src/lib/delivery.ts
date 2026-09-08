/**
 * Zones de livraison G&C Tech et leurs tarifs (en CFA).
 *
 * Une zone regroupe plusieurs quartiers facturés au même prix. Le client
 * choisit sa zone, puis précise son adresse exacte dans le champ libre du
 * panier — la zone détermine le tarif, pas l'adresse.
 *
 * Il n'y a AUCUN seuil de livraison offerte : le tarif de la zone s'applique
 * quel que soit le montant de la commande.
 *
 * Pour modifier un tarif ou ajouter un quartier, c'est le seul endroit à
 * toucher. Les commandes déjà passées conservent le libellé de zone enregistré
 * au moment de l'achat (colonne `orders.delivery_zone`), donc renommer une zone
 * ici ne réécrit pas l'historique.
 */

export interface DeliveryZone {
  /** Identifiant stable, utilisé seulement dans l'état du formulaire. */
  id: string;
  /** Quartiers couverts, dans l'ordre fourni par l'exploitation. */
  areas: string[];
  /** Frais de livraison en CFA. */
  cost: number;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'godomey',
    cost: 600,
    areas: ['CEG Godomey', 'Godomey Gare', 'Akogbato', 'Dèkoungbé', 'PK14', 'Atrokpocodji', 'Carrefour IITA'],
  },
  {
    id: 'tankpe',
    cost: 600,
    areas: ['Tankpè', 'UAC-Campus', 'Bidossessi', 'Kpota', 'Arconville', 'Hôpital de Zone', "SOS Village d'Enfants"],
  },
  {
    id: 'agla',
    cost: 700,
    areas: ['Agla', 'Fidjrossè', 'Aïbatin', 'Houéyiho', 'Vèdoko', 'Vodjè', 'Gbégamey', 'Etoile Rouge'],
  },
  {
    id: 'kindonou',
    cost: 700,
    areas: ['Kindonou', 'Ménontin', "Stade de l'Amitié", 'Zogbo', 'Ste Rita', 'Gbèdjromédé'],
  },
  {
    id: 'jericho',
    cost: 1000,
    areas: ['Jéricho', 'Aidjèdo', 'St Michel', 'St Jean', 'Yokpa', 'Avenue Steinmez', 'Ganhi'],
  },
  {
    id: 'route-des-peches',
    cost: 1000,
    areas: ['Route des pêches', 'Aéroport', 'Cadjèhoun', 'Haie Vive', 'CNHU', 'Camp Guézo', 'Zongo'],
  },
  {
    id: 'cococodji',
    cost: 1000,
    areas: ['Cococodji', 'Cocotomey', 'Hèvié', 'Womey', 'Gbôdjè', 'Marché de Pahou'],
  },
  {
    id: 'akassato',
    cost: 1000,
    areas: ['Akassato', 'Missessinto', 'Ouèdo'],
  },
  {
    id: 'sacre-coeur',
    cost: 1500,
    areas: ['Sacré Cœur', 'Sègbéya', 'Sènandé 1 & 2', 'Carrefour La Roche', 'Carrefour La Béninoise'],
  },
  {
    id: 'avotrou',
    cost: 1500,
    areas: ['Yénawa', "Lom'nava", 'Minontchou', 'Ayélawadjè', 'Sodjatimé', 'Gbèdokpo', 'Avotrou', 'Dédokpo'],
  },
  {
    id: 'carrefour-le-belier',
    cost: 1500,
    areas: ['Abattoir', 'Carrefour Le Bélier', 'Agblangandan', 'PK10', 'PK11'],
  },
  {
    id: 'seme-kpodji',
    cost: 2000,
    areas: ['Sèmè-Kpodji', 'Djeffa'],
  },
  {
    id: 'autres-villes',
    cost: 2000,
    areas: ['Ouidah', 'Porto-Novo', 'Parakou', 'Natitingou'],
  },
  {
    id: 'porto-novo-quartiers',
    cost: 2500,
    areas: ['Houézoumè', 'Attakê', 'Djassin', 'Houinmè', 'Ouando', 'et autres'],
  },
];

/**
 * Créneaux de livraison proposés au client. Il en choisit un avec une date au
 * moment de la commande — c'est ce qui remplace un suivi de colis : la
 * livraison est planifiée, pas tracée.
 */
export const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

/** Libellé affiché d'une zone : tous ses quartiers, séparés par des points médians. */
export function zoneLabel(zone: DeliveryZone): string {
  return zone.areas.join(' · ');
}

export function findZone(id: string): DeliveryZone | undefined {
  return DELIVERY_ZONES.find((z) => z.id === id);
}

/**
 * Filtre les zones sur un nom de quartier saisi par le client.
 * Insensible à la casse et aux accents : « segbeya » trouve « Sègbéya ».
 */
export function searchZones(query: string): DeliveryZone[] {
  const q = normalize(query.trim());
  if (!q) return DELIVERY_ZONES;
  return DELIVERY_ZONES.filter((z) => z.areas.some((a) => normalize(a).includes(q)));
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/** Tarif le plus bas parmi toutes les zones — sert à annoncer « à partir de ». */
export const MIN_DELIVERY_COST = Math.min(...DELIVERY_ZONES.map((z) => z.cost));
