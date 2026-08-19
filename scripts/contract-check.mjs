import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const required = ['immo','auto','job','market','build','agri','travel','education','health','sport','food','delivery'];
const universeFile = fs.readFileSync(path.join(root, 'lib', 'universes.ts'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '0015_global_opportunity_social.sql'), 'utf8');
const missing = required.filter((x) => !universeFile.includes(`id: '${x}'`));
if (missing.length) throw new Error(`Universes missing: ${missing.join(', ')}`);
for (const table of ['external_sources','external_listings','opportunity_matches','social_connections','social_publications']) {
  if (!migration.includes(`create table if not exists public.${table}`)) throw new Error(`Missing table: ${table}`);
}
for (const file of [
  'app/api/ai/voice/route.ts',
  'app/api/payments/route.ts',
  'app/api/preferences/route.ts',
  'app/api/opportunities/score/route.ts',
  'app/api/social/content/route.ts',
  'lib/intelligence/opportunity.ts',
  'lib/intelligence/price.ts',
  'lib/intelligence/trust.ts',
  'lib/social/connectors.ts',
]) if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
console.log('Contract check OK: 12 universes, AI/voice, payments, preferences, opportunity intelligence, trust/price engines and social adapters are present.');
