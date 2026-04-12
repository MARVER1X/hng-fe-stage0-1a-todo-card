document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("complete-toggle");
  const todoCard = document.getElementById("main-card");
  const statusBadge = document.getElementById("todo-status");
  const timeRemainingElement = document.getElementById("time-remaining");
  const editBtn = document.getElementById("edit-btn");
  const deleteBtn = document.getElementById("delete-btn");
  
  // Title and Description Elements for Editing
  const titleElement = document.getElementById("todo-title");
  const descElement = document.getElementById("todo-desc");
  
  // Dummy Add Task Button
  const addTaskBtn = document.querySelector(".add-task-btn");
  if(addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      alert("This feature is coming soon...");
    });
  }

// Year, Month (0-11), Day, Hour, Minute, Second
const targetDate = new Date(2026, 3, 16, 12, 0, 0).getTime();


  function updateTimeRemaining() {
    // If the card was deleted from the DOM, stop the interval calculations
    if (!document.body.contains(timeRemainingElement)) return;

    const now = new Date().getTime();
    const difference = targetDate - now;
    console.log(difference)
    const oneMinute = 1000 * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;

    if (difference < 0) {
    const overdueDays = Math.round(Math.abs(difference) / oneDay);
    const overdueHours = Math.round((Math.abs(difference) % oneDay) / oneHour);
    const overdueMinutes = Math.floor((Math.abs(difference) % oneHour) / oneMinute);
      if (overdueDays > 0) {
        timeRemainingElement.textContent = `Overdue by ${overdueDays} day(s)`;
        timeRemainingElement.style.color = "var(--danger-red)";
        return;
      }
      else if (overdueHours > 0) {
        timeRemainingElement.textContent = `Overdue by ${overdueHours} hour(s)`;
        timeRemainingElement.style.color = "var(--danger-red)";
        return;
      }
      else if (overdueMinutes > 0) {
        timeRemainingElement.textContent = `Overdue by ${overdueMinutes} min(s)`;
        timeRemainingElement.style.color = "var(--danger-red)";
        return;
      }
    }

    const daysLeft = Math.round(difference / oneDay);
    const hoursLeft = Math.round((difference % oneDay) / oneHour);
    const minutesLeft = Math.floor((difference % oneHour) / oneMinute);


    if (daysLeft > 1) {
      timeRemainingElement.textContent = `Due in ${daysLeft} day(s)`;
    } else if (daysLeft === 1) {
      timeRemainingElement.textContent = "Due tomorrow";
    } else if (hoursLeft > 0) {
      timeRemainingElement.textContent = `Due in ${hoursLeft} hour(s)`;
    } else if (minutesLeft > 0) {
      timeRemainingElement.textContent = `Due in ${minutesLeft} minute(s)`;
    }
      else if (Math.abs(difference) < oneMinute) {
      timeRemainingElement.textContent = "Due now!";
}
  }

  // Handle strictly "Done" state for auto-grader
  function handleCompleteToggle(event) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      todoCard.classList.add("completed");
      timeRemainingElement.textContent = "";
      statusBadge.textContent = "Done"; 
      statusBadge.classList.replace("status-pending", "status-done");
    } else {
      updateTimeRemaining();
      todoCard.classList.remove("completed");
      statusBadge.textContent = "Pending";
      statusBadge.classList.replace("status-done", "status-pending");
    }
  }

  // Handle Edit Logic using Native Prompts
  function handleEdit() {
    const currentTitle = titleElement.textContent;
    const newTitle = prompt("Edit Task Title:", currentTitle);
    
    if (newTitle !== null && newTitle.trim() !== "") {
      titleElement.textContent = newTitle.trim();
    }

    const currentDesc = descElement.textContent;
    const newDesc = prompt("Edit Task Description:", currentDesc);

    if (newDesc !== null && newDesc.trim() !== "") {
      descElement.textContent = newDesc.trim();
    }
  }

  // Handle Delete Logic (Removes the node)
  function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      todoCard.remove();
      const container = document.querySelector(".container");
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">All tasks cleared. Good work!</p>';
    }
  }

  toggleCheckbox.addEventListener("change", handleCompleteToggle);
  editBtn.addEventListener("click", handleEdit);
  deleteBtn.addEventListener("click", handleDelete);

  updateTimeRemaining();
  setInterval(updateTimeRemaining, 30000);

 });