document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // Element References
  // =====================
  const todoCard         = document.getElementById("main-card");
  const toggleCheckbox   = document.getElementById("complete-toggle");
  const statusBadge      = document.getElementById("todo-status");
  const statusControl    = document.getElementById("status-control");
  const timeRemainingEl  = document.getElementById("time-remaining");
  const overdueIndicator = document.getElementById("overdue-indicator");
  const priorityBadge    = document.getElementById("priority-badge");
  const priorityIndicator= document.getElementById("priority-indicator");
  const titleEl          = document.getElementById("todo-title");
  const descEl           = document.getElementById("todo-desc");
  const dueDateDisplay   = document.getElementById("due-date-display");
  const editBtn          = document.getElementById("edit-btn");
  const deleteBtn        = document.getElementById("delete-btn");
  const editForm         = document.getElementById("edit-form");
  const editTitleInput   = document.getElementById("edit-title-input");
  const editDescInput    = document.getElementById("edit-desc-input");
  const editPrioritySelect = document.getElementById("edit-priority-select");
  const editDueDateInput = document.getElementById("edit-due-date-input");
  const saveBtn          = document.getElementById("save-btn");
  const cancelBtn        = document.getElementById("cancel-btn");
  const expandToggle     = document.getElementById("expand-toggle");
  const collapsibleSection = document.getElementById("collapsible-section");
  const addTaskBtn       = document.querySelector(".add-task-btn");
  const mainCard = document.querySelectorAll(".main-card")

  // =====================
  // State
  // =====================
  const DESCRIPTION_LIMIT = 120;
  let currentStatus   = "Pending";
  let currentPriority = "High";
  let targetDate      = new Date(2026, 3, 17, 12, 0, 0).getTime();
  let isExpanded      = false;
  let savedState      = {};

  // =====================
  // Priority
  // =====================
  function updatePriority(priority) {
    currentPriority = priority;

    // Badge
    priorityBadge.textContent = priority;
    priorityBadge.className   = `badge priority-${priority.toLowerCase()}`;
    priorityBadge.setAttribute("aria-label", `Priority: ${priority}`);

    // Indicator bar
    priorityIndicator.className = `priority-indicator priority-${priority.toLowerCase()}`;
  }

  // =====================
  // Status (single source of truth)
  // =====================
  function updateStatus(newStatus) {
    currentStatus = newStatus;

    // Sync checkbox
    toggleCheckbox.checked = newStatus === "Done";

    // Sync badge and status control text + class 
    statusBadge.textContent = newStatus;
    const badgeClass = "status-badge-" + newStatus.toLowerCase().replace(" ", "-");
    const statusControlClass = "status-select status-" + newStatus.toLowerCase().replace(" ", "-");
    statusBadge.className = `${badgeClass}`;
    statusControl.className = statusControlClass;

    // Sync dropdown
    statusControl.value = newStatus;

    // Sync card visual states
    todoCard.classList.toggle("completed",  newStatus === "Done");
    todoCard.classList.toggle("in-progress", newStatus === "In Progress");

    // Time display
    if (newStatus === "Done") {
      timeRemainingEl.textContent = "Completed";
      timeRemainingEl.style.color = "var(--success-green)";
      overdueIndicator.style.display = "none";
      todoCard.classList.remove("is-overdue");
    } else {
      updateTimeRemaining();
    }
  }

  // =====================
  // Time Remaining
  // =====================
  function updateTimeRemaining() {
    if (!document.body.contains(timeRemainingEl)) return;
    if (currentStatus === "Done") return;

    const now  = Date.now();
    const diff = targetDate - now;
    const MIN  = 60 * 1000;
    const HOUR = MIN * 60;
    const DAY  = HOUR * 24;

    if (diff < 0) {
      const abs = Math.abs(diff);
      overdueIndicator.style.display = "inline";
      todoCard.classList.add("is-overdue");
      timeRemainingEl.style.color = "var(--danger-red)";

      if (abs >= DAY) {
        const d = Math.round(abs / DAY);
        timeRemainingEl.textContent = `Overdue by ${d} day${d > 1 ? "s" : ""}`;
      } else if (abs >= HOUR) {
        const h = Math.round(abs / HOUR);
        timeRemainingEl.textContent = `Overdue by ${h} hour${h > 1 ? "s" : ""}`;
      } else if (abs >= MIN) {
        const m = Math.floor(abs / MIN);
        timeRemainingEl.textContent = `Overdue by ${m} minute${m > 1 ? "s" : ""}`;
      } else {
        timeRemainingEl.textContent = "Just overdue";
      }
    } else {
      overdueIndicator.style.display = "none";
      todoCard.classList.remove("is-overdue");
      timeRemainingEl.style.color = "var(--warning-orange)";

      if (diff >= DAY) {
        const d = Math.round(diff / DAY);
        timeRemainingEl.textContent = `Due in ${d} day${d > 1 ? "s" : ""}`;
      } else if (diff >= HOUR) {
        const h = Math.round(diff / HOUR);
        timeRemainingEl.textContent = `Due in ${h} hour${h > 1 ? "s" : ""}`;
      } else if (diff >= MIN) {
        const m = Math.floor(diff / MIN);
        timeRemainingEl.textContent = `Due in ${m} minute${m > 1 ? "s" : ""}`;
      } else {
        timeRemainingEl.textContent = "Due now!";
      }
    }
  }

  // =====================
  // Expand / Collapse
  // =====================
  function setupExpandCollapse() {
    const text = descEl.textContent.trim();
    if (text.length <= DESCRIPTION_LIMIT) {
      expandToggle.style.display = "none";
      collapsibleSection.classList.remove("collapsed");
      return;
    }
    expandToggle.style.display = "block";
    if (!isExpanded) {
      collapsibleSection.classList.add("collapsed");
      expandToggle.textContent = "Show more";
      expandToggle.setAttribute("aria-expanded", "false");
    }
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
    collapsibleSection.classList.toggle("collapsed", !isExpanded);
    expandToggle.setAttribute("aria-expanded", String(isExpanded));
    expandToggle.textContent = isExpanded ? "Show less" : "Show more";
  }

  // =====================
  // Edit Mode
  // =====================
  function formatDateTimeLocal(timestamp) {
    const d   = new Date(timestamp);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDisplayDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  }

  function openEditMode() {
    // Snapshot current values
    savedState = {
      title:    titleEl.textContent.trim(),
      desc:     descEl.textContent.trim(),
      priority: currentPriority,
      date:     targetDate,
    };

    // Populate inputs
    editTitleInput.value         = savedState.title;
    editDescInput.value          = savedState.desc;
    editPrioritySelect.value     = savedState.priority;
    editDueDateInput.value       = formatDateTimeLocal(savedState.date);

    // Show form
    editForm.style.display = "flex";
    editBtn.setAttribute("aria-expanded", "true");
    editTitleInput.focus();

    // Hide main card
    mainCard.forEach(element => {
      element.style.display = "none";
    });
  }

  function closeEditMode(save) {
    if (save) {
      const newTitle    = editTitleInput.value.trim();
      const newDesc     = editDescInput.value.trim();
      const newPriority = editPrioritySelect.value;
      const newDate     = new Date(editDueDateInput.value).getTime();

      if (newTitle)        titleEl.textContent = newTitle;
      if (newDesc)         descEl.textContent  = newDesc;
      updatePriority(newPriority);

      if (!isNaN(newDate)) {
        targetDate = newDate;
        dueDateDisplay.textContent = `Due ${formatDisplayDate(newDate)}`;
        dueDateDisplay.setAttribute("datetime", new Date(newDate).toISOString());
      }

      setupExpandCollapse();
      updateTimeRemaining();

    } else {
      // Restore snapshot
      titleEl.textContent = savedState.title;
      descEl.textContent  = savedState.desc;
    }

    editForm.style.display = "none";
    editBtn.setAttribute("aria-expanded", "false");
    editBtn.focus();

    // Show main card
    mainCard.forEach(element => {
      element.style.display = "block";
    });
  }

  // =====================
  // Delete
  // =====================
  function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      todoCard.remove();
      const container = document.querySelector(".container");
      if (container) {
        container.innerHTML = '<p style="text-align:center;color:#86868b;margin-top:40px;">All tasks cleared. Good work!</p>';
      }
    }
  }

  // =====================
  // Event Listeners
  // =====================
  toggleCheckbox.addEventListener("change", (e) => {
    updateStatus(e.target.checked ? "Done" : "Pending");
  });

  statusControl.addEventListener("change", (e) => {
    updateStatus(e.target.value);
  });

  expandToggle.addEventListener("click", toggleExpand);

  editBtn.addEventListener("click", openEditMode);
  saveBtn.addEventListener("click", () => closeEditMode(true));
  cancelBtn.addEventListener("click", () => closeEditMode(false));
  deleteBtn.addEventListener("click", handleDelete);

  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => alert("This feature is coming soon..."));
  }

  // =====================
  // Init
  // =====================
  updatePriority("High");
  updateTimeRemaining();
  setupExpandCollapse();
  setInterval(updateTimeRemaining, 30000);
});
