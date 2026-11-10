// task-types.ts – a first look at TypeScript (Day 3)
type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;      // '' or 'YYYY-MM-DD'
}

const ok: Task = { id: 'a1', title: 'Finish Day 3', priority: 'high', status: 'todo', dueDate: '' };

// A deliberate mistake: 'urgent' is not an allowed priority
const wrong: Task = { id: 'a2', title: 'Call Ben', priority: 'urgent', status: 'todo', dueDate: '' };
