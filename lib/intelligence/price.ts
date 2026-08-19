export type PriceObservation = { price: number; currency: string; sourceTrust?: number };

export function marketRange(observations: PriceObservation[]) {
  const values = observations.filter((x) => Number.isFinite(x.price) && x.price > 0).map((x) => x.price).sort((a, b) => a - b);
  if (!values.length) return null;
  const median = values[Math.floor(values.length / 2)];
  const low = values[Math.max(0, Math.floor(values.length * 0.25))];
  const high = values[Math.min(values.length - 1, Math.floor(values.length * 0.75))];
  return { low, median, high, samples: values.length };
}

export function pricePosition(price: number, range: { low: number; median: number; high: number }) {
  if (price <= range.low) return 'opportunity';
  if (price >= range.high) return 'above-market';
  return 'market';
}
