/**
 * Identité de l'entreprise — source unique.
 *
 * Ces informations étaient auparavant recopiées à la main dans LegalNotice,
 * ContactUs, Footer et Navbar, qui avaient fini par se contredire (deux
 * numéros de téléphone différents, deux plages horaires, une adresse à Dakar).
 * Tout passe désormais par ici : un changement se fait à un seul endroit.
 *
 * ⚠ À VÉRIFIER AVANT LA MISE EN LIGNE — voir les marqueurs TODO ci-dessous.
 */

export const COMPANY = {
  /** Nom commercial et légal. */
  name: 'G&C Tech',

  legalForm: {
    fr: 'entreprise individuelle',
    en: 'sole proprietorship',
  },

  country: {
    fr: 'Bénin',
    en: 'Benin',
  },

  /** Représentant légal, également directeur de la publication. */
  manager: 'KPOSSILANDE Géovic',

  address: {
    street: 'Rue de la Pharmacie le Jourdain',
    area: 'Godomey Togoudo',
    city: 'Abomey-Calavi',
    country: { fr: 'Bénin', en: 'Benin' },
  },

  /**
   * Numéros affichés au public.
   *
   * ⚠ TODO CONFIRMER — les numéros fournis comptaient 8 chiffres
   * (90835005 et 59100290), c'est-à-dire le format d'avant la renumérotation
   * béninoise de 2022. Ils ont été préfixés de « 01 » pour atteindre les
   * 10 chiffres composables aujourd'hui. Vérifier en appelant avant l'ouverture.
   */
  phones: [
    { display: '+229 01 90 83 50 05', tel: '+2290190835005' },
    { display: '+229 01 59 10 02 90', tel: '+2290159100290' },
  ],

  /**
   * Adresse de contact unique.
   *
   * ⚠ TODO — une adresse Gmail inspire moins confiance sur un site marchand
   * qu'une adresse au nom du domaine. À remplacer par contact@<domaine> dès que
   * le nom de domaine sera acheté et la messagerie configurée.
   */
  email: 'kpossilandegeovic68@gmail.com',

  hours: {
    fr: 'Du lundi au vendredi, de 9h à 18h',
    en: 'Monday to Friday, 9am to 6pm',
  },
  hoursShort: {
    fr: 'Lun–Ven, 9h–18h',
    en: 'Mon–Fri, 9am–6pm',
  },

  /**
   * Nom de domaine définitif.
   *
   * ⚠ TODO BLOQUANT — pas encore acheté. Une fois renseigné ici, il faut aussi :
   *   • Supabase → Authentication → URL Configuration : Site URL + Redirect URLs
   *   • Secret APP_URL de l'Edge Function create-payment
   *   • URL du webhook dans le tableau de bord FedaPay
   *   • balises canoniques, og:url, robots.txt et sitemap.xml
   * Tant que c'est `null`, les pages omettent proprement la mention.
   */
  domain: null as string | null,
} as const;

/**
 * Hébergement — mention obligatoire dans les mentions légales.
 *
 * ⚠ TODO — l'adresse postale exacte de Vercel Inc. n'est volontairement pas
 * inscrite ici : elle a changé plusieurs fois et une adresse fausse dans des
 * mentions légales est pire que pas d'adresse. La relever sur vercel.com/legal
 * ou sur une facture Vercel, puis la compléter.
 */
export const HOSTING = {
  site: {
    name: 'Vercel Inc.',
    country: { fr: 'États-Unis', en: 'United States' },
    url: 'https://vercel.com',
  },
  /** Base de données et comptes clients. */
  data: {
    name: 'Supabase, Inc.',
    country: { fr: 'États-Unis', en: 'United States' },
    url: 'https://supabase.com',
    /** Région d'hébergement effective des données (AWS eu-west-1). */
    region: { fr: 'Irlande (Union européenne)', en: 'Ireland (European Union)' },
  },
} as const;

/**
 * Durées de conservation annoncées dans la politique de confidentialité.
 *
 * ⚠ TODO FAIRE VALIDER — proposition à confirmer par un conseil compétent en
 * droit béninois. Le raisonnement retenu :
 *   • Les commandes et factures sont des pièces comptables. Le droit comptable
 *     OHADA impose une conservation longue (dix ans) : elles ne peuvent donc
 *     pas être effacées au bout de 12 mois comme envisagé initialement.
 *   • Le compte client, lui, n'est soumis à aucune obligation de ce type :
 *     24 mois après la dernière connexion évite de supprimer le compte d'un
 *     client qui n'achète qu'une fois par an, ce que 12 mois aurait fait.
 */
export const DATA_RETENTION = {
  account: { months: 24, fr: '24 mois après la dernière connexion', en: '24 months after the last sign-in' },
  orders: { years: 10, fr: '10 ans (obligation comptable)', en: '10 years (accounting obligation)' },
  savings: { years: 10, fr: "10 ans après la clôture du plan d'épargne", en: '10 years after the savings plan closes' },
  cookies: { months: 13, fr: '13 mois maximum', en: '13 months maximum' },
} as const;

/**
 * Protection des données personnelles au Bénin.
 * ⚠ TODO — passer `declared` à true et renseigner le récépissé une fois la
 * déclaration APDP aboutie. Tant que c'est false, les pages annoncent une
 * démarche « en cours » plutôt qu'une conformité acquise.
 */
export const DATA_PROTECTION = {
  authority: {
    name: 'APDP',
    fullName: {
      fr: 'Autorité de Protection des Données à Caractère Personnel',
      en: 'Personal Data Protection Authority',
    },
    country: { fr: 'Bénin', en: 'Benin' },
  },
  declared: false,
  receipt: null as string | null,
  /** Responsable de traitement. */
  controller: 'KPOSSILANDE Géovic',
} as const;

// ----------------------------------------------------------------- helpers

type Lang = 'fr' | 'en';

/** Adresse postale sur une ligne. */
export function formattedAddress(lang: Lang): string {
  const a = COMPANY.address;
  return `${a.street}, ${a.area}, ${a.city}, ${a.country[lang]}`;
}

/** Numéros séparés par une barre, pour un affichage compact. */
export function phoneList(): string {
  return COMPANY.phones.map((p) => p.display).join(' / ');
}
