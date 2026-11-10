// Run with: npm test   (Node's built-in test runner, no installs needed)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTask, createTask, updateTask, deleteTask, sortTasks,
  loadTasks, saveTasks, STORAGE_KEY,
} from '../src/tasks.js';

// A fake localStorage, so the tests can run outside the browser.
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: k => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    data,
  };
}

// POSITIVE: valid input works. The title is trimmed and defaults are filled in.
test('positive: creates a valid task with defaults', () => {
  const { tasks, errors } = createTask([], { title: ' Read chapter 1 ' });
  assert.deepEqual(errors, []);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].title, 'Read chapter 1');
  assert.equal(tasks[0].priority, 'medium');
  assert.equal(tasks[0].status, 'todo');
});

// NEGATIVE: invalid input is refused and the list stays unchanged.
test('negative: rejects an empty title', () => {
  const { tasks, errors } = createTask([], { title: ' ' });
  assert.equal(tasks.length, 0);
  assert.deepEqual(errors, ['Title is required.']);
});

test('negative: rejects an invalid priority and a badly formatted date', () => {
  const errors = validateTask({ title: 'x', priority: 'urgent', dueDate: '31/12/2026' });
  assert.equal(errors.length, 2);   // one error for each bad field
});

// BOUNDARY: test the exact edge of the rule. 120 is allowed, 121 is not.
test('boundary: 120 characters is accepted, 121 is rejected', () => {
  assert.deepEqual(validateTask({ title: 'a'.repeat(120) }), []);
  assert.equal(validateTask({ title: 'a'.repeat(121) }).length, 1);
});

test('update: marks a task done and keeps other fields', () => {
  const created = createTask([], { title: 'Lab', priority: 'high' }).tasks;
  const { tasks } = updateTask(created, created[0].id, { status: 'done' });
  assert.equal(tasks[0].status, 'done');
  assert.equal(tasks[0].priority, 'high');
});

test('update: an unknown id returns an error and changes nothing', () => {
  const { tasks, errors } = updateTask([], 'nope', { status: 'done' });
  assert.deepEqual(errors, ['Task not found.']);
  assert.equal(tasks.length, 0);
});

test('delete: removes only the chosen task', () => {
  let list = createTask([], { title: 'A' }).tasks;
  list = createTask(list, { title: 'B' }).tasks;
  const after = deleteTask(list, list[0].id);
  assert.deepEqual(after.map(t => t.title), ['B']);
});

test('sort: open high-priority tasks come first, done tasks last', () => {
  const list = [
    { id: '1', title: 'done high', priority: 'high', status: 'done', dueDate: '' },
    { id: '2', title: 'open low', priority: 'low', status: 'todo', dueDate: '' },
    { id: '3', title: 'open high', priority: 'high', status: 'todo', dueDate: '2026-12-01' },
  ];
  assert.deepEqual(sortTasks(list).map(t => t.id), ['3', '2', '1']);
});

// PERSISTENCE: save, then load from the same fake storage.
test('persistence: saved tasks survive a reload', () => {
  const storage = fakeStorage();
  const { tasks } = createTask([], { title: 'Persist me' });
  saveTasks(storage, tasks);
  assert.equal(loadTasks(storage)[0].title, 'Persist me');
});

test('persistence: corrupted storage does not crash the app', () => {
  const storage = fakeStorage({ [STORAGE_KEY]: '{not json' });
  assert.deepEqual(loadTasks(storage), []);
});
