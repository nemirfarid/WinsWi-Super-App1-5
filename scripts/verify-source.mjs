import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) files.push(full);
  }
}
walk(root);
const imports = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:from\s+|import\s*\()(['"])(@\/[^'"]+)\1/g)) imports.push([file, match[2]]);
}
const missing = [];
for (const [file, spec] of imports) {
  const rel = spec.slice(2);
  const candidates = ['.ts','.tsx','.js','.jsx'].map(ext => path.join(root, rel + ext));
  candidates.push(path.join(root, rel, 'index.ts'), path.join(root, rel, 'index.tsx'));
  if (!candidates.some(fs.existsSync)) missing.push(`${path.relative(root,file)} -> ${spec}`);
}
if (missing.length) {
  console.error('Missing local imports:');
  console.error(missing.join('\n'));
  process.exit(1);
}
console.log(`Source check OK: ${files.length} source files, no missing @/ imports.`);
