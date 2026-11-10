# Mini-PRD – Spark Tasks v1 (Days 3–4)

## 1. Problem statement
Busy learners lose track of small tasks and deadlines. Spark Tasks gives them one fast, private list
with priorities and due dates, and a weekly digest of what matters next.

## 2. Personas
- **Asha (primary)** – 24, part-time student and shop assistant. Uses a mid-range Windows laptop and an Android phone. Wants speed and privacy.
- **Ben (secondary)** – 38, career-changer learning to code in the evenings. Wants a clear weekly plan.

## 3. User stories
- US-01 As Asha, I want to add a task with a priority and due date so that I remember it.
- US-02 As Asha, I want to be told clearly when my input is wrong so that I can fix it.
- US-03 As Asha, I want to tick a task as done so that I can see progress.
- US-04 As Asha, I want to edit a task title so that I can correct mistakes.
- US-05 As Asha, I want to delete a task so that my list stays clean.
- US-06 As Ben, I want my tasks to still be there tomorrow so that I can trust the app.
- US-07 As Ben, I want to filter open and done tasks so that I can focus.
- US-08 As Asha, I want the app to work on my phone screen so that I can use it anywhere.
- US-09 As Ben, I want a weekly digest so that I can plan Monday morning in minutes.

## 4. Scope
In scope: US-01 to US-09. Out of scope: accounts, sync, reminders, AI features, collaboration.

## 5. Functional requirements and acceptance criteria
| ID | Given / When / Then | Story |
|---|---|---|
| AC-01 | Given the form, when I enter "Buy milk", priority High and a date, then the task appears at the top of the open list. | US-01 |
| AC-02 | When I submit an empty title or one longer than 120 characters, then no task is created and a red message explains why. | US-02 |
| AC-03 | When I tick a task, then it moves to the done group and the Summary counts update. | US-03 |
| AC-04 | When I edit a title to a valid value, then the new title is shown; an empty edit is rejected. | US-04 |
| AC-05 | When I click Delete and confirm, then only that task is removed. | US-05 |
| AC-06 | When I refresh the page, then all tasks and their status are still there. | US-06 |
| AC-07 | When I choose Open or Done, then only matching tasks are listed. | US-07 |
| AC-08 | At 390 px width, then the layout is a single readable column with no horizontal scrolling. | US-08 |
| AC-09 | When I export and run the digest tool, then a Markdown digest groups overdue, due-this-week and high-priority tasks. | US-09 |

## 6. Non-functional requirements
- NFR-01 Privacy: no data leaves the browser; no third-party scripts.
- NFR-02 Accessibility: every input has a label; buttons are reachable by keyboard; colour is not the only signal.
- NFR-03 Performance: the page loads in under 1 second on a local server.
- NFR-04 Safety: user text is displayed with `textContent`, never `innerHTML`.

## 7. Data
Task = { id, title (1–120 chars), priority (low|medium|high), status (todo|done), dueDate (YYYY-MM-DD or empty), createdAt }.

## 8. Release decision (Day 5)
Release v1 when AC-01 to AC-09 pass, all automated tests pass, and one peer has reviewed the app.
