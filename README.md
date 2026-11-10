# Spark Tasks – Personal Productivity App (Milestone 1)

A beginner-friendly task organiser built during Days 1–5 of *From Spark to Summit*.
It runs entirely in your browser. Your tasks are saved in the browser's `localStorage`,
so nothing leaves your computer.

## Features (mapped to the PRD)
| PRD criterion | Feature | Where to check |
|---|---|---|
| AC-01 | Add a task with a title, priority and optional due date | Form at the top of the page |
| AC-02 | Empty or over-long titles are rejected with a clear message | Try adding an empty task |
| AC-03 | Mark a task done / reopen it | Checkbox on each task card |
| AC-04 | Edit a task title | "Edit" button |
| AC-05 | Delete a task after confirmation | "Delete" button |
| AC-06 | Tasks survive a page refresh | Add a task, press F5 |
| AC-07 | Filter All / Open / Done | Buttons in the top bar |
| AC-08 | Layout works at 390 px (phone) and 1280 px (laptop) | Browser DevTools device toolbar |
| AC-09 | Export tasks as JSON for the Weekly Digest | "Export JSON" button |

## Run it
Requires Node.js LTS (only for the test runner, the local server and the digest tool).
```
npm start          # serves src/ at http://localhost:5500
npm test           # runs tests/tasks.test.js with Node's built-in test runner
npm run digest -- data/sample/tasks-export.json
```

## Folder layout
```
src/       the app (index.html, styles.css, tasks.js, app.js)
tests/     automated tests
tools/     weekly-digest.js (Weekly Digest Assistant) and run-digest.ps1 (scheduler)
examples/  task-types.ts (Day 3 TypeScript preview)
.github/   workflows/pages.yml (tests, then GitHub Pages preview)
docs/      problem brief, PRD, model comparison, setup guide, value metrics, peer review
prompts/   prompt portfolio (prompt, response summary, weakness, revision)
evidence/  your genuine screenshots and test logs
reports/   generated digests and the digest run log
```

## Known limitations
- Data lives in one browser on one computer. Clearing site data deletes it. Use Export JSON as a backup.
- No accounts, no sync, no reminders. These arrive in later milestones.
- Deployment: a local preview (`npm start`) is not a public deployment. See Day 5 for the optional GitHub Pages route.
