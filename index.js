function updateTimeRemaining() {
  const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
  const remainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');

  const dueDate = new Date(dueDateElement.getAttribute("datetime"));
  const now = new Date();

  const diff = dueDate - now;

  if (diff <= 0) {
    remainingElement.textContent = "Overdue";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  remainingElement.textContent = `Due in ${days} days and ${hours} hours`;
}

updateTimeRemaining();

setInterval(updateTimeRemaining, 30000);