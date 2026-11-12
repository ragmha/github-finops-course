// Runs every lab's jq solution against the generated sample data and
// verifies the in-browser answer checker accepts it. Usage: node test.mjs [data]
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const ctx = { module: {} };
vm.runInNewContext(core, ctx);
const Core = ctx.module.exports;

const data = Core.build();
const gen = process.argv[2] === 'data'; // `node test.mjs data` writes the lab files to ./lab and stops
const dir = gen ? 'lab' : mkdtempSync(join(tmpdir(), 'finops-'));
mkdirSync(dir, { recursive: true });
for (const [f, v] of Object.entries(data)) writeFileSync(join(dir, f), JSON.stringify(v, null, 2));
if (gen) { console.log(`Lab files written to ./${dir}: ${Object.keys(data).join(', ')}`); process.exit(0); }
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));

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
for (const lab of Core.labs) if (lab.real) execFileSync('bash', ['-n'], { input: lab.real });
console.log('✓ all step commands run');

const usage = data['usage.json'].usageItems;
const ai = data['ai-usage.json'].usageItems;
const fieldSum = (rows, field) => rows.reduce((total, row) => total + row[field], 0);
const cents = (rows, field) => Math.round(fieldSum(rows, field) * 100);
const seats = usage.filter(row => row.sku === 'copilot_for_business');
const aiOnBill = usage.filter(row => row.sku === 'copilot_ai_credit');
assert.equal(fieldSum(seats, 'quantity'), 85);
assert.equal(fieldSum(ai, 'discountQuantity'), fieldSum(seats, 'quantity') * 1900);
assert.equal(fieldSum(aiOnBill, 'quantity'), fieldSum(ai, 'grossQuantity'));
for (const field of ['grossAmount', 'discountAmount', 'netAmount']) assert.equal(cents(aiOnBill, field), cents(ai, field));
assert.equal(cents(usage.filter(row => row.unitType === 'minutes'), 'discountAmount'), 30000);
for (const [sku, monthlyRate] of [['actions_storage', .25], ['packages_storage', .25], ['codespaces_storage', .07]]) {
  assert.ok(Math.abs(usage.find(row => row.sku === sku).pricePerUnit * 720 - monthlyRate) < 1e-10);
}
assert.ok(usage.every(row => Math.round((row.grossAmount - row.discountAmount) * 100) === Math.round(row.netAmount * 100)));

const actions = Core.labs.find(lab => lab.id === 'actions');
const hotspots = execSync(actions.steps.find(step => step.cmd?.includes('sort_by(-.net)')).cmd, { cwd: dir, encoding: 'utf8' });
assert.ok(JSON.parse(hotspots).some(row => row.repo === 'acme-platform/sdk-ios'));
const storage = Core.labs.find(lab => lab.id === 'storage');
const storageRows = execSync(storage.steps.find(step => step.cmd?.includes('ml-models')).cmd, { cwd: dir, encoding: 'utf8' }).trim().split('\n');
assert.equal(storageRows.length, 5);
assert.ok(Number(storageRows[4].split(' ')[1]) > Number(storageRows[0].split(' ')[1]));
const audit = Core.labs.find(lab => lab.id === 'guardrails');
const auditOutput = execSync(audit.steps.find(step => step.cmd?.includes('todate')).cmd, { cwd: dir, encoding: 'utf8' });
assert.match(auditOutput, /org\.set_default_workflow_permissions/);

const alert = Core.labs.find(lab => lab.id === 'alert');
const scriptOutput = execFileSync('bash', ['-s'], { cwd: dir, input: alert.steps.find(step => step.cmd?.startsWith('#!')).cmd, encoding: 'utf8' });
const flagged = Array.from(scriptOutput.matchAll(/⚠️\s+([^:]+):/gu), match => match[1]).sort();
const expected = execSync(alert.solution, { cwd: dir, encoding: 'utf8' }).trim().split('\n').sort();
assert.ok(flagged.length > 0);
assert.deepEqual(flagged, expected);
console.log('✓ sample assumptions and budget script');
process.exit(fail ? 1 : 0);
