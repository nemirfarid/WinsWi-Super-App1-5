import type { Listing, UniverseId } from '@/types/winswi';

export type SourceTier =
  | 'official-api'
  | 'partner-feed'
  | 'seller-feed'
  | 'licensed-public-data'
  | 'reference-link';

export type OpportunitySource = {
  id: string;
  name: string;
  tier: SourceTier;
  countryCodes: string[];
  canRepublish: boolean;
};

export type ExternalListing = Listing & {
  source: OpportunitySource;
  sourceUrl: string;
  sourceId?: string;
  publishedAt?: string;
  lastSeenAt?: string;
  externalScore?: number;
};

export type OpportunityScoreInput = {
  match: number;
  priceValue: number;
  location: number;
  sourceTrust: number;
  freshness: number;
  rarity: number;
};

export function normalizeExternalListing(
  input: Omit<ExternalListing, 'id'> & { id?: string }
): ExternalListing {
  const source = input.source as OpportunitySource;

  const title = typeof input.title === 'string' ? input.title : '';
  const location =
    typeof input.location === 'string' ? input.location : '';
  const price =
    typeof input.price === 'number' ? input.price : undefined;

  const currency =
    typeof input.currency === 'string' ? input.currency : 'DZD';

  const description =
    typeof input.description === 'string' && input.description
      ? input.description
      : title;

  const id =
    input.id ??
    `${source.id}:${input.sourceId ?? stableKey(title, location, price)}`;

  return {
    ...input,
    id,
    title,
    universe: input.universe as UniverseId,
    currency,
    location: location || 'Non précisé',
    description,
    source,
    sourceUrl: typeof input.sourceUrl === 'string' ? input.sourceUrl : '',
  };
}

export function stableKey(
  title: string,
  location: string,
  price?: number
): string {
  return [title, location, price ?? '']
    .join('|')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9|]+/g, '-');
}

export function duplicateFingerprint(
  item: Pick<
    ExternalListing,
    'title' | 'location' | 'price' | 'metadata'
  >
): string {
  const metadata =
    item.metadata &&
    typeof item.metadata === 'object' &&
    !Array.isArray(item.metadata)
      ? (item.metadata as Record<string, unknown>)
      : {};

  const strong = [
    'vin',
    'phone',
    'sellerPhone',
    'registration',
    'reference',
  ]
    .map((key) => metadata[key])
    .find(
      (value): value is string | number =>
        typeof value === 'string' || typeof value === 'number'
    );

  return String(
    strong ?? stableKey(item.title, item.location ?? '', item.price)
  );
}

export function scoreOpportunity(input: OpportunityScoreInput): number {
  const values = [
    input.match,
    input.priceValue,
    input.location,
    input.sourceTrust,
    input.freshness,
    input.rarity,
  ].map((v) => Math.max(0, Math.min(100, v)));

  const score = Math.round(
    values[0] * 0.35 +
    values[1] * 0.2 +
    values[2] * 0.15 +
    values[3] * 0.12 +
    values[4] * 0.1 +
    values[5] * 0.08
  );

  return Math.max(0, Math.min(100, score));
}

export function sourceCanBeImported(
  source: OpportunitySource
): boolean {
  return source.tier !== 'reference-link';
}

export function sourceCanBeRepublished(
  source: OpportunitySource
): boolean {
  return source.canRepublish;
}

export function universeFromText(
  text: string
): UniverseId | undefined {
  const s = text.toLocaleLowerCase('fr-DZ');

  const rules: Array<[UniverseId, RegExp]> = [
    ['immo', /appartement|maison|villa|terrain|immobilier|logement|location/],
    ['auto', /voiture|auto|toyota|renault|peugeot|véhicule|moto/],
    ['job', /emploi|job|travail|recrut|poste|cdi|carrière/],
    ['market', /produit|acheter|téléphone|commerce|market/],
    ['build', /construction|bâtiment|plombier|électricien|artisan|travaux/],
    ['agri', /agri|agricole|ferme|irrigation|tracteur/],
    ['travel', /voyage|hôtel|séjour|vol|vacances|tourisme/],
    ['education', /éducation|formation|cours|école|université|tutorat/],
    ['health', /santé|médecin|clinique|pharmacie|hôpital|rendez-vous médical/],
    ['sport', /sport|football|fitness|gym|coach|salle/],
    ['food', /restaurant|repas|food|pizza|boulangerie|traiteur/],
    ['delivery', /livraison|colis|coursier|transport express/],
  ];

  return rules.find(([, pattern]) => pattern.test(s))?.[0];
}



