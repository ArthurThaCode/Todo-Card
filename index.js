let state = {
  title: "Learn Frontend",
  description: "Create an interactive Todo Card for testing. This is a longer description to show how the expand and collapse functionality works on the advanced component. We want to make sure it handles truncation gracefully.",
  priority: "High",
  dueDate: "2026-04-20T12:00",
  status: "Pending",
  isExpanded: false,
  isEditing: false
};

const todoCard = document.getElementById('todoCard');
const viewMode = document.getElementById('viewMode');
const viewTitle = document.querySelector('[data-testid="test-todo-title"]');
const viewDescription = document.querySelector('[data-testid="test-todo-description"]');
const viewPriority = document.querySelector('[data-testid="test-todo-priority"]');
const viewPriorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const viewDueDate = document.querySelector('[data-testid="test-todo-due-date"]');
const viewTimeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const viewStatus = document.querySelector('[data-testid="test-todo-status"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');

const completeToggle = document.getElementById('completeToggle');
const statusSelect = document.getElementById('statusSelect');
const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const editBtn = document.getElementById('editBtn');

const editForm = document.getElementById('editForm');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editPriority = document.getElementById('editPriority');
const editDueDate = document.getElementById('editDueDate');
const cancelBtn = document.getElementById('cancelBtn');

let timerInterval;

function init() {
  render();
  startTimer();
  setupEventListeners();
}

function render() {
  viewTitle.textContent = state.title;
  viewDescription.textContent = state.description;
  viewPriority.textContent = state.priority;
  
  const dateObj = new Date(state.dueDate);
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
  viewDueDate.textContent = formatter.format(dateObj);
  viewDueDate.setAttribute('datetime', state.dueDate);

  viewStatus.textContent = state.status;

  todoCard.className = 'todo-card'; 
  
  viewPriorityIndicator.className = `priority-indicator priority-${state.priority}`;

  if (state.status === "Done") {
    todoCard.classList.add('state-done');
  } else if (state.status === "In Progress") {
    todoCard.classList.add('state-in-progress');
  }

  completeToggle.checked = (state.status === "Done");
  statusSelect.value = state.status;

  if (state.isEditing) {
    viewMode.classList.add('hidden');
    editForm.classList.remove('hidden');
    editTitle.focus();
  } else {
    viewMode.classList.remove('hidden');
    editForm.classList.add('hidden');
    editBtn.focus();
  }

  if (state.isExpanded) {
    collapsibleSection.classList.remove('collapsed');
    collapsibleSection.classList.add('expanded');
    expandToggle.textContent = 'Show less';
    expandToggle.setAttribute('aria-expanded', 'true');
  } else {
    collapsibleSection.classList.add('collapsed');
    collapsibleSection.classList.remove('expanded');
    expandToggle.textContent = 'Show more';
    expandToggle.setAttribute('aria-expanded', 'false');
  }

  updateTimeRemaining();
}

function updateTimeRemaining() {
  if (state.status === "Done") {
    viewTimeRemaining.textContent = "Completed";
    viewTimeRemaining.style.color = "#10b981";
    overdueIndicator.classList.add('hidden');
    todoCard.classList.remove('is-overdue');
    return;
  } else {
    viewTimeRemaining.style.color = "";
  }

  const dueDate = new Date(state.dueDate);
  const now = new Date();
  const diffMs = dueDate - now;

  if (diffMs <= 0) {
    const overdueDiff = Math.abs(diffMs);
    const hoursOverdue = Math.floor(overdueDiff / (1000 * 60 * 60));
    
    viewTimeRemaining.textContent = `Overdue by ${hoursOverdue} hour${hoursOverdue !== 1 ? 's' : ''}`;
    overdueIndicator.classList.remove('hidden');
    todoCard.classList.add('is-overdue');
    return;
  }

  overdueIndicator.classList.add('hidden');
  todoCard.classList.remove('is-overdue');

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);

  if (days > 0) {
    viewTimeRemaining.textContent = `Due in ${days} days`;
  } else if (hours > 0) {
    viewTimeRemaining.textContent = `Due in ${hours} hours`;
  } else {
    viewTimeRemaining.textContent = `Due in ${minutes} minutes`;
  }
}

function startTimer() {
  updateTimeRemaining();
  timerInterval = setInterval(updateTimeRemaining, 30000); // every 30 secs
}

function handleEditClick() {
  editTitle.value = state.title;
  editDescription.value = state.description;
  editPriority.value = state.priority;
  editDueDate.value = state.dueDate;

  state.isEditing = true;
  render();
}

function handleCancelClick() {
  state.isEditing = false;
  render();
}

function handleSaveClick(e) {
  e.preventDefault(); //
  
  state.title = editTitle.value;
  state.description = editDescription.value;
  state.priority = editPriority.value;
  state.dueDate = editDueDate.value;
  state.isEditing = false;
  
  render();
}

function handleStatusSelect(e) {
  const newStatus = e.target.value;
  state.status = newStatus;
  render();
}

function handleCheckboxToggle(e) {
  const isChecked = e.target.checked;
  if (isChecked) {
    state.status = "Done";
  } else {
    state.status = "Pending";
  }
  render();
}

function handleExpandToggle() {
  state.isExpanded = !state.isExpanded;
  render();
}

function setupEventListeners() {
  editBtn.addEventListener('click', handleEditClick);
  cancelBtn.addEventListener('click', handleCancelClick);
  editForm.addEventListener('submit', handleSaveClick);

  statusSelect.addEventListener('change', handleStatusSelect);
  completeToggle.addEventListener('change', handleCheckboxToggle);

  expandToggle.addEventListener('click', handleExpandToggle);
}

init();