// weekly-digest.js – the Weekly Digest Assistant (Milestone 1 mini-project).
// Usage: node tools/weekly-digest.js data/tasks-export.json [YYYY-MM-DD]
// It reads exported tasks, groups them, writes a Markdown digest and adds
// one line to a run log so you can measure how often it runs.
import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync } from 'node:fs';
import { sortTasks, summarise } from '../src/tasks.js';

const started = Date.now();
const inputPath = process.argv[2] || 'data/tasks-export.json';
// An optional fixed date makes the result repeatable for tests and screenshots.
const today = process.argv[3] || new Date().toISOString().slice(0, 10);

// Stop with a clear message if the export file is missing.
if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}\n` +
    'Export your tasks from the app first (Export JSON button).');
  process.exit(1);
}

// Read the file. If it is not a JSON list, stop safely.
let tasks;
try {
  tasks = JSON.parse(readFileSync(inputPath, 'utf8'));
  if (!Array.isArray(tasks)) throw new Error('Expected a JSON array of tasks.');
} catch (err) {
  console.error(`Could not read tasks: ${err.message}`);
  process.exit(1);
}

// Work out the last day of the 7-day window, as text like 2026-11-16.
const weekAhead = new Date(today);
weekAhead.setDate(weekAhead.getDate() + 7);
const weekEnd = weekAhead.toISOString().slice(0, 10);
const inWeek = d => d && d >= today && d <= weekEnd;

// Group the open tasks. Dates are YYYY-MM-DD text, so text comparison works.
const open = sortTasks(tasks).filter(t => t.status !== 'done');
const overdue = open.filter(t => t.dueDate && t.dueDate < today);
const dueThisWeek = open.filter(t => inWeek(t.dueDate));
const highNoDate = open.filter(t => t.priority === 'high' && !t.dueDate);
const done = tasks.filter(t => t.status === 'done');
const s = summarise(tasks);

// One Markdown bullet per task, and one headed section per group.
const line = t => `- [${t.priority.toUpperCase()}] ${t.title}` +
  (t.dueDate ? ` (due ${t.dueDate})` : '');
const section = (title, items) => `## ${title} (${items.length})\n` +
  (items.length ? items.map(line).join('\n') : '- Nothing here.') + '\n';

const digest = [
  `# Weekly Digest – week starting ${today}`,
  '',
  `Open: ${s.open} | Done: ${s.done} | High-priority open: ${s.high} | Total: ${s.total}`,
  '',
  section('Overdue – do these first', overdue),
  section('Due in the next 7 days', dueThisWeek),
  section('High priority with no due date – schedule these', highNoDate),
  section('Completed', done),
].join('\n');

// Save the digest file.
mkdirSync('reports/digests', { recursive: true });
const outPath = `reports/digests/digest-${today}.md`;
writeFileSync(outPath, digest);

// Add one line to the run log: time, input, counts, and run time in ms.
const ms = Date.now() - started;
appendFileSync('reports/digest-run-log.csv',
  `${new Date().toISOString()},${inputPath},${tasks.length},` +
  `${overdue.length},${dueThisWeek.length},${ms}\n`);

console.log(digest);
console.log(`\nSaved ${outPath} in ${ms} ms. Run logged to reports/digest-run-log.csv`);
