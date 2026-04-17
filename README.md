# HNG Stage 0 — Todo Task Card

A clean, accessible, and responsive Todo Card component built with vanilla HTML, CSS, and JavaScript. Submitted as part of the HNG Internship i14 Frontend track Stage 0 task.

---

## 🔗 Live Demo

[View Live on GitHub Pages](https://MARVER1X.github.io/hng-fe-stage0-1a-todo-card/)

---

## 📸 Preview

> A single task card component featuring priority badges, live time-remaining countdown, status toggling, inline editing, and full keyboard/screen-reader accessibility.

---

## ✅ Features

- **Task Card** with title, description, priority badge, and status indicator
- **Live Countdown** — calculates and displays time remaining (e.g. "Due in 3 days", "Due tomorrow", "Overdue by 2 hours"), updating every 30 seconds
- **Checkbox Toggle** — marks task as Done with strikethrough title and updated status badge
- **Inline Edit** — prompts user to update title and description in place
- **Delete** — removes the card from the DOM with a confirmation dialog
- **Tags/Categories** — displays chip-style labels (Urgent, Work, Backend)
- **Fully Accessible** — keyboard navigable, screen-reader friendly, WCAG AA compliant contrast
- **Responsive** — works cleanly from 320px to 1200px with no horizontal overflow

---

## 🧪 Testability

All required `data-testid` attributes are implemented and match the spec exactly:

| Element | `data-testid` |
|---|---|
| Card root | `test-todo-card` |
| Task title | `test-todo-title` |
| Description | `test-todo-description` |
| Priority badge | `test-todo-priority` |
| Due date | `test-todo-due-date` |
| Time remaining | `test-todo-time-remaining` |
| Status badge | `test-todo-status` |
| Checkbox toggle | `test-todo-complete-toggle` |
| Tags container | `test-todo-tags` |
| Urgent tag | `test-todo-tag-urgent` |
| Work tag | `test-todo-tag-work` |
| Edit button | `test-todo-edit-button` |
| Delete button | `test-todo-delete-button` |

---

## ♿ Accessibility

- Checkbox has an accessible name via a visually hidden `<span class="sr-only">` label
- Focus styles visible on checkbox, edit, and delete (`:focus-visible` outlines)
- `aria-live="polite"` on the time-remaining element for live updates
- `aria-label` on the priority badge
- All interactive elements are `<button>` or `<input>` — no div-click hacks
- Fully keyboard navigable: `Tab` → checkbox → edit → delete

---

## 🗂️ Project Structure

```
├── index.html     # Semantic markup and card structure
├── styles.css     # Apple-inspired dark theme, responsive layout
└── script.js      # Countdown logic, toggle, edit, delete behaviour
```

---

## 🛠️ Built With

- HTML5 (semantic elements: `article`, `header`, `footer`, `time`, `ul`)
- CSS3 (custom properties, flexbox, media queries)
- Vanilla JavaScript (no frameworks, no libraries)

---

## 🚀 Running Locally

No build step needed. Just clone and open:

```bash
git clone https://github.com/MARVER1X/hng-fe-stage0-1a-todo-card.git
cd hng-fe-stage0-1a-todo-card
# Open index.html in your browser
```
---

## 🚀 Update — Stage 1A (Advanced Features)

This project has been extended with more advanced interactivity and state management.

### ✨ New Additions

- **Edit Mode** — inline form to update title, description, priority, and due date (with save/cancel)
- **Status Control** — dropdown for switching between Pending, In Progress, and Done
- **Priority Indicator Bar** — dynamic color strip based on task priority
- **Expand / Collapse** — long descriptions can be toggled (Show more / less)
- **Overdue Indicator** — visual alert when a task passes its due date
- **Synced State Logic** — checkbox, status badge, and dropdown stay consistent
- **Improved Time Display** — more precise countdown (days, hours, minutes)
---

## 👤 Author

**Marvellous**
- GitHub: [@MARVER1X](https://github.com/MARVER1X)

---

*Submitted for HNG Internship i14 — Frontend Stage 0*
