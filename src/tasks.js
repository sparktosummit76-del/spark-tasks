// tasks.js – the rules for tasks. There is no HTML in this file, so Node.js
// can test it directly (Day 5).

export const PRIORITIES = ['low', 'medium', 'high'];
export const STATUSES = ['todo', 'in-progress', 'done'];
export const MAX_TITLE = 120;   // longest title the app accepts

// Check a task and return a list of problems in plain English.
// An empty list means the task is valid.
export function validateTask(input) {
  const errors = [];
  const title = (input.title ?? '').trim();   // missing title counts as empty

  if (title.length === 0) errors.push('Title is required.');
  if (title.length > MAX_TITLE) {
    errors.push(`Title must be ${MAX_TITLE} characters or fewer.`);
  }
  if (input.priority && !PRIORITIES.includes(input.priority)) {
    errors.push('Priority must be low, medium or high.');
  }
  if (input.status && !STATUSES.includes(input.status)) {
    errors.push('Status must be todo, in-progress or done.');
  }
  // A due date is optional, but when present it must look like 2026-12-31
  // and be a real calendar date.
  const looksLikeDate = /^\d{4}-\d{2}-\d{2}$/;
  if (input.dueDate && !looksLikeDate.test(input.dueDate)) {
    errors.push('Due date must look like 2026-12-31.');
  }
  if (input.dueDate && looksLikeDate.test(input.dueDate)
      && Number.isNaN(Date.parse(input.dueDate))) {
    errors.push('Due date is not a real date.');
  }
  return errors;
}

// CREATE: return a new list that includes the new task.
// If the input is invalid, return the old list and the errors instead.
export function createTask(tasks, input, now = new Date()) {
  const errors = validateTask(input);
  if (errors.length) return { tasks, errors };

  const task = {
    id: now.getTime().toString(36) + Math.random().toString(36).slice(2, 6),
    title: input.title.trim(),
    priority: input.priority || 'medium',   // default when none is chosen
    status: input.status || 'todo',
    dueDate: input.dueDate || '',
    createdAt: now.toISOString(),
  };
  // [...tasks, task] copies the old list and adds the new task at the end,
  // so the old list is never changed.
  return { tasks: [...tasks, task], errors: [] };
}

// UPDATE: change some fields of one task, after checking the result is valid.
export function updateTask(tasks, id, changes) {
  const existing = tasks.find(t => t.id === id);
  if (!existing) return { tasks, errors: ['Task not found.'] };

  const merged = { ...existing, ...changes };   // changes overwrite old values
  const errors = validateTask(merged);
  if (errors.length) return { tasks, errors };

  merged.title = merged.title.trim();
  return { tasks: tasks.map(t => (t.id === id ? merged : t)), errors: [] };
}

// DELETE: return a list without the task that has this id.
export function deleteTask(tasks, id) {
  return tasks.filter(t => t.id !== id);
}

// Sort for display: unfinished first, then high priority first,
// then the earliest due date. Tasks with no date go last.
export function sortTasks(tasks) {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) =>
    (a.status === 'done') - (b.status === 'done') ||
    rank[a.priority] - rank[b.priority] ||
    (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31'));
}

// Count tasks for the Summary card.
export function summarise(tasks) {
  return {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    open: tasks.filter(t => t.status !== 'done').length,
    high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
  };
}

// PERSISTENCE (Day 5). `storage` is window.localStorage in the browser
// and a fake object in the tests.
export const STORAGE_KEY = 'spark.tasks.v1';

export function loadTasks(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);          // text, or null
    const data = raw ? JSON.parse(raw) : [];           // text -> JavaScript
    return Array.isArray(data) ? data : [];
  } catch {
    return [];   // damaged data: start with an empty list, do not crash
  }
}

export function saveTasks(storage, tasks) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks)); // JavaScript -> text
}
