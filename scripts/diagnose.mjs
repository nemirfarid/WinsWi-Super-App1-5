import { spawnSync } from 'node:child_process';

const steps = [
  ['verify-install', 'npm', ['run', 'verify-install']],
  ['verify', 'npm', ['run', 'verify']],
  ['typecheck', 'npm', ['run', 'typecheck']],
  ['lint', 'npm', ['run', 'lint']],
  ['build', 'npm', ['run', 'build']],
];

let failed = false;
for (const [name, command, args] of steps) {
  console.log(`\n=== ${name} ===`);
  const r = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    failed = true;
    console.error(`FAILED: ${name}`);
    break;
  }
}
process.exit(failed ? 1 : 0);
