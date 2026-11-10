// app.js – connects the page (index.html) to the rules in tasks.js.
import {
  createTask, updateTask, deleteTask, sortTasks, summarise,
  loadTasks, saveTasks,
} from './tasks.js';

let tasks = loadTasks(window.localStorage);   // start with any saved tasks
let filter = 'all';                           // which filter button is active

// Find the page elements once.
const form = document.getElementById('task-form');
const errorsBox = document.getElementById('form-errors');
const list = document.getElementById('task-list');
const empty = document.getElementById('empty');
const stats = document.getElementById('stats');

// Every change goes through commit(): store the new list, save it, redraw.
function commit(newTasks) {
  tasks = newTasks;
  saveTasks(window.localStorage, tasks);      // persist after every change
  render();
}

// CREATE: runs when the form is submitted.
form.addEventListener('submit', (event) => {
  event.preventDefault();                          // do not reload the page
  const data = Object.fromEntries(new FormData(form));  // read all form fields
  const result = createTask(tasks, data);
  errorsBox.textContent = result.errors.join(' '); // show problems, if any
  if (result.errors.length === 0) {
    form.reset();
    commit(result.tasks);
  }
});

// FILTER: highlight the clicked button and redraw with that filter.
document.querySelectorAll('.filter[data-filter]').forEach(btn =>
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter[data-filter]')
      .forEach(b => b.classList.toggle('active', b === btn));
    render();
  }));

// EXPORT (Day 5): download all tasks as a JSON file for the Weekly Digest.
document.getElementById('export').addEventListener('click', () => {
  const json = JSON.stringify(tasks, null, 2);          // readable JSON text
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tasks-export.json';
  link.click();                                          // start the download
  URL.revokeObjectURL(link.href);
});

// READ: draw the summary and the visible tasks from the data.
function render() {
  const s = summarise(tasks);
  stats.innerHTML = '';
  for (const [label, value] of [['Open', s.open], ['Done', s.done],
                                ['High priority', s.high], ['Total', s.total]]) {
    const box = document.createElement('div');
    box.innerHTML = '<dt></dt><dd></dd>';   // fixed markup, no user text
    box.querySelector('dt').textContent = label;
    box.querySelector('dd').textContent = value;
    stats.appendChild(box);
  }

  // Keep only the tasks that match the active filter.
  const visible = sortTasks(tasks).filter(t =>
    filter === 'all' || (filter === 'done' ? t.status === 'done'
                                           : t.status !== 'done'));
  empty.hidden = visible.length > 0;        // show the empty-state message
  list.innerHTML = '';

  for (const task of visible) {
    const li = document.createElement('li');
    li.className = 'task' + (task.status === 'done' ? ' done' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.status === 'done';
    check.setAttribute('aria-label', `Mark "${task.title}" as done`);
    check.addEventListener('change', () => {          // UPDATE (complete)
      commit(updateTask(tasks, task.id,
        { status: check.checked ? 'done' : 'todo' }).tasks);
    });

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title;         // textContent keeps typed text safe

    const badge = document.createElement('span');
    badge.className = `badge ${task.priority}`;
    badge.textContent = task.priority;      // text as well as colour

    const due = document.createElement('span');
    due.className = 'due';
    due.textContent = task.dueDate ? `Due ${task.dueDate}` : 'No due date';

    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => {            // UPDATE (edit title)
      const newTitle = window.prompt('Edit task title', task.title);
      if (newTitle === null) return;                  // Cancel was pressed
      const result = updateTask(tasks, task.id, { title: newTitle });
      if (result.errors.length) { alert(result.errors.join(' ')); return; }
      commit(result.tasks);
    });

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', () => {             // DELETE
      if (window.confirm(`Delete "${task.title}"?`)) {
        commit(deleteTask(tasks, task.id));
      }
    });

    li.append(check, title, badge, due, edit, del);
    list.appendChild(li);
  }
}

render();   // draw the page once when it loads
