// Runs every lab's jq solution against the generated sample data and
// verifies the in-browser answer checker accepts it. Usage: node test.mjs
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const ctx = { module: {} };
vm.runInNewContext(core, ctx);
const Core = ctx.module.exports;

const data = Core.build();
const dir = mkdtempSync(join(tmpdir(), 'finops-'));
for (const [f, v] of Object.entries(data)) writeFileSync(join(dir, f), JSON.stringify(v, null, 2));

let fail = 0;
for (const lab of Core.labs) {
  const out = execSync(lab.solution, { cwd: dir, shell: '/bin/bash' }).toString().trim();
  const input = lab.type === 'list' ? out.split('\n').join(',') : out.replace(/^"|"$/g, '');
  const ok = Core.check(lab, input, data) && !Core.check(lab, lab.type === 'number' ? String(Number(input) * 1.1 + 1) : 'nope', data);
  console.log(`${ok ? '✓' : '✗'} ${lab.id.padEnd(9)} jq=${input}  expected=${lab.answer(data)}`);
  if (!ok) fail++;
}
// Each step command must also run cleanly.
for (const lab of Core.labs) for (const st of lab.steps) if (st.cmd && !st.cmd.startsWith('#!')) execSync(st.cmd, { cwd: dir, shell: '/bin/bash', stdio: 'ignore' });
console.log('✓ all step commands run');
process.exit(fail ? 1 : 0);
