import { GoogleGenAI } from '@google/genai';
import { searchListings } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import type { AIResponse, Listing, UniverseId } from '@/types/winswi';

const detect = (q: string): UniverseId | undefined => {
  const s = q.toLocaleLowerCase('fr-DZ');
  if (/appartement|maison|villa|terrain|f[2-9]\b|immobilier|logement|location|vente/.test(s)) return 'immo';
  if (/voiture|auto|toyota|renault|peugeot|véhicule|moto/.test(s)) return 'auto';
  if (/emploi|job|travail|développeur|recrut|poste|cdi/.test(s)) return 'job';
  if (/produit|acheter|market|écran|téléphone|commerce/.test(s)) return 'market';
  if (/construction|bâtiment|plombier|électricien|artisan|travaux/.test(s)) return 'build';
  if (/agri|agricole|ferme|irrigation|tracteur/.test(s)) return 'agri';
  if (/voyage|turquie|hôtel|séjour|vol|vacances/.test(s)) return 'travel';
  if (/éducation|formation|cours|école|université|tutorat|certification/.test(s)) return 'education';
  if (/santé|médecin|clinique|pharmacie|hôpital|rendez-vous médical/.test(s)) return 'health';
  if (/sport|football|fitness|gym|coach|salle/.test(s)) return 'sport';
  if (/restaurant|repas|food|pizza|boulangerie|traiteur/.test(s)) return 'food';
  if (/livraison|colis|coursier|transport express/.test(s)) return 'delivery';
  return undefined;
};

async function databaseResults(question: string, universe?: UniverseId): Promise<Listing[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return searchListings({ universe, q: question });
  try {
    const supabase = await createClient();
    let query = supabase.from('listings').select('id,universe,title,description,location,price,currency,verified,wilaya,commune').eq('status','active').limit(20);
    if (universe) query = query.eq('universe', universe);
    const clean = question.replace(/[%_,()]/g, ' ').trim();
    if (clean) query = query.or(`title.ilike.%${clean}%,description.ilike.%${clean}%,location.ilike.%${clean}%,wilaya.ilike.%${clean}%,commune.ilike.%${clean}%`);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((x) => ({ ...x, location: x.location ?? ([x.commune, x.wilaya].filter(Boolean).join(', ') || 'Algérie') })) as Listing[];
  } catch (e) {
    console.error('AI database search failed', e);
    return searchListings({ universe, q: question });
  }
}

export async function askWinsWi(question: string): Promise<AIResponse> {
  const universe = detect(question);
  const results = await databaseResults(question, universe);
  const local: AIResponse = results.length ? {
    provider: 'local', universe, results,
    text: `J’ai identifié ${universe ?? 'plusieurs'} comme univers pertinent et trouvé ${results.length} résultat(s) disponibles dans WinsWi.`,
    actions: [{ type: 'search', label: 'Voir les résultats', payload: { universe: universe ?? 'all' } }],
  } : { provider: 'local', universe, text: universe ? `J’ai identifié ${universe}, mais aucune annonce active ne correspond aux données disponibles.` : 'Je peux rechercher, comparer ou vous aider à créer une demande. Précisez ce que vous cherchez.' };

  const key = process.env.GEMINI_API_KEY;
  if (!key) return local;
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const context = results.map((x) => `${x.id} | ${x.universe} | ${x.title} | ${x.location} | ${x.price ?? ''} ${x.currency ?? ''} | ${x.description}`).join('\n') || 'Aucun résultat.';
    const prompt = ['Tu es WinsWi AI, assistant natif d’une super-app algérienne.', 'Réponds dans la langue de la question (français, العربية ou English).', 'Tu ne dois jamais inventer une annonce, un prix, une disponibilité ou une action.', `Univers détecté: ${universe ?? 'global'}.`, `Annonces réelles actuellement accessibles:\n${context}`, `Question: ${question}`, 'Réponds de façon concise et propose la prochaine action utile.'].join('\n\n');
    const response = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: prompt });
    const text = response.text?.trim();
    if (text) return { ...local, provider: 'gemini', text };
  } catch (error) { console.error('WinsWi AI provider error', error); }
  return local;
}
