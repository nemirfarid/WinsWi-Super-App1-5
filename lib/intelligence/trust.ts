export type TrustSignals = {
  identityVerified?: boolean;
  phoneVerified?: boolean;
  businessVerified?: boolean;
  accountAgeDays?: number;
  responseRate?: number;
  successfulTransactions?: number;
  disputeRate?: number;
  suspiciousSignals?: number;
};

export function trustScore(s: TrustSignals) {
  let score = 50;
  if (s.identityVerified) score += 12;
  if (s.phoneVerified) score += 8;
  if (s.businessVerified) score += 10;
  score += Math.min(8, Math.max(0, (s.accountAgeDays ?? 0) / 180));
  score += Math.min(7, Math.max(0, (s.responseRate ?? 0) / 14));
  score += Math.min(8, Math.log10((s.successfulTransactions ?? 0) + 1) * 4);
  score -= Math.min(20, (s.disputeRate ?? 0) * 20);
  score -= Math.min(25, (s.suspiciousSignals ?? 0) * 8);
  return Math.round(Math.max(0, Math.min(100, score)));
}
