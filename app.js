const STORAGE_KEY = "daily-tasks-v1";
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const count = document.querySelector("#task-count");
const progressCount = document.querySelector("#progress-count");
const progressFill = document.querySelector("#progress-fill");
const emptyState = document.querySelector("#empty-state");
const clearButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(task => task && typeof task.id === "string" && typeof task.text === "string" && typeof task.completed === "boolean")
      : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();
let filter = "all";

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Tasks remain usable for this session if browser storage is unavailable.
  }
}

function render() {
  const visible = tasks.filter(task => filter === "all" || (filter === "completed") === task.completed);
  const remaining = tasks.filter(task => !task.completed).length;
  const completed = tasks.length - remaining;
  list.replaceChildren();

  for (const task of visible) {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} ${task.completed ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      render();
    });

    const label = document.createElement("span");
    label.className = "task-text";
    label.textContent = task.text;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    remove.addEventListener("click", () => {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      render();
    });

    item.append(checkbox, label, remove);
    list.append(item);
  }

  count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  progressCount.textContent = `${completed} of ${tasks.length} done`;
  progressFill.style.width = `${tasks.length ? Math.round(completed / tasks.length * 100) : 0}%`;
  emptyState.hidden = visible.length > 0;
  emptyState.textContent = tasks.length === 0
    ? "No tasks yet. Add one above to get started."
    : `No ${filter === "all" ? "tasks" : filter + " tasks"} here.`;
  clearButton.disabled = !tasks.some(task => task.completed);
  for (const button of filterButtons) {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
  input.value = "";
  filter = "all";
  saveTasks();
  render();
  input.focus();
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    render();
  });
}

clearButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
});

render();
