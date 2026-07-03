import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = ['src/App.jsx', 'src/styles.css', 'README.md'];
const corpus = files
  .map((file) => readFileSync(resolve(root, file), 'utf8'))
  .join('\n');

const required = [
  '幸福管家',
  'resident',
  'admin',
  'data-action="submit-resident-request"',
  'data-action="ask-ai-question"',
  'data-action="convert-ai-answer-to-request"',
  'data-action="dispatch-request"',
  'data-action="complete-request"',
  'AI小福',
  '数据概览',
  '诉求管理',
  'V2整理版',
  '自由咨询',
  'AI生成诉求',
  'AI协同闭环',
];

const forbidden = [
  'data-route="enterprise"',
  'data-action="submit-enterprise-application"',
  'enterprise',
  '企业',
  '在线申报',
  '便民服务',
  '生活缴费',
  '社区活动',
  '邻里互助',
  '更多服务',
];

const missing = required.filter((needle) => !corpus.includes(needle));
const presentForbidden = forbidden.filter((needle) => corpus.includes(needle));

if (missing.length || presentForbidden.length) {
  console.error('Prototype smoke test failed.');
  if (missing.length) {
    console.error('Missing required hooks/copy:');
    for (const item of missing) console.error(`- ${item}`);
  }
  if (presentForbidden.length) {
    console.error('Forbidden removed-scope hooks/copy still present:');
    for (const item of presentForbidden) console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Prototype smoke test passed. Checked ${files.length} files and ${required.length} required hooks/copy items.`);
