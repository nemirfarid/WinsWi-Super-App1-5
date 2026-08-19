import type { UniverseId } from '@/types/winswi';

export type FieldDefinition = { key: string; label: string; type: 'text' | 'number' | 'boolean' | 'select'; options?: string[]; required?: boolean };

export const universeFields: Record<UniverseId, FieldDefinition[]> = {
  immo: [
    { key: 'propertyType', label: 'Type de bien', type: 'select', options: ['appartement','villa','maison','terrain','local','bureau','ferme'], required: true },
    { key: 'transaction', label: 'Transaction', type: 'select', options: ['vente','location'], required: true },
    { key: 'rooms', label: 'Pièces', type: 'number' },
    { key: 'surfaceM2', label: 'Surface m²', type: 'number' },
    { key: 'furnished', label: 'Meublé', type: 'boolean' },
  ],
  auto: [
    { key: 'vehicleType', label: 'Type', type: 'select', options: ['voiture','moto','utilitaire','camion'], required: true },
    { key: 'make', label: 'Marque', type: 'text' }, { key: 'model', label: 'Modèle', type: 'text' },
    { key: 'year', label: 'Année', type: 'number' }, { key: 'mileageKm', label: 'Kilométrage', type: 'number' },
  ],
  job: [
    { key: 'employmentType', label: 'Type de contrat', type: 'select', options: ['CDI','CDD','freelance','stage','intérim'], required: true },
    { key: 'jobTitle', label: 'Poste', type: 'text', required: true }, { key: 'remote', label: 'Télétravail', type: 'boolean' }, { key: 'experienceYears', label: 'Expérience', type: 'number' },
  ],
  market: [
    { key: 'category', label: 'Catégorie', type: 'text', required: true }, { key: 'condition', label: 'État', type: 'select', options: ['neuf','occasion','reconditionné'] }, { key: 'brand', label: 'Marque', type: 'text' }, { key: 'stock', label: 'Stock', type: 'number' },
  ],
  build: [
    { key: 'serviceType', label: 'Service', type: 'text', required: true }, { key: 'professionalType', label: 'Profession', type: 'text' }, { key: 'availability', label: 'Disponibilité', type: 'text' },
  ],
  agri: [
    { key: 'category', label: 'Catégorie', type: 'select', options: ['terrain','matériel','bétail','semences','produits','service'], required: true }, { key: 'crop', label: 'Culture', type: 'text' }, { key: 'areaHa', label: 'Surface ha', type: 'number' },
  ],
  education: [
    { key: 'educationType', label: 'Type', type: 'select', options: ['cours','formation','école','université','tutorat','certification','livre'], required: true },
    { key: 'subject', label: 'Matière', type: 'text' }, { key: 'level', label: 'Niveau', type: 'text' }, { key: 'mode', label: 'Mode', type: 'select', options: ['présentiel','en ligne','hybride'] },
  ],
  health: [
    { key: 'serviceType', label: 'Service', type: 'select', options: ['médecin','clinique','pharmacie','laboratoire','imagerie','soins','téléconsultation'], required: true },
    { key: 'specialty', label: 'Spécialité', type: 'text' }, { key: 'appointment', label: 'Rendez-vous', type: 'boolean' },
  ],
  sport: [
    { key: 'sportType', label: 'Sport', type: 'text', required: true }, { key: 'activityType', label: 'Activité', type: 'select', options: ['club','coach','salle','événement','équipement','cours'] }, { key: 'level', label: 'Niveau', type: 'text' },
  ],
  food: [
    { key: 'foodType', label: 'Catégorie', type: 'select', options: ['restaurant','fast-food','épicerie','traiteur','boulangerie','pâtisserie','produit'], required: true }, { key: 'cuisine', label: 'Cuisine', type: 'text' }, { key: 'delivery', label: 'Livraison', type: 'boolean' },
  ],
  delivery: [
    { key: 'deliveryType', label: 'Type', type: 'select', options: ['colis','repas','courses','express','déménagement','transport'], required: true }, { key: 'vehicle', label: 'Véhicule', type: 'text' }, { key: 'sameDay', label: 'Même jour', type: 'boolean' },
  ],
  travel: [
    { key: 'destination', label: 'Destination', type: 'text', required: true }, { key: 'offerType', label: 'Type', type: 'select', options: ['vol','hôtel','séjour','circuit','location'], required: true }, { key: 'startDate', label: 'Départ', type: 'text' }, { key: 'endDate', label: 'Retour', type: 'text' }, { key: 'travelers', label: 'Voyageurs', type: 'number' },
  ],
};

export const universeMap: Record<UniverseId, { id: UniverseId; name: string; icon: string; desc: string }> = {
  immo: { id: 'immo', name: 'ImmoWin', icon: '🏠', desc: 'Immobilier : vente, location, terrains et locaux.' },
  auto: { id: 'auto', name: 'AutoWin', icon: '🚗', desc: 'Automobile : véhicules, motos et utilitaires.' },
  job: { id: 'job', name: 'JobWin', icon: '💼', desc: 'Emploi : offres, compétences et recrutement.' },
  market: { id: 'market', name: 'MarketWin', icon: '🛒', desc: 'Marché : produits, vendeurs et commerce.' },
  build: { id: 'build', name: 'BuildWin', icon: '🛠️', desc: 'Construction : artisans, services et projets.' },
  agri: { id: 'agri', name: 'AgriWin', icon: '🌾', desc: 'Agriculture : matériel, terrains, produits et services.' },
  travel: { id: 'travel', name: 'TravelWin', icon: '✈️', desc: 'Voyage : vols, hôtels, séjours et circuits.' },
  education: { id: 'education', name: 'EduWin', icon: '🎓', desc: 'Éducation : cours, formation, tutorat et orientation.' },
  health: { id: 'health', name: 'HealthWin', icon: '🩺', desc: 'Santé : services, rendez-vous, établissements et prévention.' },
  sport: { id: 'sport', name: 'SportWin', icon: '🏆', desc: 'Sport : clubs, coachs, salles, événements et équipements.' },
  food: { id: 'food', name: 'FoodWin', icon: '🍽️', desc: 'Food : restaurants, commerces alimentaires et traiteurs.' },
  delivery: { id: 'delivery', name: 'DeliveryWin', icon: '🛵', desc: 'Livraison : repas, colis, courses et transport express.' },
};

export function isUniverseId(value: string | null | undefined): value is UniverseId {
  return !!value && Object.prototype.hasOwnProperty.call(universeFields, value);
}

export function validateMetadata(universe: UniverseId, metadata: unknown): string[] {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return ['metadata doit être un objet.'];
  const source = metadata as Record<string, unknown>;
  const errors: string[] = [];
  for (const field of universeFields[universe]) {
    const value = source[field.key];
    if (field.required && (value === undefined || value === null || value === '')) errors.push(`${field.label} est requis.`);
    if (value === undefined || value === null || value === '') continue;
    if (field.type === 'number' && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) errors.push(`${field.label} doit être un nombre positif.`);
    if (field.type === 'boolean' && typeof value !== 'boolean') errors.push(`${field.label} doit être booléen.`);
    if (field.type === 'select' && field.options && !field.options.includes(String(value))) errors.push(`${field.label} contient une valeur invalide.`);
    if (field.type === 'text' && typeof value !== 'string') errors.push(`${field.label} doit être du texte.`);
  }
  return errors;
}
