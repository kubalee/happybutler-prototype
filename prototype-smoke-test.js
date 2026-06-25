import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['src/App.jsx', 'src/styles.css'];
const corpus = files
  .map((file) => readFileSync(resolve(root, file), 'utf8'))
  .join('\n');

const required = [
  '幸福管家',
  'resident',
  'enterprise',
  'admin',
  'data-action="submit-resident-request"',
  'data-action="ask-ai-question"',
  'data-action="convert-ai-answer-to-request"',
  'data-action="dispatch-request"',
  'data-action="complete-request"',
  'data-action="submit-enterprise-application"',
  'AI小福',
  '数据概览',
  '诉求管理',
];

const missing = required.filter((needle) => !corpus.includes(needle));

if (missing.length) {
  console.error('Prototype smoke test failed. Missing required hooks/copy:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Prototype smoke test passed. Checked ${files.length} files and ${required.length} required hooks/copy items.`);
