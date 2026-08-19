import type { PaymentMode, PaymentProviderId } from '@/types/winswi';

export type PaymentProvider = {
  id: PaymentProviderId;
  name: string;
  mode: PaymentMode;
  countries: string[];
  currencies: string[];
  status: 'adapter-ready'|'provider-required'|'region-dependent';
  note: string;
};

export const paymentProviders: PaymentProvider[] = [
  { id:'cib', name:'CIB', mode:'local', countries:['DZ'], currencies:['DZD'], status:'provider-required', note:'Carte et paiement en ligne algérien; activation contractuelle avec l’écosystème bancaire.' },
  { id:'edahabia', name:'Edahabia', mode:'local', countries:['DZ'], currencies:['DZD'], status:'provider-required', note:'Paiement local Algérie Poste; activation/API à obtenir auprès du fournisseur.' },
  { id:'baridimob', name:'BaridiMob', mode:'mobile', countries:['DZ'], currencies:['DZD'], status:'provider-required', note:'Parcours mobile local, selon les services et interfaces officiellement disponibles.' },
  { id:'bank-transfer', name:'Virement bancaire', mode:'bank', countries:['*'], currencies:['DZD','EUR','USD','GBP','CAD'], status:'adapter-ready', note:'Instructions de virement + rapprochement manuel/automatique.' },
  { id:'cash-on-delivery', name:'Paiement à la livraison', mode:'cash', countries:['*'], currencies:['DZD','EUR','USD'], status:'adapter-ready', note:'Particulièrement adapté à Food/Market/Delivery lorsque le vendeur le permet.' },
  { id:'qr-local', name:'QR / paiement local', mode:'mobile', countries:['DZ'], currencies:['DZD'], status:'provider-required', note:'Connecteur QR abstrait pour fournisseurs locaux compatibles.' },
  { id:'visa-mastercard', name:'Visa / Mastercard', mode:'card', countries:['*'], currencies:['DZD','EUR','USD','GBP','CAD'], status:'adapter-ready', note:'Réseau carte; le prestataire acquéreur doit être activé par pays.' },
  { id:'stripe', name:'Stripe', mode:'international', countries:['FR','AE','GB','US','DE','ES','IT','CA'], currencies:['EUR','USD','GBP','CAD','AED'], status:'region-dependent', note:'Stripe n’est pas disponible comme compte marchand dans tous les pays; l’Algérie n’est pas dans la liste actuelle de pays supportés pour les comptes Stripe.' },
  { id:'paypal', name:'PayPal', mode:'international', countries:['*'], currencies:['EUR','USD','GBP','CAD'], status:'region-dependent', note:'Disponibilité des encaissements et retraits à vérifier selon le pays et le compte marchand.' },
  { id:'google-pay', name:'Google Pay', mode:'wallet', countries:['*'], currencies:['EUR','USD','GBP','DZD'], status:'region-dependent', note:'Wallet dépend du pays, de l’appareil, de la banque et du prestataire acquéreur.' },
  { id:'apple-pay', name:'Apple Pay', mode:'wallet', countries:['FR','MA','US','GB','CA','DE','ES','IT','AE'], currencies:['EUR','USD','GBP','CAD'], status:'region-dependent', note:'Dépend de la disponibilité Apple Pay et des cartes éligibles dans le pays.' },
  { id:'wise', name:'Wise', mode:'international', countries:['*'], currencies:['EUR','USD','GBP','CAD'], status:'region-dependent', note:'Virement/paiement selon les fonctionnalités disponibles dans le pays et le compte.' },
  { id:'payoneer', name:'Payoneer', mode:'international', countries:['*'], currencies:['EUR','USD','GBP'], status:'region-dependent', note:'Utilisable selon les services et l’éligibilité du compte marchand.' },
  { id:'crypto', name:'Crypto / stablecoins', mode:'crypto', countries:['*'], currencies:['USDC','USDT'], status:'region-dependent', note:'Option à activer uniquement après vérification juridique, fiscale et réglementaire du pays.' },
  { id:'sepa', name:'SEPA', mode:'bank', countries:['FR','DE','ES','IT','BE','NL','PT','AT','IE'], currencies:['EUR'], status:'provider-required', note:'Virements SEPA pour les marchés de la zone compatible.' },
  { id:'swift', name:'SWIFT / virement international', mode:'bank', countries:['*'], currencies:['EUR','USD','GBP','CAD'], status:'adapter-ready', note:'Rail bancaire international; délais et frais selon banques correspondantes.' },
  { id:'regional-wallet', name:'Wallet régional', mode:'wallet', countries:['*'], currencies:['*'], status:'provider-required', note:'Adaptateur générique pour wallets locaux à brancher par marché.' },
  { id:'regional-qr', name:'QR régional', mode:'mobile', countries:['*'], currencies:['*'], status:'provider-required', note:'Adaptateur pour réseaux QR locaux (ex. rails nationaux) selon le pays.' },
  { id:'regional-bank-rail', name:'Rail bancaire régional', mode:'bank', countries:['*'], currencies:['*'], status:'provider-required', note:'Adaptateur pour rails nationaux/régionaux tels que Pix, UPI ou autres selon marché.' },
];

export function providersForCountry(country: string) {
  const code = country.toUpperCase();
  return paymentProviders.filter(p => p.countries.includes('*') || p.countries.includes(code));
}
