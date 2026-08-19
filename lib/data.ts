import type { Listing, UniverseId } from '@/types/winswi';

export const universes = [
  { id: 'immo', name: 'ImmoWin', icon: '🏠', desc: 'Immobilier', color: 'universe-immo' },
  { id: 'auto', name: 'AutoWin', icon: '🚗', desc: 'Automobile', color: 'universe-auto' },
  { id: 'job', name: 'JobWin', icon: '💼', desc: 'Emploi', color: 'universe-job' },
  { id: 'market', name: 'MarketWin', icon: '🛒', desc: 'Produits & commerce', color: 'universe-market' },
  { id: 'build', name: 'BuildWin', icon: '🛠️', desc: 'Bâtiment & services', color: 'universe-build' },
  { id: 'agri', name: 'AgriWin', icon: '🌾', desc: 'Agriculture', color: 'universe-agri' },
  { id: 'travel', name: 'TravelWin', icon: '✈️', desc: 'Voyage', color: 'universe-travel' },
  { id: 'education', name: 'EduWin', icon: '🎓', desc: 'Éducation & formation', color: 'universe-education' },
  { id: 'health', name: 'HealthWin', icon: '🩺', desc: 'Santé & rendez-vous', color: 'universe-health' },
  { id: 'sport', name: 'SportWin', icon: '🏆', desc: 'Sport & coaching', color: 'universe-sport' },
  { id: 'food', name: 'FoodWin', icon: '🍽️', desc: 'Restaurants & alimentation', color: 'universe-food' },
  { id: 'delivery', name: 'DeliveryWin', icon: '🛵', desc: 'Livraison & logistique', color: 'universe-delivery' },
] as const;

export const demoListings: Listing[] = [
  { id: 'immo-1', universe: 'immo', title: 'Appartement F3 lumineux', location: 'Mostaganem', price: 12500000, currency: 'DA', description: 'F3 proche du centre, résidence calme.', verified: true, tags: ['F3', 'appartement', 'vente'] },
  { id: 'immo-2', universe: 'immo', title: 'Villa familiale F5', location: 'Oran', price: 32000000, currency: 'DA', description: 'Villa familiale avec garage et jardin.', verified: true, tags: ['F5', 'villa', 'vente'] },
  { id: 'auto-1', universe: 'auto', title: 'Toyota Corolla 2022', location: 'Oran', price: 4200000, currency: 'DA', description: 'Berline automatique, excellent état.', verified: true, tags: ['Toyota', 'Corolla', '2022'] },
  { id: 'auto-2', universe: 'auto', title: 'Renault Clio 2020', location: 'Mostaganem', price: 2600000, currency: 'DA', description: 'Citadine économique, entretien suivi.', tags: ['Renault', 'Clio', '2020'] },
  { id: 'job-1', universe: 'job', title: 'Développeur Full Stack', location: 'Alger', description: 'Poste CDI pour développeur TypeScript/React.', verified: true, tags: ['développeur', 'React', 'TypeScript', 'CDI'] },
  { id: 'market-1', universe: 'market', title: 'Écran Android automobile', location: 'Oran', price: 45000, currency: 'DA', description: 'Écran multimédia Android pour véhicule.', tags: ['Android', 'écran', 'auto'] },
  { id: 'build-1', universe: 'build', title: 'Électricien professionnel', location: 'Mostaganem', description: 'Installation et rénovation électrique.', verified: true, tags: ['électricité', 'artisan'] },
  { id: 'agri-1', universe: 'agri', title: 'Pompe d’irrigation', location: 'Mascara', price: 180000, currency: 'DA', description: 'Pompe pour exploitation agricole.', tags: ['irrigation', 'pompe'] },
  { id: 'travel-1', universe: 'travel', title: 'Séjour Turquie', location: 'Alger → Istanbul', price: 95000, currency: 'DA', description: 'Séjour organisé, selon disponibilités.', tags: ['Turquie', 'Istanbul', 'séjour'] },
];

demoListings.push(
  { id: 'education-1', universe: 'education', title: 'Cours d’anglais en ligne', location: 'Mostaganem', price: 3500, currency: 'DA', description: 'Cours individuels et petits groupes.', tags: ['anglais','en ligne','formation'] },
  { id: 'health-1', universe: 'health', title: 'Cabinet de médecine générale', location: 'Oran', description: 'Prise de rendez-vous selon disponibilités.', verified: true, tags: ['médecin','rendez-vous'] },
  { id: 'sport-1', universe: 'sport', title: 'Coach sportif personnel', location: 'Alger', price: 5000, currency: 'DA', description: 'Coaching individuel et programmes personnalisés.', tags: ['coach','fitness'] },
  { id: 'food-1', universe: 'food', title: 'Restaurant familial', location: 'Mostaganem', price: 1200, currency: 'DA', description: 'Cuisine locale et livraison disponible.', tags: ['restaurant','livraison'] },
  { id: 'delivery-1', universe: 'delivery', title: 'Livraison express', location: 'Oran', price: 600, currency: 'DA', description: 'Colis et courses en livraison locale.', tags: ['express','colis'] },
);

export function isUniverseId(value: string | null): value is UniverseId {
  return !!value && universes.some((u) => u.id === value);
}

export function searchListings(params: { universe?: UniverseId; q?: string }) {
  const query = params.q?.trim().toLocaleLowerCase('fr-DZ') ?? '';
  return demoListings.filter((item) => {
    if (params.universe && item.universe !== params.universe) return false;
    if (!query) return true;
    return [item.title, item.location, item.description, ...(item.tags ?? [])]
      .join(' ')
      .toLocaleLowerCase('fr-DZ')
      .includes(query);
  });
}

export const demoCommunes = [
  { id: '27-01', wilaya_code: '27', name_fr: 'Mostaganem', name_ar: 'مستغانم' },
  { id: '31-01', wilaya_code: '31', name_fr: 'Oran', name_ar: 'وهران' },
  { id: '16-01', wilaya_code: '16', name_fr: 'Alger Centre', name_ar: 'الجزائر الوسطى' },
  { id: '29-01', wilaya_code: '29', name_fr: 'Mascara', name_ar: 'معسكر' },
];
