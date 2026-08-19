export type UniverseId =
  | 'immo'
  | 'auto'
  | 'job'
  | 'market'
  | 'build'
  | 'agri'
  | 'travel'
  | 'education'
  | 'health'
  | 'sport'
  | 'food'
  | 'delivery';

export type Locale = 'fr' | 'ar' | 'en';

export type PaymentMode = 'sandbox' | 'live' | 'local' | 'mobile' | 'bank' | 'cash' | 'card' | 'international' | 'wallet' | 'crypto';

export type PaymentProviderId =
  | 'chargily'
  | 'stripe'
  | 'satim'
  | 'cib'
  | 'edahabia'
  | 'baridimob'
  | 'bank-transfer'
  | 'cash-on-delivery'
  | 'qr-local'
  | 'visa-mastercard'
  | 'paypal'
  | 'google-pay'
  | 'apple-pay'
  | 'wise'
  | 'payoneer'
  | 'crypto'
  | 'sepa'
  | 'swift'
  | 'regional-wallet'
  | 'regional-qr'
  | 'regional-bank-rail';

export interface Listing {
  id: string;
  universe: UniverseId;
  title: string;
  location?: string;
  price?: number;
  currency?: string;
  description: string;
  verified?: boolean;
  tags?: string[];
  wilaya?: string;
  commune?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface AIResponse {
  provider: 'local' | 'gemini';
  universe?: UniverseId;
  text?: string;
  results?: Listing[];
  actions?: Array<{
    type: string;
    label: string;
    payload?: Record<string, unknown>;
  }>;
}

export interface MatchScoreResult {
  score: number;
  matchingCriteria: string[];
  missingCriteria: string[];
  explanation: string;
}

export interface OpportunityItem {
  id: string;
  universe: UniverseId;
  title: string;
  category?: string;
  price?: number;
  currency?: string;
  opportunityScore: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'INDICATIVE';
  reason: string;
}









